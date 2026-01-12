-- Invoice Recovery Case Tracker Database Schema
-- PostgreSQL

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS clients;

-- Create clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cases table
CREATE TABLE cases (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    invoice_amount DECIMAL(15, 2) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('New', 'In Follow-up', 'Partially Paid', 'Closed')),
    last_follow_up_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_cases_client_id ON cases(client_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_due_date ON cases(due_date);
CREATE INDEX idx_clients_email ON clients(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();