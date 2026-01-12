import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import CaseList from './pages/CaseList'
import CaseDetail from './pages/CaseDetail'
import CaseCreate from './pages/CaseCreate'
import ClientCreate from './pages/ClientCreate'

function Navigation() {
  const location = useLocation()
  
  return (
    <div className="header">
      <h1>Invoice Recovery Case Tracker</h1>
      <nav className="nav">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Case List
        </Link>
        <Link to="/cases/create" className={location.pathname === '/cases/create' ? 'active' : ''}>
          Create Case
        </Link>
        <Link to="/clients/create" className={location.pathname === '/clients/create' ? 'active' : ''}>
          Create Client
        </Link>
      </nav>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<CaseList />} />
          <Route path="/cases/create" element={<CaseCreate />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="/clients/create" element={<ClientCreate />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App