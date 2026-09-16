from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_tables, SessionLocal
from models import Student
from routes import auth, feedback, events, admin
from services.student_import import import_students_from_json
from pathlib import Path
import os


app = FastAPI(title="Student Feedback Hub API", version="1.0.0")

allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://feed-back-seven-gamma.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.on_event("startup")
def startup_event():
    create_tables()
    db = SessionLocal()
    try:
        if db.query(Student).count() == 0:
            demo_file = Path(__file__).parent / "data" / "students_demo.json"
            result = import_students_from_json(str(demo_file), db)
            if result.get("status") != "success":
                raise RuntimeError(result.get("message", "Unable to seed demo students"))
    finally:
        db.close()

app.include_router(auth.router)
app.include_router(feedback.router)
app.include_router(events.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "Student Feedback Hub API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
