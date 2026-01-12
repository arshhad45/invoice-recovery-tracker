"""
Database initialization script
Run this script to create the database tables
"""
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in environment variables")

# Read schema file
schema_path = os.path.join(os.path.dirname(__file__), "..", "db", "schema.sql")
with open(schema_path, "r") as f:
    schema_sql = f.read()

# Create engine and execute schema
engine = create_engine(DATABASE_URL)

print("Creating database tables...")
with engine.connect() as conn:
    conn.execute(text(schema_sql))
    conn.commit()
    print("Database tables created successfully!")