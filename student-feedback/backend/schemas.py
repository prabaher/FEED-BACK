from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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

class EventResponse(BaseModel):
    id: int
    event_name: str
    description: Optional[str]
    event_date: str
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class EventFeedbackCreate(BaseModel):
    rating: float
    feedback_text: str
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
