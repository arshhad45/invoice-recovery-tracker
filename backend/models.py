"""
SQLAlchemy models for database tables
"""
from sqlalchemy import Column, Integer, String, Date, DECIMAL, Text, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    city = Column(String(255), nullable=False)
    contact_person = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationship
    cases = relationship("Case", back_populates="client", cascade="all, delete-orphan")

class Case(Base):
    __tablename__ = "cases"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    invoice_number = Column(String(100), nullable=False, unique=True)
    invoice_amount = Column(DECIMAL(15, 2), nullable=False)
    invoice_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(String(50), nullable=False)
    last_follow_up_notes = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationship
    client = relationship("Client", back_populates="cases")