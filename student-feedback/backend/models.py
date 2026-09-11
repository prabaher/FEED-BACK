from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    register_no = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    dob = Column(String(10), nullable=False)
    department = Column(String(100), nullable=False)
    year = Column(String(10), nullable=False)
    section = Column(String(10), nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    general_feedbacks = relationship("GeneralFeedback", back_populates="student")
    event_feedbacks = relationship("EventFeedback", back_populates="student")

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    event_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    event_date = Column(String(10), nullable=False)
    status = Column(String(20), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)
    event_feedbacks = relationship("EventFeedback", back_populates="event")

class GeneralFeedback(Base):
    __tablename__ = "general_feedback"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False, unique=True)
    rating = Column(Float, nullable=False)
    feedback_text = Column(Text, nullable=False)
    show_name = Column(Boolean, default=True)
    show_register_no = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    student = relationship("Student", back_populates="general_feedbacks")

class EventFeedback(Base):
    __tablename__ = "event_feedback"
    __table_args__ = (UniqueConstraint("student_id", "event_id", name="unique_student_event"),)
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    rating = Column(Float, nullable=False)
    feedback_text = Column(Text, nullable=False)
    show_name = Column(Boolean, default=True)
    show_register_no = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    event = relationship("Event", back_populates="event_feedbacks")
    student = relationship("Student", back_populates="event_feedbacks")

class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
