"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date, datetime

# Client Schemas
class ClientBase(BaseModel):
    client_name: str = Field(..., min_length=1, max_length=255)
    company_name: str = Field(..., min_length=1, max_length=255)
    city: str = Field(..., min_length=1, max_length=255)
    contact_person: str = Field(..., min_length=1, max_length=255)
    phone: str = Field(..., min_length=1, max_length=50)
    email: EmailStr

class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Case Schemas
class CaseBase(BaseModel):
    invoice_number: str = Field(..., min_length=1, max_length=100)
    invoice_amount: float = Field(..., gt=0)
    invoice_date: date
    due_date: date
    status: str = Field(..., pattern=r"^(New|In Follow-up|Partially Paid|Closed)$")
    last_follow_up_notes: Optional[str] = None

class CaseCreate(CaseBase):
    client_id: int = Field(..., gt=0)

class CaseUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern=r"^(New|In Follow-up|Partially Paid|Closed)$")
    last_follow_up_notes: Optional[str] = None

class CaseResponse(CaseBase):
    id: int
    client_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class CaseResponseWithClient(CaseResponse):
    client: ClientResponse
    
    class Config:
        from_attributes = True