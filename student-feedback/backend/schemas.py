from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
import json

class StudentCreate(BaseModel):
    register_no: str
    name: str
    dob: str
    department: str
    year: str
    section: str

class StudentResponse(BaseModel):
    id: int
    register_no: str
    name: str
    department: str
    year: str
    section: str
    class Config:
        from_attributes = True

class StudentLogin(BaseModel):
    register_no: str
    password: str

class GeneralFeedbackCreate(BaseModel):
    rating: float
    feedback_text: str
    show_name: bool = True
    show_register_no: bool = False

class GeneralFeedbackResponse(BaseModel):
    id: int
    rating: float
    feedback_text: str
    created_at: datetime
    show_name: bool
    show_register_no: bool
    student: Optional[StudentResponse] = None
    class Config:
        from_attributes = True

class EventCreate(BaseModel):
    event_name: str
    description: Optional[str] = None
    event_date: str
    status: str = "Active"
    questions: Optional[List[str]] = None

    @field_validator("questions")
    @classmethod
    def clean_questions(cls, v):
        if not v:
            return None
        cleaned = [q.strip() for q in v if q and q.strip()]
        return cleaned or None

class EventResponse(BaseModel):
    id: int
    event_name: str
    description: Optional[str]
    event_date: str
    status: str
    image_url: Optional[str] = None
    questions: Optional[List[str]] = None
    created_at: datetime

    @field_validator("questions", mode="before")
    @classmethod
    def parse_questions(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (ValueError, TypeError):
                return None
        return v

    class Config:
        from_attributes = True

class EventImageUpload(BaseModel):
    image_base64: str

class EventFeedbackCreate(BaseModel):
    rating: float
    feedback_text: str
    answers: Optional[List[str]] = None
    show_name: bool = True
    show_register_no: bool = False

class EventFeedbackResponse(BaseModel):
    id: int
    event_id: int
    rating: float
    feedback_text: str
    created_at: datetime
    show_name: bool
    show_register_no: bool
    student: Optional[StudentResponse] = None
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    student_id: int
    student_name: str

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminTokenResponse(BaseModel):
    access_token: str
    token_type: str
    admin_id: int
