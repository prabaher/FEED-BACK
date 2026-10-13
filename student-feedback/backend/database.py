from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)
    ensure_columns()

def ensure_columns():
    """Add any missing columns to existing tables (create_all never alters tables)."""
    wanted = {
        "events": {"image_url": "TEXT", "questions": "TEXT"},
        "event_feedback": {"answers": "TEXT"},
    }
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())
    for table, columns in wanted.items():
        if table not in existing_tables:
            continue
        existing = {col["name"] for col in inspector.get_columns(table)}
        for name, col_type in columns.items():
            if name not in existing:
                with engine.begin() as conn:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {col_type}"))
