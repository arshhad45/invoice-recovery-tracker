import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCases } from '../api'

function CaseList() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    sort_by: 'due_date',
    order: 'asc'
  })

  const fetchCases = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getCases(filters)
      setCases(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch cases')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCases()
  }, [filters.status, filters.sort_by, filters.order])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return <div className="loading">Loading cases...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Recovery Cases</h2>
        <Link to="/cases/create" className="btn btn-primary">
          Create New Case
        </Link>
      </div>

      <div className="filters">
        <div>
          <label htmlFor="status-filter" style={{ marginRight: '8px' }}>Filter by Status:</label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="In Follow-up">In Follow-up</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-by" style={{ marginRight: '8px' }}>Sort by:</label>
          <select
            id="sort-by"
            value={filters.sort_by}
            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
          >
            <option value="due_date">Due Date</option>
            <option value="invoice_date">Invoice Date</option>
          </select>
        </div>

        <div>
          <label htmlFor="order" style={{ marginRight: '8px' }}>Order:</label>
          <select
            id="order"
            value={filters.order}
            onChange={(e) => handleFilterChange('order', e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {cases.length === 0 ? (
        <div className="empty-state">
          <p>No cases found. Create a new case to get started.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Invoice Number</th>
                <th>Invoice Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem) => (
                <tr key={caseItem.id}>
                  <td>{caseItem.client.client_name}</td>
                  <td>{caseItem.invoice_number}</td>
                  <td>{formatCurrency(caseItem.invoice_amount)}</td>
                  <td>{formatDate(caseItem.due_date)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/cases/${caseItem.id}`} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CaseList