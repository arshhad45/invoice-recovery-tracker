import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCase, getClients } from '../api'

function CaseCreate() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    client_id: '',
    invoice_number: '',
    invoice_amount: '',
    invoice_date: '',
    due_date: '',
    status: 'New',
    last_follow_up_notes: ''
  })

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await getClients()
      setClients(response.data)
      if (response.data.length > 0) {
        setFormData(prev => ({ ...prev, client_id: response.data[0].id.toString() }))
      }
    } catch (err) {
      setError('Failed to load clients. Please create a client first.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const caseData = {
        ...formData,
        client_id: parseInt(formData.client_id),
        invoice_amount: parseFloat(formData.invoice_amount),
        invoice_date: formData.invoice_date,
        due_date: formData.due_date,
        last_follow_up_notes: formData.last_follow_up_notes || null
      }

      const response = await createCase(caseData)
      navigate(`/cases/${response.data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create case. Please check all fields.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (clients.length === 0) {
    return (
      <div>
        <div className="error">
          No clients found. Please create a client first before creating a case.
        </div>
        <a href="/clients/create" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
          Create Client
        </a>
      </div>
    )
  }

  return (
    <div>
      <h2>Create New Recovery Case</h2>
      
      {error && <div className="error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="client_id">Client *</label>
            <select
              id="client_id"
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              required
            >
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.client_name} - {client.company_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="invoice_number">Invoice Number *</label>
            <input
              type="text"
              id="invoice_number"
              name="invoice_number"
              value={formData.invoice_number}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="invoice_amount">Invoice Amount *</label>
            <input
              type="number"
              id="invoice_amount"
              name="invoice_amount"
              value={formData.invoice_amount}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="invoice_date">Invoice Date *</label>
            <input
              type="date"
              id="invoice_date"
              name="invoice_date"
              value={formData.invoice_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="due_date">Due Date *</label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="New">New</option>
              <option value="In Follow-up">In Follow-up</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="last_follow_up_notes">Last Follow-up Notes</label>
            <textarea
              id="last_follow_up_notes"
              name="last_follow_up_notes"
              value={formData.last_follow_up_notes}
              onChange={handleChange}
              placeholder="Enter any follow-up notes..."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Case'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CaseCreate