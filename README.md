# Invoice Recovery Case Tracker

A mini internal CRM system for PayAssured to track clients, their unpaid invoices, and recovery follow-up progress.

## Tech Stack

### Backend
- **Python 3.9+**
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Relational database
- **Pydantic** - Data validation

### Frontend
- **Node.js 18+**
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **React Router** - Routing

### Database
- **PostgreSQL 14+**

## Project Structure

```
payassured ass/
├── frontend/          # React application
├── backend/           # FastAPI application
├── db/                # Database schema and migrations
├── screenshots/       # Application screenshots
└── README.md
```

## Setup Steps

### Prerequisites
- Python 3.9 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher
- pip (Python package manager)
- npm or yarn (Node package manager)

### 1. Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database:
   ```sql
   CREATE DATABASE payassured_db;
   ```
3. Run the schema file:
   ```bash
   psql -U postgres -d payassured_db -f db/schema.sql
   ```
   Or use the migration script in `db/init_db.py`

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the backend directory (copy from `env.example.txt`):
   ```bash
   # Windows PowerShell
   Copy-Item env.example.txt .env
   
   # Linux/Mac
   cp env.example.txt .env
   ```

6. Update the `.env` file with your database credentials:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/payassured_db
   SECRET_KEY=your-secret-key-here
   ```

7. Initialize the database:
   ```bash
   python init_db.py
   ```

8. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`
   API documentation at `http://localhost:8000/docs`

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory (copy from `env.example.txt`):
   ```bash
   # Windows PowerShell
   Copy-Item env.example.txt .env
   
   # Linux/Mac
   cp env.example.txt .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## API Endpoints

### Client APIs
- `POST /clients` - Create a new client
- `GET /clients` - List all clients

### Case APIs
- `POST /cases` - Create a new recovery case
- `GET /cases` - List all cases (with optional query parameters)
- `GET /cases/{id}` - Get case details by ID
- `PATCH /cases/{id}` - Update case (status and/or follow-up notes)

## Database Schema

### clients Table
- `id` (PK, SERIAL)
- `client_name` (VARCHAR, NOT NULL)
- `company_name` (VARCHAR, NOT NULL)
- `city` (VARCHAR, NOT NULL)
- `contact_person` (VARCHAR, NOT NULL)
- `phone` (VARCHAR, NOT NULL)
- `email` (VARCHAR, NOT NULL, UNIQUE)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### cases Table
- `id` (PK, SERIAL)
- `client_id` (FK → clients.id, NOT NULL)
- `invoice_number` (VARCHAR, NOT NULL, UNIQUE)
- `invoice_amount` (DECIMAL, NOT NULL)
- `invoice_date` (DATE, NOT NULL)
- `due_date` (DATE, NOT NULL)
- `status` (VARCHAR, NOT NULL) - Values: New, In Follow-up, Partially Paid, Closed
- `last_follow_up_notes` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Features

- ✅ Client management (create and list)
- ✅ Case management (create, list, view details, update)
- ✅ Status filtering on case list
- ✅ Sorting by due date (ascending/descending)
- ✅ Case detail page with update functionality
- ✅ Input validation
- ✅ Error handling

## Development

### Backend Development
The backend uses FastAPI with automatic API documentation. Visit `http://localhost:8000/docs` for interactive API testing.

### Frontend Development
The frontend uses Vite for fast hot module replacement during development.

## Notes

- Make sure PostgreSQL is running before starting the backend
- The backend and frontend should be running simultaneously for full functionality
- All API endpoints include proper validation and error handling