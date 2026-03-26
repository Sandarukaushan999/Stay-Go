import { useState } from 'react'
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
import { mockTickets, mockAnnouncements, mockTechnicians, mockUsers } from './mockData'
import './maintenance.css'

// ============================================
// MaintenanceDashboard - Main entry point for the maintenance module
// Premium hero section + role-based sub-navigation + screen routing
// Matches the team lead's design language (dark cards, glassmorphism, gradients)
// ============================================

function MaintenanceDashboard({ headerNavItems, onNavigateHome, onNavigateToPage }) {
  // ---- STATE MANAGEMENT ----
  const [activeScreen, setActiveScreen] = useState('my-tickets')
  const [tickets, setTickets] = useState(mockTickets)
  const [announcements, setAnnouncements] = useState(mockAnnouncements)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [currentRole, setCurrentRole] = useState('student')

  // Get current user based on selected role
  const currentUser = currentRole === 'admin'
    ? mockUsers.admin
    : currentRole === 'staff'
      ? mockUsers.technician1
      : mockUsers.student

  // ---- NAVIGATION HELPERS ----

  // Scroll to the content area (below hero and controls), not the top of the page
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

  // ---- TICKET ACTIONS ----

  // Student submits a new ticket
  function handleSubmitTicket(formData) {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const count = tickets.length + 1
    const ticketId = `MT-${today}-${String(count).padStart(3, '0')}`

    const newTicket = {
      _id: String(Date.now()),
      ticketId,
      ...formData,
      status: 'submitted',
      submittedBy: currentUser,
      assignedTo: null,
      rejectionReason: null,
      resolutionNote: null,
      rating: null,
      ratingFeedback: null,
      attachments: [],
      statusHistory: [{
        status: 'submitted',
        changedBy: currentUser,
        changedAt: new Date().toISOString(),
        note: 'Ticket submitted by student',
      }],
      createdAt: new Date().toISOString(),
    }

    setTickets([newTicket, ...tickets])
    goToScreen('my-tickets')
  }

  // Admin assigns a technician
  function handleAssignTicket(ticketId, technicianId) {
    const technician = mockTechnicians.find((t) => t.id === technicianId)
    setTickets(tickets.map((ticket) => {
      if (ticket._id === ticketId) {
        return {
          ...ticket,
          status: 'assigned',
          assignedTo: technician,
          statusHistory: [...ticket.statusHistory, {
            status: 'assigned', changedBy: currentUser,
            changedAt: new Date().toISOString(), note: 'Technician assigned by admin',
          }],
        }
      }
      return ticket
    }))
  }

  // Admin rejects a ticket
  function handleRejectTicket(ticketId, reason) {
    setTickets(tickets.map((ticket) => {
      if (ticket._id === ticketId) {
        return {
          ...ticket,
          status: 'rejected',
          rejectionReason: reason,
          statusHistory: [...ticket.statusHistory, {
            status: 'rejected', changedBy: currentUser,
            changedAt: new Date().toISOString(), note: reason,
          }],
        }
      }
      return ticket
    }))
  }

  // Technician starts working
  function handleStartTicket(ticketId) {
    setTickets(tickets.map((ticket) => {
      if (ticket._id === ticketId) {
        return {
          ...ticket,
          status: 'in_progress',
          statusHistory: [...ticket.statusHistory, {
            status: 'in_progress', changedBy: currentUser,
            changedAt: new Date().toISOString(), note: 'Technician started working on the issue',
          }],
        }
      }
      return ticket
    }))
  }

  // Technician resolves
  function handleResolveTicket(ticketId, resolutionNote) {
    setTickets(tickets.map((ticket) => {
      if (ticket._id === ticketId) {
        return {
          ...ticket,
          status: 'resolved',
          resolutionNote,
          statusHistory: [...ticket.statusHistory, {
            status: 'resolved', changedBy: currentUser,
            changedAt: new Date().toISOString(), note: resolutionNote,
          }],
        }
      }
      return ticket
    }))
  }

  // Student rates
  function handleRateTicket(ticketId, rating, ratingFeedback) {
    setTickets(tickets.map((ticket) => {
      if (ticket._id === ticketId) {
        return {
          ...ticket,
          status: 'closed',
          rating,
          ratingFeedback,
          statusHistory: [...ticket.statusHistory, {
            status: 'closed', changedBy: currentUser,
            changedAt: new Date().toISOString(),
            note: `Student rated ${rating}/5${ratingFeedback ? ': ' + ratingFeedback : ''}`,
          }],
        }
      }
      return ticket
    }))
  }

  // ---- ANNOUNCEMENT ACTIONS ----
  function handleCreateAnnouncement(data) {
    const newAnnouncement = {
      _id: String(Date.now()), ...data, isActive: true,
      createdBy: currentUser, createdAt: new Date().toISOString(),
    }
    setAnnouncements([newAnnouncement, ...announcements])
  }

  function handleUpdateAnnouncement(id, data) {
    setAnnouncements(announcements.map((a) => a._id === id ? { ...a, ...data } : a))
  }

  function handleDeleteAnnouncement(id) {
    setAnnouncements(announcements.filter((a) => a._id !== id))
  }

  function handleToggleAnnouncement(id) {
    setAnnouncements(announcements.map((a) => a._id === id ? { ...a, isActive: !a.isActive } : a))
  }

  // ---- HEADER SETUP ----
  const actionItems = [
    { label: 'Back to Home', type: 'button', variant: 'button-ghost', onClick: onNavigateHome },
    { label: 'Submit Complaint', type: 'button', variant: 'button-primary', onClick: () => goToScreen('submit') },
  ]

  // ---- QUICK STATS for the hero panel ----
  const openCount = tickets.filter((t) => t.status !== 'closed' && t.status !== 'rejected').length
  const resolvedCount = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length
  const ratedTickets = tickets.filter((t) => t.rating !== null)
  const avgRating = ratedTickets.length > 0
    ? (ratedTickets.reduce((s, t) => s + t.rating, 0) / ratedTickets.length).toFixed(1)
    : '0.0'

  // ---- SUB-NAV ITEMS based on role ----
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

  // ---- RENDER ACTIVE SCREEN ----
  function renderScreen() {
    switch (activeScreen) {
      case 'submit':
        return <SubmitComplaint onSubmit={handleSubmitTicket} />
      case 'my-tickets':
        return <MyTickets tickets={tickets.filter((t) => t.submittedBy.id === currentUser.id)} onViewTicket={viewTicketDetail} />
      case 'ticket-detail':
        return <TicketDetail ticket={selectedTicket} currentUser={currentUser} onRate={handleRateTicket}
          onBack={() => goToScreen(currentRole === 'admin' ? 'admin-tickets' : currentRole === 'staff' ? 'tasks' : 'my-tickets')} />
      case 'tasks':
        return <TechnicianTasks tickets={tickets.filter((t) => t.assignedTo && t.assignedTo.id === currentUser.id)}
          onViewTicket={viewTicketDetail} onStart={handleStartTicket} onResolve={handleResolveTicket} />
      case 'admin-tickets':
        return <AdminTickets tickets={tickets} technicians={mockTechnicians}
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
        return <MyTickets tickets={tickets.filter((t) => t.submittedBy.id === currentUser.id)} onViewTicket={viewTicketDetail} />
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
          </div>

          {/* Hero right panel - dark card with live stats */}
          <div className="maint-hero-panel">
            <div className="maint-preview-card">
              <div className="preview-header">
                <div>
                  <p className="panel-label">Live system snapshot</p>
                  <h3>Maintenance command view</h3>
                </div>
                <span className="status-pill">Active</span>
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
                    <strong>{mockTechnicians.length} staff members on duty</strong>
                  </div>
                  <div>
                    <span>SLA compliance</span>
                    <strong>82% resolved within target window</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ STICKY CONTROLS BAR ============ */}
        {/* Combined role switcher + subnav in one bar that sticks to top while scrolling */}
        <div className="maint-sticky-bar">
          {/* Role switcher - dark pill group */}
          <div className="maint-role-group">
            <span className="maint-role-label">View as</span>
            <button
              type="button"
              className={`maint-role-pill ${currentRole === 'student' ? 'role-pill-active' : ''}`}
              onClick={() => { setCurrentRole('student'); goToScreen('my-tickets') }}
            >
              Student
            </button>
            <button
              type="button"
              className={`maint-role-pill ${currentRole === 'staff' ? 'role-pill-active' : ''}`}
              onClick={() => { setCurrentRole('staff'); goToScreen('tasks') }}
            >
              Technician
            </button>
            <button
              type="button"
              className={`maint-role-pill ${currentRole === 'admin' ? 'role-pill-active' : ''}`}
              onClick={() => { setCurrentRole('admin'); goToScreen('admin-tickets') }}
            >
              Admin
            </button>
          </div>

          {/* Divider line */}
          <span className="maint-bar-divider" />

          {/* Sub-navigation tabs */}
          {getSubNavItems().map((item) => (
            <button
              key={item.key}
              type="button"
              className={`maint-subnav-btn ${item.active ? 'subnav-btn-active' : ''}`}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ============ ACTIVE SCREEN CONTENT ============ */}
        {renderScreen()}
      </main>

      <Footer onNavigateToPage={onNavigateToPage} />
    </div>
  )
}

export default MaintenanceDashboard
