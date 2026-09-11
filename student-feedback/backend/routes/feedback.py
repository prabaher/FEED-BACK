from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import GeneralFeedback
from schemas import GeneralFeedbackCreate
from auth import verify_token, get_bearer_token

router = APIRouter(prefix="/feedback", tags=["feedback"])

def get_current_student(token: str) -> int:
    payload = verify_token(token)
    if not payload or payload.get("type") != "student":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return int(payload.get("sub"))

@router.post("/general", response_model=dict)
def submit_general_feedback(feedback: GeneralFeedbackCreate, token: str = Depends(get_bearer_token), db: Session = Depends(get_db)):
    student_id = get_current_student(token)
    if db.query(GeneralFeedback).filter(GeneralFeedback.student_id == student_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already submitted general feedback")
    if feedback.rating < 1 or feedback.rating > 5:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rating must be between 1 and 5")
    if not feedback.feedback_text.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Feedback cannot be empty")
    
    general_feedback = GeneralFeedback(student_id=student_id, rating=feedback.rating, feedback_text=feedback.feedback_text, show_name=feedback.show_name, show_register_no=feedback.show_register_no)
    db.add(general_feedback)
    db.commit()
    return {"status": "success", "message": "Feedback submitted successfully"}

@router.get("/general/my")
def get_my_general_feedback(token: str = Depends(get_bearer_token), db: Session = Depends(get_db)):
    student_id = get_current_student(token)
    feedback = db.query(GeneralFeedback).filter(GeneralFeedback.student_id == student_id).first()
    if not feedback:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No feedback found")
    return feedback
