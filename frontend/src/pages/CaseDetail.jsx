import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCase, updateCase } from '../api'

function CaseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    status: '',
    last_follow_up_notes: ''
  })

  useEffect(() => {
    fetchCase()
  }, [id])

  const fetchCase = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getCase(id)
      setCaseData(response.data)
      setFormData({
        status: response.data.status,
        last_follow_up_notes: response.data.last_follow_up_notes || ''
      })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch case details')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      setSuccess(null)
      const updateData = {}
      if (formData.status !== caseData.status) {
        updateData.status = formData.status
      }
      if (formData.last_follow_up_notes !== (caseData.last_follow_up_notes || '')) {
        updateData.last_follow_up_notes = formData.last_follow_up_notes
      }

      if (Object.keys(updateData).length === 0) {
        setError('No changes to save')
        return
      }

      await updateCase(id, updateData)
      setSuccess('Case updated successfully!')
      setIsEditing(false)
      fetchCase()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update case')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusClass = (status) => {
    const statusMap = {
      'New': 'status-new',
      'In Follow-up': 'status-followup',
      'Partially Paid': 'status-partial',
      'Closed': 'status-closed'
    }
    return statusMap[status] || 'status-new'
  }

  if (loading) {
    return <div className="loading">Loading case details...</div>
  }

  if (error && !caseData) {
    return (
      <div>
        <div className="error">{error}</div>
        <Link to="/" className="btn btn-secondary" style={{ marginTop: '20px' }}>
          Back to Case List
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Case Details</h2>
        <div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn btn-primary" style={{ marginRight: '10px' }}>
              Edit Case
            </button>
          )}
          <Link to="/" className="btn btn-secondary">
            Back to List
          </Link>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {caseData && (
        <div className="card">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="New">New</option>
                  <option value="In Follow-up">In Follow-up</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Last Follow-up Notes</label>
                <textarea
                  value={formData.last_follow_up_notes}
                  onChange={(e) => setFormData({ ...formData, last_follow_up_notes: e.target.value })}
                  placeholder="Enter follow-up notes..."
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-success">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      status: caseData.status,
                      last_follow_up_notes: caseData.last_follow_up_notes || ''
                    })
                    setError(null)
                    setSuccess(null)
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Client Information</h3>
                  <p><strong>Client Name:</strong> {caseData.client.client_name}</p>
                  <p><strong>Company:</strong> {caseData.client.company_name}</p>
                  <p><strong>City:</strong> {caseData.client.city}</p>
                  <p><strong>Contact Person:</strong> {caseData.client.contact_person}</p>
                  <p><strong>Phone:</strong> {caseData.client.phone}</p>
                  <p><strong>Email:</strong> {caseData.client.email}</p>
                </div>

                <div>
                  <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Invoice Information</h3>
                  <p><strong>Invoice Number:</strong> {caseData.invoice_number}</p>
                  <p><strong>Invoice Amount:</strong> {formatCurrency(caseData.invoice_amount)}</p>
                  <p><strong>Invoice Date:</strong> {formatDate(caseData.invoice_date)}</p>
                  <p><strong>Due Date:</strong> {formatDate(caseData.due_date)}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={`status-badge ${getStatusClass(caseData.status)}`}>
                      {caseData.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Follow-up Notes</h3>
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  minHeight: '50px'
                }}>
                  {caseData.last_follow_up_notes || <em style={{ color: '#7f8c8d' }}>No follow-up notes yet.</em>}
                </div>
              </div>

              <div style={{ marginTop: '20px', fontSize: '12px', color: '#7f8c8d' }}>
                <p>Created: {new Date(caseData.created_at).toLocaleString()}</p>
                <p>Last Updated: {new Date(caseData.updated_at).toLocaleString()}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default CaseDetail