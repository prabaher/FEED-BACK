# Student Feedback Management Platform

Mobile-first student feedback platform for colleges with neon glassmorphism UI.

## Quick Start

1. Create MySQL database:
```sql
CREATE DATABASE student_feedback CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Backend:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

3. Frontend:
```bash
cd frontend
npm install
npm run dev
```

4. Open http://localhost:3000

## Demo Credentials

**Student:** 23AD001 / 15-04-2005
**Admin:** admin / admin123

## Features

✅ Student login with Register No + DOB
✅ General & event feedback (separate storage)
✅ Identity visibility control
✅ Duplicate prevention
✅ Admin dashboard
✅ Student import (JSON)
✅ Event management
✅ Mobile-responsive neon UI

See START_HERE.md and COMPLETE_SETUP.md for full documentation.
