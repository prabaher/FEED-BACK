from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Event, EventFeedback
from schemas import EventResponse, EventFeedbackCreate
from auth import verify_token, get_bearer_token
from typing import List

router = APIRouter(prefix="/events", tags=["events"])

def get_current_student(token: str) -> int:
    payload = verify_token(token)
    if not payload or payload.get("type") != "student":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return int(payload.get("sub"))

@router.get("/", response_model=List[EventResponse])
def get_all_events(db: Session = Depends(get_db)):
    return db.query(Event).filter(Event.status == "Active").all()

@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return event

@router.post("/{event_id}/feedback", response_model=dict)
def submit_event_feedback(event_id: int, feedback: EventFeedbackCreate, token: str = Depends(get_bearer_token), db: Session = Depends(get_db)):
    student_id = get_current_student(token)
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    if event.status != "Active":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This event is no longer accepting feedback")
    if db.query(EventFeedback).filter(EventFeedback.student_id == student_id, EventFeedback.event_id == event_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already submitted feedback for this event")
    if feedback.rating < 1 or feedback.rating > 5:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rating must be between 1 and 5")
    if not feedback.feedback_text.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Feedback cannot be empty")
    
    event_feedback = EventFeedback(event_id=event_id, student_id=student_id, rating=feedback.rating, feedback_text=feedback.feedback_text, show_name=feedback.show_name, show_register_no=feedback.show_register_no)
    db.add(event_feedback)
    db.commit()
    return {"status": "success", "message": "Event feedback submitted successfully"}

@router.get("/{event_id}/feedback/my")
def get_my_event_feedback(event_id: int, token: str = Depends(get_bearer_token), db: Session = Depends(get_db)):
    student_id = get_current_student(token)
    feedback = db.query(EventFeedback).filter(EventFeedback.student_id == student_id, EventFeedback.event_id == event_id).first()
    if not feedback:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No feedback found for this event")
    return feedback
