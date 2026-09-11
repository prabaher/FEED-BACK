from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Student
from schemas import StudentLogin, TokenResponse, AdminLogin, AdminTokenResponse
from auth import verify_password, create_access_token
import os

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
def student_login(credentials: StudentLogin, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.register_no == credentials.register_no).first()
    if not student or not verify_password(credentials.password, student.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid register number or password")
    access_token = create_access_token(data={"sub": str(student.id), "type": "student"})
    return {"access_token": access_token, "token_type": "bearer", "student_id": student.id, "student_name": student.name}

@router.post("/admin-login", response_model=AdminTokenResponse)
def admin_login(credentials: AdminLogin):
    if credentials.username != os.getenv("ADMIN_USERNAME") or credentials.password != os.getenv("ADMIN_PASSWORD"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials")
    access_token = create_access_token(data={"sub": "admin", "type": "admin"})
    return {"access_token": access_token, "token_type": "bearer", "admin_id": 1}
