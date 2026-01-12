import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Client APIs
export const getClients = () => api.get('/clients')
export const createClient = (data) => api.post('/clients', data)

// Case APIs
export const getCases = (params = {}) => {
  const queryParams = new URLSearchParams()
  if (params.status) queryParams.append('status', params.status)
  if (params.sort_by) queryParams.append('sort_by', params.sort_by)
  if (params.order) queryParams.append('order', params.order)
  
  const queryString = queryParams.toString()
  return api.get(`/cases${queryString ? `?${queryString}` : ''}`)
}

export const getCase = (id) => api.get(`/cases/${id}`)
export const createCase = (data) => api.post('/cases', data)
export const updateCase = (id, data) => api.patch(`/cases/${id}`, data)

export default api