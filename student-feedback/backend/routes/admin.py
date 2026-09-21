from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models import Student, Event, GeneralFeedback, EventFeedback
from schemas import StudentResponse, EventCreate, EventResponse, StudentCreate
from auth import verify_token, get_bearer_token, hash_password
from services.student_import import import_students_from_excel, import_students_from_json
from typing import List
import tempfile

router = APIRouter(prefix="/admin", tags=["admin"])

def get_current_admin(token: str):
    payload = verify_token(token)
    if not payload or payload.get("type") != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return payload.get("sub")

@router.get("/stats")
def get_admin_stats(token: str = Depends(get_bearer_token), db: Session = Depends(get_db)):
    get_current_admin(token)
    return {
        "students": db.query(Student).count(),
        "general_feedback": db.query(GeneralFeedback).count(),
        "events": db.query(Event).count(),
        "event_feedback": db.query(EventFeedback).count()
    }

@router.get("/students", response_model=List[StudentResponse])
def get_all_students(token: str = Depends(get_bearer_token), db: Session = Depends(get_db)):
    get_current_admin(token)
    return db.query(Student).all()

@router.post("/students", response_model=dict)
def create_student(student: StudentCreate, token: str = Depends(get_bearer_token), db: Session = Depends(get_db)):
    get_current_admin(token)
    if not student.register_no or not student.name or not student.dob or not student.department or not student.year or not student.section:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="All student fields are required")
    if db.query(Student).filter(Student.register_no == student.register_no).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Student with this register number already exists")
    new_student = Student(
        register_no=student.register_no,
        name=student.name,
        dob=student.dob,
        department=student.department,
        year=student.year,
        section=student.section,
        password_hash=hash_password(student.dob),
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return {"status": "success", "message": "Student added successfully", "student_id": new_student.id}

@router.post("/students/import-excel")
def import_students_excel(token: str = Depends(get_bearer_token), file: UploadFile = File(...), db: Session = Depends(get_db)):
    get_current_admin(token)
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp:
            tmp.write(file.file.read())
            tmp.flush()
            temp_path = tmp.name
        return import_students_from_excel(temp_path, db)
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.post("/students/import-json")
def import_students_json(token: str = Depends(get_bearer_token), file: UploadFile = File(...), db: Session = Depends(get_db)):
    get_current_admin(token)
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp:
            tmp.write(file.file.read())
            tmp.flush()
            temp_path = tmp.name
        return import_students_from_json(temp_path, db)
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.post("/events")
def create_event(event: EventCreate, token: str = Depends(get_bearer_token), db: Session = Depends(get_db)):
    get_current_admin(token)
    new_event = Event(event_name=event.event_name, description=event.description, event_date=event.event_date, status=event.status)
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return {"status": "success", "event_id": new_event.id}

@router.get("/events", response_model=List[EventResponse])
def get_admin_events(token: str = Depends(get_bearer_token), db: Session = Depends(get_db)):
    get_current_admin(token)
    return db.query(Event).all()

@router.put("/events/{event_id}")
def update_event(event_id: int, event: EventCreate, token: str = Depends(get_bearer_token), db: Session = Depends(get_db)):
    get_current_admin(token)
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    db_event.event_name = event.event_name
    db_event.description = event.description
    db_event.event_date = event.event_date
    db_event.status = event.status
    db.commit()
    return {"status": "success"}

@router.delete("/events/{event_id}")
def delete_event(event_id: int, token: str = Depends(get_bearer_token), db: Session = Depends(get_db)):
    get_current_admin(token)
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(db_event)
    db.commit()
    return {"status": "success"}

@router.get("/feedback/general")
def get_general_feedback(token: str = Depends(get_bearer_token), db: Session = Depends(get_db)):
    get_current_admin(token)
    feedbacks = db.query(GeneralFeedback).all()
    result = []
    for fb in feedbacks:
        fb_dict = {"id": fb.id, "rating": fb.rating, "feedback_text": fb.feedback_text, "created_at": fb.created_at, "show_name": fb.show_name, "show_register_no": fb.show_register_no}
        fb_dict["student_name"] = fb.student.name if fb.show_name else "Anonymous Student"
        fb_dict["register_no"] = fb.student.register_no if fb.show_register_no else None
        result.append(fb_dict)
    return result

@router.get("/feedback/events/{event_id}")
def get_event_feedback(event_id: int, token: str = Depends(get_bearer_token), db: Session = Depends(get_db)):
    get_current_admin(token)
    feedbacks = db.query(EventFeedback).filter(EventFeedback.event_id == event_id).all()
    result = []
    for fb in feedbacks:
        fb_dict = {"id": fb.id, "rating": fb.rating, "feedback_text": fb.feedback_text, "created_at": fb.created_at, "show_name": fb.show_name, "show_register_no": fb.show_register_no}
        fb_dict["student_name"] = fb.student.name if fb.show_name else "Anonymous Student"
        fb_dict["register_no"] = fb.student.register_no if fb.show_register_no else None
        result.append(fb_dict)
    return result
