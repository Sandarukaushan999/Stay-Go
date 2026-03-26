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
// This component handles sub-screen navigation inside the maintenance section
// It manages all ticket data and passes it down to child components
// ============================================

function MaintenanceDashboard({ headerNavItems, onNavigateHome, onNavigateToPage }) {
  // ---- STATE MANAGEMENT ----

  // Which sub-screen is currently showing
  const [activeScreen, setActiveScreen] = useState('my-tickets')

  // Store all tickets in state (using mock data for now, will connect to API later)
  const [tickets, setTickets] = useState(mockTickets)

  // Store all announcements in state
  const [announcements, setAnnouncements] = useState(mockAnnouncements)

  // Which ticket is selected for detail view
  const [selectedTicket, setSelectedTicket] = useState(null)

  // Current user role - change this to test different views
  // Options: 'student', 'staff', 'admin'
  const [currentRole, setCurrentRole] = useState('student')

  // Get current user based on selected role
  const currentUser = currentRole === 'admin'
    ? mockUsers.admin
    : currentRole === 'staff'
      ? mockUsers.technician1
      : mockUsers.student

  // ---- NAVIGATION HELPERS ----

  // Navigate to a sub-screen inside the maintenance module
  function goToScreen(screen) {
    setActiveScreen(screen)
    setSelectedTicket(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Open ticket detail view for a specific ticket
  function viewTicketDetail(ticket) {
    setSelectedTicket(ticket)
    setActiveScreen('ticket-detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---- TICKET ACTIONS (Mock - will be replaced with API calls) ----

  // Student submits a new ticket
  function handleSubmitTicket(formData) {
    // Create a new ticket ID based on today's date and ticket count
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const count = tickets.length + 1
    const ticketId = `MT-${today}-${String(count).padStart(3, '0')}`

    // Build the new ticket object
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
      statusHistory: [
        {
          status: 'submitted',
          changedBy: currentUser,
          changedAt: new Date().toISOString(),
          note: 'Ticket submitted by student',
        },
      ],
      createdAt: new Date().toISOString(),
    }

    // Add new ticket to the beginning of the list
    setTickets([newTicket, ...tickets])

    // Show success and go to my tickets screen
    goToScreen('my-tickets')
  }

  // Admin assigns a technician to a ticket
  function handleAssignTicket(ticketId, technicianId) {
    const technician = mockTechnicians.find((t) => t.id === technicianId)

    setTickets(tickets.map((ticket) => {
      if (ticket._id === ticketId) {
        return {
          ...ticket,
          status: 'assigned',
          assignedTo: technician,
          statusHistory: [
            ...ticket.statusHistory,
            {
              status: 'assigned',
              changedBy: currentUser,
              changedAt: new Date().toISOString(),
              note: 'Technician assigned by admin',
            },
          ],
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
          statusHistory: [
            ...ticket.statusHistory,
            {
              status: 'rejected',
              changedBy: currentUser,
              changedAt: new Date().toISOString(),
              note: reason,
            },
          ],
        }
      }
      return ticket
    }))
  }

  // Technician starts working on a ticket
  function handleStartTicket(ticketId) {
    setTickets(tickets.map((ticket) => {
      if (ticket._id === ticketId) {
        return {
          ...ticket,
          status: 'in_progress',
          statusHistory: [
            ...ticket.statusHistory,
            {
              status: 'in_progress',
              changedBy: currentUser,
              changedAt: new Date().toISOString(),
              note: 'Technician started working on the issue',
            },
          ],
        }
      }
      return ticket
    }))
  }

  // Technician resolves a ticket
  function handleResolveTicket(ticketId, resolutionNote) {
    setTickets(tickets.map((ticket) => {
      if (ticket._id === ticketId) {
        return {
          ...ticket,
          status: 'resolved',
          resolutionNote,
          statusHistory: [
            ...ticket.statusHistory,
            {
              status: 'resolved',
              changedBy: currentUser,
              changedAt: new Date().toISOString(),
              note: resolutionNote,
            },
          ],
        }
      }
      return ticket
    }))
  }

  // Student rates a resolved ticket
  function handleRateTicket(ticketId, rating, ratingFeedback) {
    setTickets(tickets.map((ticket) => {
      if (ticket._id === ticketId) {
        return {
          ...ticket,
          status: 'closed',
          rating,
          ratingFeedback,
          statusHistory: [
            ...ticket.statusHistory,
            {
              status: 'closed',
              changedBy: currentUser,
              changedAt: new Date().toISOString(),
              note: `Student rated ${rating}/5${ratingFeedback ? ': ' + ratingFeedback : ''}`,
            },
          ],
        }
      }
      return ticket
    }))
  }

  // ---- ANNOUNCEMENT ACTIONS ----

  // Admin creates a new announcement
  function handleCreateAnnouncement(data) {
    const newAnnouncement = {
      _id: String(Date.now()),
      ...data,
      isActive: true,
      createdBy: currentUser,
      createdAt: new Date().toISOString(),
    }
    setAnnouncements([newAnnouncement, ...announcements])
  }

  // Admin updates an existing announcement
  function handleUpdateAnnouncement(id, data) {
    setAnnouncements(announcements.map((a) =>
      a._id === id ? { ...a, ...data } : a
    ))
  }

  // Admin deletes an announcement
  function handleDeleteAnnouncement(id) {
    setAnnouncements(announcements.filter((a) => a._id !== id))
  }

  // Admin toggles announcement visibility
  function handleToggleAnnouncement(id) {
    setAnnouncements(announcements.map((a) =>
      a._id === id ? { ...a, isActive: !a.isActive } : a
    ))
  }

  // ---- HEADER SETUP ----

  // Action buttons shown in the header
  const actionItems = [
    { label: 'Back to Home', type: 'button', variant: 'button-ghost', onClick: onNavigateHome },
    { label: 'Submit Complaint', type: 'button', variant: 'button-primary', onClick: () => goToScreen('submit') },
  ]

  // Build the sub-navigation tabs based on user role
  function getSubNavItems() {
    const items = []

    // Student tabs
    if (currentRole === 'student') {
      items.push(
        { label: 'My Tickets', key: 'my-tickets', onClick: () => goToScreen('my-tickets'), active: activeScreen === 'my-tickets' },
        { label: 'Submit Complaint', key: 'submit', onClick: () => goToScreen('submit'), active: activeScreen === 'submit' },
        { label: 'Announcements', key: 'announcements', onClick: () => goToScreen('announcements'), active: activeScreen === 'announcements' },
      )
    }

    // Technician tabs
    if (currentRole === 'staff') {
      items.push(
        { label: 'My Tasks', key: 'tasks', onClick: () => goToScreen('tasks'), active: activeScreen === 'tasks' },
        { label: 'Announcements', key: 'announcements', onClick: () => goToScreen('announcements'), active: activeScreen === 'announcements' },
      )
    }

    // Admin tabs
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

  // ---- RENDER SUB-SCREENS ----

  // This function decides which screen to show based on activeScreen state
  function renderScreen() {
    switch (activeScreen) {
      case 'submit':
        return (
          <SubmitComplaint onSubmit={handleSubmitTicket} />
        )

      case 'my-tickets':
        return (
          <MyTickets
            tickets={tickets.filter((t) => t.submittedBy.id === currentUser.id)}
            onViewTicket={viewTicketDetail}
          />
        )

      case 'ticket-detail':
        return (
          <TicketDetail
            ticket={selectedTicket}
            currentUser={currentUser}
            onRate={handleRateTicket}
            onBack={() => goToScreen(
              currentRole === 'admin' ? 'admin-tickets' :
              currentRole === 'staff' ? 'tasks' : 'my-tickets'
            )}
          />
        )

      case 'tasks':
        return (
          <TechnicianTasks
            tickets={tickets.filter((t) =>
              t.assignedTo && t.assignedTo.id === currentUser.id
            )}
            onViewTicket={viewTicketDetail}
            onStart={handleStartTicket}
            onResolve={handleResolveTicket}
          />
        )

      case 'admin-tickets':
        return (
          <AdminTickets
            tickets={tickets}
            technicians={mockTechnicians}
            onViewTicket={viewTicketDetail}
            onAssign={handleAssignTicket}
            onReject={handleRejectTicket}
          />
        )

      case 'analytics':
        return (
          <MaintenanceAnalytics tickets={tickets} />
        )

      case 'announcements':
        return (
          <Announcements
            announcements={announcements}
            currentRole={currentRole}
            onCreate={handleCreateAnnouncement}
            onUpdate={handleUpdateAnnouncement}
            onDelete={handleDeleteAnnouncement}
            onToggle={handleToggleAnnouncement}
          />
        )

      case 'reports':
        return (
          <DownloadReports tickets={tickets} />
        )

      default:
        return (
          <MyTickets
            tickets={tickets.filter((t) => t.submittedBy.id === currentUser.id)}
            onViewTicket={viewTicketDetail}
          />
        )
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
        {/* Role Switcher - for demo/testing purposes */}
        {/* This lets us test different views without logging in as different users */}
        <div className="role-switcher">
          <span className="role-switcher-label">View as:</span>
          <button
            type="button"
            className={`role-switcher-btn ${currentRole === 'student' ? 'role-active' : ''}`}
            onClick={() => { setCurrentRole('student'); goToScreen('my-tickets') }}
          >
            Student
          </button>
          <button
            type="button"
            className={`role-switcher-btn ${currentRole === 'staff' ? 'role-active' : ''}`}
            onClick={() => { setCurrentRole('staff'); goToScreen('tasks') }}
          >
            Technician
          </button>
          <button
            type="button"
            className={`role-switcher-btn ${currentRole === 'admin' ? 'role-active' : ''}`}
            onClick={() => { setCurrentRole('admin'); goToScreen('admin-tickets') }}
          >
            Admin
          </button>
        </div>

        {/* Sub-navigation tabs - shows different tabs based on user role */}
        <nav className="maintenance-subnav" aria-label="Maintenance sub navigation">
          {getSubNavItems().map((item) => (
            <button
              key={item.key}
              type="button"
              className={`subnav-btn ${item.active ? 'subnav-active' : ''}`}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Render the active sub-screen */}
        {renderScreen()}
      </main>

      <Footer onNavigateToPage={onNavigateToPage} />
    </div>
  )
}

export default MaintenanceDashboard
