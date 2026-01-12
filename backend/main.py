"""
FastAPI main application
"""
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import Optional, List
import models
import schemas
from database import get_db, engine

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Invoice Recovery Case Tracker API",
    description="API for managing clients and invoice recovery cases",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Client APIs
@app.post("/clients", response_model=schemas.ClientResponse, status_code=201)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    """Create a new client"""
    # Check if email already exists
    existing_client = db.query(models.Client).filter(models.Client.email == client.email).first()
    if existing_client:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    db_client = models.Client(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@app.get("/clients", response_model=List[schemas.ClientResponse])
def list_clients(db: Session = Depends(get_db)):
    """List all clients"""
    clients = db.query(models.Client).all()
    return clients

# Case APIs
@app.post("/cases", response_model=schemas.CaseResponse, status_code=201)
def create_case(case: schemas.CaseCreate, db: Session = Depends(get_db)):
    """Create a new recovery case"""
    # Verify client exists
    client = db.query(models.Client).filter(models.Client.id == case.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Check if invoice number already exists
    existing_case = db.query(models.Case).filter(models.Case.invoice_number == case.invoice_number).first()
    if existing_case:
        raise HTTPException(status_code=400, detail="Invoice number already exists")
    
    db_case = models.Case(**case.model_dump())
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

@app.get("/cases", response_model=List[schemas.CaseResponseWithClient])
def list_cases(
    status: Optional[str] = Query(None, pattern=r"^(New|In Follow-up|Partially Paid|Closed)$"),
    sort_by: Optional[str] = Query(None, pattern=r"^(due_date|invoice_date)$"),
    order: Optional[str] = Query("asc", pattern=r"^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    """List all cases with optional filtering and sorting"""
    query = db.query(models.Case)
    
    # Filter by status
    if status:
        query = query.filter(models.Case.status == status)
    
    # Sort by due_date or invoice_date
    if sort_by == "due_date":
        if order == "desc":
            query = query.order_by(desc(models.Case.due_date))
        else:
            query = query.order_by(asc(models.Case.due_date))
    elif sort_by == "invoice_date":
        if order == "desc":
            query = query.order_by(desc(models.Case.invoice_date))
        else:
            query = query.order_by(asc(models.Case.invoice_date))
    else:
        # Default sort by due_date ascending
        query = query.order_by(asc(models.Case.due_date))
    
    cases = query.all()
    return cases

@app.get("/cases/{case_id}", response_model=schemas.CaseResponseWithClient)
def get_case(case_id: int, db: Session = Depends(get_db)):
    """Get case details by ID"""
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@app.patch("/cases/{case_id}", response_model=schemas.CaseResponse)
def update_case(
    case_id: int,
    case_update: schemas.CaseUpdate,
    db: Session = Depends(get_db)
):
    """Update case status and/or follow-up notes"""
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Update only provided fields
    update_data = case_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(case, field, value)
    
    db.commit()
    db.refresh(case)
    return case

@app.get("/")
def root():
    """Root endpoint"""
    return {"message": "Invoice Recovery Case Tracker API", "docs": "/docs"}