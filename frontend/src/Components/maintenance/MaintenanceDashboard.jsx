import { useState, useEffect, useCallback } from 'react'
import Header from '../header'
import Footer from '../footer'
import SubmitComplaint from './SubmitComplaint'
import MyTickets from './MyTickets'
import TicketDetail from './TicketDetail'
import TechnicianTasks from './TechnicianTasks'
import AdminTickets from './AdminTickets'
import MaintenanceAnalytics from './MaintenanceAnalytics'
import Announcements from './Announcements'
import DownloadReports from './DownloadReports'
import * as api from './api'
import './maintenance.css'

// ============================================
// MaintenanceDashboard - Main entry point for the maintenance module
// NOW CONNECTED TO REAL BACKEND API (MongoDB Atlas)
// Uses api.js for all backend calls
// Role switcher auto-logs in as different test users for demo
// ============================================

// Test login credentials for each role
const TEST_ACCOUNTS = {
  student: { email: 'kasun@university.edu', password: 'password123' },
  staff: { email: 'nimal@university.edu', password: 'password123' },
  admin: { email: 'sarah@university.edu', password: 'password123' },
}

function MaintenanceDashboard({ headerNavItems, onNavigateHome, onNavigateToPage }) {
  // ---- STATE ----
  const [activeScreen, setActiveScreen] = useState('my-tickets')
  const [tickets, setTickets] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [currentRole, setCurrentRole] = useState('student')
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // ---- AUTO LOGIN ----
  // When role changes, login as that role's test user
  const loginAsRole = useCallback(async (role) => {
    try {
      setIsLoading(true)
      setError(null)

      // Login with test account for this role
      const account = TEST_ACCOUNTS[role]
      const data = await api.login(account.email, account.password)
      setCurrentUser(data.user)

      // Load data based on role
      await loadData(role)
    } catch (err) {
      console.error('Login failed:', err.message)
      setError('Could not connect to backend. Showing mock data.')
      // Fall back to mock data if API fails
      loadMockData()
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ---- LOAD DATA FROM API based on role ----
  async function loadData(role) {
    try {
      // Load announcements for all roles
      const annData = role === 'admin'
        ? await api.getAllAnnouncements()
        : await api.getActiveAnnouncements()
      setAnnouncements(annData)

      // Load tickets based on role
      if (role === 'student') {
        const ticketData = await api.getMyTickets()
        setTickets(ticketData)
      } else if (role === 'staff') {
        const ticketData = await api.getAssignedTickets()
        setTickets(ticketData)
      } else if (role === 'admin') {
        const ticketData = await api.getAllTickets()
        setTickets(ticketData)
        // Also load technicians list for admin
        const techData = await api.getTechnicians()
        setTechnicians(techData)
      }
    } catch (err) {
      console.error('Load data failed:', err.message)
      setError('Could not load data from server.')
    }
  }

  // ---- MOCK DATA FALLBACK ----
  // If backend is not running, use mock data so UI still works
  function loadMockData() {
    const { mockTickets, mockAnnouncements, mockTechnicians, mockUsers } = require('./mockData')
    setTickets(mockTickets)
    setAnnouncements(mockAnnouncements)
    setTechnicians(mockTechnicians)
    setCurrentUser(mockUsers.student)
  }

  // ---- INITIAL LOAD ----
  // Login as student when page first loads
  useEffect(() => {
    loginAsRole('student')
  }, [loginAsRole])

  // ---- NAVIGATION ----
  function scrollToContent() {
    const controls = document.querySelector('.maint-sticky-bar')
    if (controls) {
      const top = controls.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  function goToScreen(screen) {
    setActiveScreen(screen)
    setSelectedTicket(null)
    scrollToContent()
  }

  function viewTicketDetail(ticket) {
    setSelectedTicket(ticket)
    setActiveScreen('ticket-detail')
    scrollToContent()
  }

  // ---- ROLE SWITCH ----
  // When user clicks a role button, login as that role and load data
  async function switchRole(role) {
    setCurrentRole(role)
    await loginAsRole(role)

    // Navigate to default screen for that role
    if (role === 'student') setActiveScreen('my-tickets')
    else if (role === 'staff') setActiveScreen('tasks')
    else if (role === 'admin') setActiveScreen('admin-tickets')
  }

  // ---- TICKET ACTIONS (real API calls) ----

  // Student submits a new ticket
  async function handleSubmitTicket(formData) {
    try {
      setIsLoading(true)
      await api.createTicket(formData)
      // Reload tickets after creating
      const ticketData = await api.getMyTickets()
      setTickets(ticketData)
      goToScreen('my-tickets')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Admin assigns a technician
  async function handleAssignTicket(ticketId, technicianId) {
    try {
      await api.assignTicket(ticketId, technicianId)
      // Reload all tickets
      const ticketData = await api.getAllTickets()
      setTickets(ticketData)
    } catch (err) {
      setError(err.message)
    }
  }

  // Admin rejects a ticket
  async function handleRejectTicket(ticketId, reason) {
    try {
      await api.rejectTicket(ticketId, reason)
      const ticketData = await api.getAllTickets()
      setTickets(ticketData)
    } catch (err) {
      setError(err.message)
    }
  }

  // Technician starts working
  async function handleStartTicket(ticketId) {
    try {
      await api.startTicket(ticketId)
      const ticketData = await api.getAssignedTickets()
      setTickets(ticketData)
    } catch (err) {
      setError(err.message)
    }
  }

  // Technician resolves
  async function handleResolveTicket(ticketId, resolutionNote) {
    try {
      await api.resolveTicket(ticketId, resolutionNote)
      const ticketData = await api.getAssignedTickets()
      setTickets(ticketData)
    } catch (err) {
      setError(err.message)
    }
  }

  // Student rates
  async function handleRateTicket(ticketId, rating, ratingFeedback) {
    try {
      await api.rateTicket(ticketId, rating, ratingFeedback)
      const ticketData = await api.getMyTickets()
      setTickets(ticketData)
      goToScreen('my-tickets')
    } catch (err) {
      setError(err.message)
    }
  }

  // ---- ANNOUNCEMENT ACTIONS (real API calls) ----

  async function handleCreateAnnouncement(data) {
    try {
      await api.createAnnouncement(data)
      const annData = await api.getAllAnnouncements()
      setAnnouncements(annData)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUpdateAnnouncement(id, data) {
    try {
      await api.updateAnnouncement(id, data)
      const annData = await api.getAllAnnouncements()
      setAnnouncements(annData)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeleteAnnouncement(id) {
    try {
      await api.deleteAnnouncement(id)
      const annData = await api.getAllAnnouncements()
      setAnnouncements(annData)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleToggleAnnouncement(id) {
    try {
      await api.toggleAnnouncement(id)
      const annData = await api.getAllAnnouncements()
      setAnnouncements(annData)
    } catch (err) {
      setError(err.message)
    }
  }

  // ---- HEADER SETUP ----
  const actionItems = [
    { label: 'Back to Home', type: 'button', variant: 'button-ghost', onClick: onNavigateHome },
    { label: 'Submit Complaint', type: 'button', variant: 'button-primary', onClick: () => goToScreen('submit') },
  ]

  // ---- QUICK STATS for hero ----
  const openCount = tickets.filter((t) => t.status !== 'closed' && t.status !== 'rejected').length
  const resolvedCount = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length
  const ratedTickets = tickets.filter((t) => t.rating !== null)
  const avgRating = ratedTickets.length > 0
    ? (ratedTickets.reduce((s, t) => s + t.rating, 0) / ratedTickets.length).toFixed(1)
    : '0.0'

  // ---- SUB-NAV ITEMS ----
  function getSubNavItems() {
    const items = []
    if (currentRole === 'student') {
      items.push(
        { label: 'My Tickets', key: 'my-tickets', onClick: () => goToScreen('my-tickets'), active: activeScreen === 'my-tickets' },
        { label: 'Submit Complaint', key: 'submit', onClick: () => goToScreen('submit'), active: activeScreen === 'submit' },
        { label: 'Announcements', key: 'announcements', onClick: () => goToScreen('announcements'), active: activeScreen === 'announcements' },
      )
    }
    if (currentRole === 'staff') {
      items.push(
        { label: 'My Tasks', key: 'tasks', onClick: () => goToScreen('tasks'), active: activeScreen === 'tasks' },
        { label: 'Announcements', key: 'announcements', onClick: () => goToScreen('announcements'), active: activeScreen === 'announcements' },
      )
    }
    if (currentRole === 'admin') {
      items.push(
        { label: 'All Tickets', key: 'admin-tickets', onClick: () => goToScreen('admin-tickets'), active: activeScreen === 'admin-tickets' },
        { label: 'Analytics', key: 'analytics', onClick: () => goToScreen('analytics'), active: activeScreen === 'analytics' },
        { label: 'Announcements', key: 'announcements', onClick: () => goToScreen('announcements'), active: activeScreen === 'announcements' },
        { label: 'Reports', key: 'reports', onClick: () => goToScreen('reports'), active: activeScreen === 'reports' },
      )
    }
    return items
  }

  // ---- RENDER SCREEN ----
  function renderScreen() {
    // Show loading state
    if (isLoading) {
      return (
        <section className="maint-section">
          <div className="empty-state">
            <span className="empty-state-icon">⏳</span>
            <h3>Loading...</h3>
            <p>Fetching data from the server. Please wait.</p>
          </div>
        </section>
      )
    }

    switch (activeScreen) {
      case 'submit':
        return <SubmitComplaint onSubmit={handleSubmitTicket} />
      case 'my-tickets':
        return <MyTickets tickets={tickets} onViewTicket={viewTicketDetail} />
      case 'ticket-detail':
        return <TicketDetail ticket={selectedTicket} currentUser={currentUser} onRate={handleRateTicket}
          onBack={() => goToScreen(currentRole === 'admin' ? 'admin-tickets' : currentRole === 'staff' ? 'tasks' : 'my-tickets')} />
      case 'tasks':
        return <TechnicianTasks tickets={tickets}
          onViewTicket={viewTicketDetail} onStart={handleStartTicket} onResolve={handleResolveTicket} />
      case 'admin-tickets':
        return <AdminTickets tickets={tickets} technicians={technicians}
          onViewTicket={viewTicketDetail} onAssign={handleAssignTicket} onReject={handleRejectTicket} />
      case 'analytics':
        return <MaintenanceAnalytics tickets={tickets} />
      case 'announcements':
        return <Announcements announcements={announcements} currentRole={currentRole}
          onCreate={handleCreateAnnouncement} onUpdate={handleUpdateAnnouncement}
          onDelete={handleDeleteAnnouncement} onToggle={handleToggleAnnouncement} />
      case 'reports':
        return <DownloadReports tickets={tickets} />
      default:
        return <MyTickets tickets={tickets} onViewTicket={viewTicketDetail} />
    }
  }

  return (
    <div className="maintenance-page">
      <Header
        navItems={headerNavItems}
        actionItems={actionItems}
        onBrandClick={onNavigateHome}
        navAriaLabel="Maintenance navigation"
      />

      <main className="maintenance-shell">
        {/* Error banner - shows when API call fails */}
        {error && (
          <div className="maint-error-banner">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* ============ HERO SECTION ============ */}
        <section className="maint-hero">
          <div className="maint-hero-copy">
            <p className="eyebrow">Maintenance Workspace</p>
            <h1>Track, resolve, and improve hostel maintenance.</h1>
            <p>
              Submit complaints, monitor ticket progress, and manage the full maintenance
              workflow with transparent status tracking and service ratings.
            </p>

            <div className="hero-actions">
              <button className="button button-dark" type="button" onClick={() => goToScreen('submit')}>
                Submit Complaint
              </button>
              <button className="button button-outline" type="button" onClick={() => goToScreen(
                currentRole === 'admin' ? 'analytics' : currentRole === 'staff' ? 'tasks' : 'my-tickets'
              )}>
                {currentRole === 'admin' ? 'View Analytics' : currentRole === 'staff' ? 'View Tasks' : 'View My Tickets'}
              </button>
            </div>

            {/* Show logged in user info */}
            {currentUser && (
              <div className="maint-user-info">
                Logged in as: <strong>{currentUser.name}</strong> ({currentUser.role})
              </div>
            )}
          </div>

          {/* Hero right panel - dark card with live stats */}
          <div className="maint-hero-panel">
            <div className="maint-preview-card">
              <div className="preview-header">
                <div>
                  <p className="panel-label">Live system snapshot</p>
                  <h3>Maintenance command view</h3>
                </div>
                <span className="status-pill">
                  {error ? 'Offline' : 'Live'}
                </span>
              </div>

              <div className="metric-grid">
                <article className="metric-tile">
                  <span>Total Tickets</span>
                  <strong>{tickets.length}</strong>
                  <small>All time</small>
                </article>
                <article className="metric-tile">
                  <span>Open Tickets</span>
                  <strong>{openCount}</strong>
                  <small>Need attention</small>
                </article>
                <article className="metric-tile">
                  <span>Resolved</span>
                  <strong>{resolvedCount}</strong>
                  <small>Successfully fixed</small>
                </article>
                <article className="metric-tile">
                  <span>Avg Rating</span>
                  <strong>{avgRating}</strong>
                  <small>{ratedTickets.length} reviews</small>
                </article>
              </div>

              <div className="maint-preview-footer">
                <div className="ring-widget" aria-hidden="true">
                  <div className="ring-widget-core">
                    <strong>{tickets.length > 0 ? Math.round((resolvedCount / tickets.length) * 100) : 0}%</strong>
                    <span>resolution rate</span>
                  </div>
                </div>
                <div className="preview-list">
                  <div>
                    <span>Ticket workflow</span>
                    <strong>Submit → Assign → Fix → Rate → Close</strong>
                  </div>
                  <div>
                    <span>Active technicians</span>
                    <strong>{technicians.length || 3} staff members on duty</strong>
                  </div>
                  <div>
                    <span>Data source</span>
                    <strong>{error ? 'Mock data (offline)' : 'MongoDB Atlas (live)'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ STICKY CONTROLS BAR ============ */}
        <div className="maint-sticky-bar">
          <div className="maint-role-group">
            <span className="maint-role-label">View as</span>
            <button type="button"
              className={`maint-role-pill ${currentRole === 'student' ? 'role-pill-active' : ''}`}
              onClick={() => switchRole('student')}
            >Student</button>
            <button type="button"
              className={`maint-role-pill ${currentRole === 'staff' ? 'role-pill-active' : ''}`}
              onClick={() => switchRole('staff')}
            >Technician</button>
            <button type="button"
              className={`maint-role-pill ${currentRole === 'admin' ? 'role-pill-active' : ''}`}
              onClick={() => switchRole('admin')}
            >Admin</button>
          </div>

          <span className="maint-bar-divider" />

          {getSubNavItems().map((item) => (
            <button key={item.key} type="button"
              className={`maint-subnav-btn ${item.active ? 'subnav-btn-active' : ''}`}
              onClick={item.onClick}
            >{item.label}</button>
          ))}
        </div>

        {/* ============ ACTIVE SCREEN ============ */}
        {renderScreen()}
      </main>

      <Footer onNavigateToPage={onNavigateToPage} />
    </div>
  )
}

export default MaintenanceDashboard
