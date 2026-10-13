import json
import time
import urllib.request
import urllib.error

BASE = "http://127.0.0.1:8000"
PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="

results = []


def call(method, path, body=None, token=None):
    req = urllib.request.Request(BASE + path, method=method)
    data = None
    if body is not None:
        data = json.dumps(body).encode()
        req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", "Bearer " + token)
    try:
        with urllib.request.urlopen(req, data=data, timeout=15) as resp:
            return resp.status, json.loads(resp.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode() or "{}")
        except Exception:
            return e.code, {}


def check(name, cond, extra=""):
    results.append((name, bool(cond), extra))
    print(("PASS " if cond else "FAIL ") + name + (" -> " + str(extra) if extra and not cond else ""))


# wait for server
for _ in range(40):
    try:
        status, _ = call("GET", "/health")
        if status == 200:
            break
    except Exception:
        time.sleep(0.5)
else:
    print("SERVER NEVER READY")
    raise SystemExit(1)

# admin login
status, admin = call("POST", "/auth/admin-login", {"username": "admin", "password": "admin123"})
check("admin login", status == 200, status)
at = admin.get("access_token")

# create event with questions
status, created = call("POST", "/admin/events", {
    "event_name": "SMOKE FEST", "description": "desc", "event_date": "01-01-2027",
    "status": "Active", "questions": ["How was the food?", "  ", "Would you attend again?"]
}, at)
check("create event with questions", status == 200 and created.get("event_id"), (status, created))
eid = created.get("event_id")

# upload image
status, r = call("POST", f"/admin/events/{eid}/image", {"image_base64": PNG}, at)
check("upload event image", status == 200, (status, r))

# admin list: image + questions parsed
status, events = call("GET", "/admin/events", token=at)
ev = next((e for e in events if e["id"] == eid), None)
check("admin list has image_url", ev and ev.get("image_url", "").startswith("data:image/"))
check("questions stored as 2 cleaned strings", ev and ev.get("questions") == ["How was the food?", "Would you attend again?"], ev and ev.get("questions"))

# update event
status, r = call("PUT", f"/admin/events/{eid}", {
    "event_name": "SMOKE FEST v2", "description": "desc2", "event_date": "02-01-2027",
    "status": "Closed", "questions": ["Updated question?"]
}, at)
check("update event", status == 200, (status, r))
status, events = call("GET", "/admin/events", token=at)
ev = next((e for e in events if e["id"] == eid), None)
check("update applied", ev and ev["event_name"] == "SMOKE FEST v2" and ev["status"] == "Closed" and ev["questions"] == ["Updated question?"], ev)

# events are Closed now; reopen for feedback test
status, r = call("PUT", f"/admin/events/{eid}", {
    "event_name": "SMOKE FEST v2", "description": "desc2", "event_date": "02-01-2027",
    "status": "Active", "questions": ["Updated question?"]
}, at)
check("reopen event", status == 200, (status, r))

# remove image
status, r = call("DELETE", f"/admin/events/{eid}/image", token=at)
check("remove image", status == 200, (status, r))
status, events = call("GET", "/admin/events", token=at)
ev = next((e for e in events if e["id"] == eid), None)
check("image removed", ev and ev.get("image_url") is None, ev)

# re-upload for later checks
call("POST", f"/admin/events/{eid}/image", {"image_base64": PNG}, at)

# student login (demo seed)
status, stu = call("POST", "/auth/login", {"register_no": "71504243063", "password": "11-05-2006"})
check("student login", status == 200, status)
st = stu.get("access_token")

# student sees event with image + questions
status, pub = call("GET", f"/events/{eid}")
check("public event has image + questions", status == 200 and pub.get("image_url", "").startswith("data:image/") and pub.get("questions") == ["Updated question?"], (status, pub))

# bad answers rejected (event has 1 question)
status, r = call("POST", f"/events/{eid}/feedback", {"rating": 5, "feedback_text": "great", "answers": []}, st)
check("missing answers rejected", status == 400, (status, r))
status, r = call("POST", f"/events/{eid}/feedback", {"rating": 5, "feedback_text": "great", "answers": ["", ""]}, st)
check("empty answer rejected", status == 400, (status, r))

# good feedback on event with 1 question
status, r = call("POST", f"/events/{eid}/feedback", {"rating": 5, "feedback_text": "great event", "answers": ["Awesome!"], "show_name": True, "show_register_no": False}, st)
check("feedback with answers submitted", status == 200, (status, r))

# admin sees answers
status, fbs = call("GET", f"/admin/feedback/events/{eid}", token=at)
check("admin feedback includes answers", status == 200 and fbs and fbs[0].get("answers") == ["Awesome!"], (status, fbs))

# second event with 2 questions + second student: count mismatch must fail
status, created2 = call("POST", "/admin/events", {"event_name": "TWO Q EVENT", "event_date": "04-04-2027", "questions": ["Q one?", "Q two?"]}, at)
eid_b = created2.get("event_id")
status, stu2 = call("POST", "/auth/login", {"register_no": "715024243026", "password": "14-11-2006"})
check("second student login", status == 200, status)
st2 = stu2.get("access_token")
status, r = call("POST", f"/events/{eid_b}/feedback", {"rating": 4, "feedback_text": "ok", "answers": ["one only"]}, st2)
check("wrong answer count rejected", status == 400, (status, r))
status, r = call("POST", f"/events/{eid_b}/feedback", {"rating": 4, "feedback_text": "ok", "answers": ["A1", "A2"]}, st2)
check("2-question feedback accepted", status == 200, (status, r))
status, fbs = call("GET", f"/admin/feedback/events/{eid_b}", token=at)
check("2 answers visible to admin", status == 200 and fbs and fbs[0].get("answers") == ["A1", "A2"], (status, fbs))
status, r = call("DELETE", f"/admin/events/{eid_b}", token=at)
check("delete 2-question event", status == 200, (status, r))

# duplicate blocked (unchanged behavior)
status, r = call("POST", f"/events/{eid}/feedback", {"rating": 4, "feedback_text": "again", "answers": ["a", "b"]}, st)
check("duplicate feedback still blocked", status == 400, (status, r))

# THE KEY FIX: delete event that has feedback rows
status, r = call("DELETE", f"/admin/events/{eid}", token=at)
check("delete event with feedback works", status == 200, (status, r))
status, events = call("GET", "/admin/events", token=at)
check("event gone after delete", not any(e["id"] == eid for e in events))

# invalid image rejected
status, created = call("POST", "/admin/events", {"event_name": "IMG TEST", "event_date": "03-03-2027"}, at)
eid2 = created.get("event_id")
status, r = call("POST", f"/admin/events/{eid2}/image", {"image_base64": "not-an-image"}, at)
check("invalid image rejected", status == 400, (status, r))
status, r = call("DELETE", f"/admin/events/{eid2}", token=at)
check("cleanup delete ok", status == 200, (status, r))

fails = [n for n, ok, _ in results if not ok]
print(f"\n{len(results) - len(fails)}/{len(results)} passed")
if fails:
    print("FAILED:", fails)
    raise SystemExit(1)
print("ALL PASS")
