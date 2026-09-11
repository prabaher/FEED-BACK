from openpyxl import load_workbook
from models import Student
from auth import hash_password
from sqlalchemy.orm import Session
import json

def import_students_from_excel(file_path: str, db: Session):
    try:
        workbook = load_workbook(file_path)
        sheet = workbook.active
        headers = [cell.value for cell in sheet[1]]
        imported = 0
        for row in sheet.iter_rows(min_row=2, values_only=False):
            row_data = {headers[idx]: row[idx].value for idx in range(len(headers))}
            if not row_data.get('register_no'):
                continue
            if db.query(Student).filter(Student.register_no == row_data['register_no']).first():
                continue
            student = Student(register_no=row_data['register_no'], name=row_data['name'], dob=row_data['dob'], department=row_data['department'], year=row_data['year'], section=row_data['section'], password_hash=hash_password(row_data['dob']))
            db.add(student)
            imported += 1
        db.commit()
        return {"status": "success", "imported": imported}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}

def import_students_from_json(file_path: str, db: Session):
    try:
        with open(file_path, 'r') as f:
            students_data = json.load(f)
        imported = 0
        for student_data in students_data:
            if db.query(Student).filter(Student.register_no == student_data['register_no']).first():
                continue
            student = Student(register_no=student_data['register_no'], name=student_data['name'], dob=student_data['dob'], department=student_data['department'], year=student_data['year'], section=student_data['section'], password_hash=hash_password(student_data['dob']))
            db.add(student)
            imported += 1
        db.commit()
        return {"status": "success", "imported": imported}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}
