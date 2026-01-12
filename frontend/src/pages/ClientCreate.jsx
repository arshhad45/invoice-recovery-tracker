import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClient } from '../api'

function ClientCreate() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    client_name: '',
    company_name: '',
    city: '',
    contact_person: '',
    phone: '',
    email: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      await createClient(formData)
      setSuccess('Client created successfully!')
      setFormData({
        client_name: '',
        company_name: '',
        city: '',
        contact_person: '',
        phone: '',
        email: ''
      })
      // Optionally navigate after a delay
      setTimeout(() => {
        navigate('/cases/create')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create client. Please check all fields.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2>Create New Client</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="client_name">Client Name *</label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label htmlFor="company_name">Company Name *</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact_person">Contact Person *</label>
            <input
              type="text"
              id="contact_person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              required
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={255}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Client'}
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

export default ClientCreate