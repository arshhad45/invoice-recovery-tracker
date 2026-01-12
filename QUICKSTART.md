# Quick Start Guide

## Prerequisites Check
- [ ] Python 3.9+ installed (`python --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL installed and running
- [ ] Database `payassured_db` created

## Quick Setup (5 minutes)

### 1. Database
```bash
# Create database
psql -U postgres
CREATE DATABASE payassured_db;
\q

# Run schema
psql -U postgres -d payassured_db -f db/schema.sql
```

### 2. Backend (Terminal 1)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
Copy-Item env.example.txt .env  # Windows
# cp env.example.txt .env  # Linux/Mac

# Edit .env with your database credentials
python init_db.py
uvicorn main:app --reload
```

### 3. Frontend (Terminal 2)
```bash
cd frontend
npm install
Copy-Item env.example.txt .env  # Windows
# cp env.example.txt .env  # Linux/Mac

npm run dev
```

### 4. Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## First Steps
1. Create a client (Navigate to "Create Client")
2. Create a case (Navigate to "Create Case")
3. View cases in the list
4. Click "View Details" to see/edit case details