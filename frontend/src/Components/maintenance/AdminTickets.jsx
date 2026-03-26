import { useState, useMemo } from 'react'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import TicketFilters from './TicketFilters'

// ============================================
// AdminTickets component
// Admin can view ALL tickets in the system from this screen
// Admin actions:
//   - Assign a technician to "submitted" tickets
//   - Reject "submitted" tickets with a reason
//   - View full details of any ticket
//   - Filter and search across all tickets
//   - See status count overview
// ============================================

function AdminTickets({ tickets, technicians, onViewTicket, onAssign, onReject }) {
  // ---- STATE ----
  // Filter values for the filter bar
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: '',
  })

  // Pagination - show 15 tickets per page
  const [currentPage, setCurrentPage] = useState(1)
  const ticketsPerPage = 15

  // Modal state for assigning technician
  const [assigningTicket, setAssigningTicket] = useState(null)
  const [selectedTechnician, setSelectedTechnician] = useState('')

  // Modal state for rejecting ticket
  const [rejectingTicket, setRejectingTicket] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState('')

  // ---- FILTER TICKETS ----
  const filteredTickets = useMemo(() => {
    let result = [...tickets]

    // Apply status filter
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status)
    }

    // Apply priority filter
    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority)
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter((t) => t.category === filters.category)
    }

    // Apply search filter - search in ticket ID, title, and room number
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter((t) =>
        t.ticketId.toLowerCase().includes(searchLower) ||
        t.title.toLowerCase().includes(searchLower) ||
        t.roomNumber.includes(filters.search)
      )
    }

    // Sort by newest first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return result
  }, [tickets, filters])

  // ---- PAGINATION ----
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage)
  const startIndex = (currentPage - 1) * ticketsPerPage
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + ticketsPerPage)

  // Reset to page 1 when filters change
  function handleFilterChange(newFilters) {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  // ---- STATUS COUNTS ----
  const statusCounts = useMemo(() => {
    const counts = {}
    tickets.forEach((t) => {
      counts[t.status] = (counts[t.status] || 0) + 1
    })
    return counts
  }, [tickets])

  const statusLabels = {
    submitted: 'Submitted',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    rejected: 'Rejected',
  }

  // ---- CATEGORY LABELS ----
  const categoryLabels = {
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    furniture: 'Furniture',
    cleaning: 'Cleaning',
    network: 'Network',
    other: 'Other',
  }

  // ---- FORMAT DATE ----
  function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-LK', {
      day: 'numeric',
      month: 'short',
    })
  }

  // ---- ASSIGN TECHNICIAN HANDLERS ----
  function openAssignModal(ticket) {
    setAssigningTicket(ticket)
    setSelectedTechnician('')
  }

  function closeAssignModal() {
    setAssigningTicket(null)
    setSelectedTechnician('')
  }

  function handleAssignSubmit() {
    if (!selectedTechnician) return
    onAssign(assigningTicket._id, selectedTechnician)
    closeAssignModal()
  }

  // ---- REJECT TICKET HANDLERS ----
  function openRejectModal(ticket) {
    setRejectingTicket(ticket)
    setRejectReason('')
    setRejectError('')
  }

  function closeRejectModal() {
    setRejectingTicket(null)
    setRejectReason('')
    setRejectError('')
  }

  function handleRejectSubmit() {
    // Validate rejection reason - must be at least 10 characters
    if (!rejectReason.trim()) {
      setRejectError('Please provide a reason for rejection')
      return
    }
    if (rejectReason.trim().length < 10) {
      setRejectError('Rejection reason must be at least 10 characters')
      return
    }
    onReject(rejectingTicket._id, rejectReason.trim())
    closeRejectModal()
  }

  return (
    <section className="maint-section">
      {/* Page header */}
      <div className="maint-section-header">
        <p className="eyebrow">All tickets</p>
        <h2>Admin ticket management</h2>
        <p>View all maintenance tickets, assign technicians, and manage the workflow across all hostel blocks.</p>
      </div>

      {/* Status count badges */}
      <div className="status-counts">
        <div className="status-count-item">
          <span>Total:</span>
          <strong>{tickets.length}</strong>
        </div>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div className="status-count-item" key={status}>
            <span>{statusLabels[status] || status}:</span>
            <strong>{count}</strong>
          </div>
        ))}
      </div>

      {/* Filter bar with search */}
      <TicketFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        showCategory={true}
        showSearch={true}
      />

      {/* Results count */}
      <div style={{ fontSize: '0.88rem', color: '#5b645f', padding: '4px 0' }}>
        Showing {paginatedTickets.length} of {filteredTickets.length} tickets
        {filteredTickets.length !== tickets.length && ` (${tickets.length} total)`}
      </div>

      {/* Ticket table */}
      {paginatedTickets.length > 0 ? (
        <div className="admin-ticket-list">
          {/* Table header row */}
          <div className="admin-ticket-row admin-ticket-header">
            <span>Ticket ID</span>
            <span>Title</span>
            <span>Category</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Date</span>
            <span>Actions</span>
          </div>

          {/* Ticket rows */}
          {paginatedTickets.map((ticket) => (
            <div className="admin-ticket-row" key={ticket._id}>
              <span className="ticket-id">{ticket.ticketId}</span>
              <span style={{ fontWeight: 600 }}>{ticket.title}</span>
              <span>{categoryLabels[ticket.category] || ticket.category}</span>
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
              <span className="ticket-date">{formatDate(ticket.createdAt)}</span>

              {/* Action buttons - depend on ticket status */}
              <div className="admin-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-view"
                  onClick={() => onViewTicket(ticket)}
                >
                  View
                </button>

                {/* Show Assign and Reject buttons only for submitted tickets */}
                {ticket.status === 'submitted' && (
                  <>
                    <button
                      type="button"
                      className="admin-btn admin-btn-assign"
                      onClick={() => openAssignModal(ticket)}
                    >
                      Assign
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-reject"
                      onClick={() => openRejectModal(ticket)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state-icon">📋</span>
          <h3>No tickets found</h3>
          <p>No tickets match your current filters. Try adjusting or clearing the filters.</p>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
          <button
            type="button"
            className="button button-outline"
            style={{ minHeight: '38px', padding: '0 16px', fontSize: '0.86rem' }}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span style={{
            display: 'flex', alignItems: 'center', padding: '0 14px',
            fontSize: '0.88rem', fontWeight: 700, color: '#5b645f'
          }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="button button-outline"
            style={{ minHeight: '38px', padding: '0 16px', fontSize: '0.86rem' }}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* ---- ASSIGN TECHNICIAN MODAL ---- */}
      {assigningTicket && (
        <div className="modal-overlay" onClick={closeAssignModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Assign Technician</h3>
            <p style={{ color: '#5b645f', margin: '0 0 6px' }}>
              Ticket: <strong>{assigningTicket.ticketId}</strong> — {assigningTicket.title}
            </p>
            <p style={{ color: '#5b645f', margin: '0 0 16px', fontSize: '0.88rem' }}>
              Block {assigningTicket.hostelBlock}, Room {assigningTicket.roomNumber}
            </p>

            {/* Technician dropdown */}
            <div className="form-group">
              <label className="form-label">Select Technician</label>
              <select
                className="form-select"
                value={selectedTechnician}
                onChange={(e) => setSelectedTechnician(e.target.value)}
              >
                <option value="">Choose a technician...</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name} ({tech.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="button button-dark"
                disabled={!selectedTechnician}
                onClick={handleAssignSubmit}
              >
                Assign
              </button>
              <button type="button" className="button button-outline" onClick={closeAssignModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- REJECT TICKET MODAL ---- */}
      {rejectingTicket && (
        <div className="modal-overlay" onClick={closeRejectModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Reject Ticket</h3>
            <p style={{ color: '#5b645f', margin: '0 0 16px' }}>
              Ticket: <strong>{rejectingTicket.ticketId}</strong> — {rejectingTicket.title}
            </p>

            {/* Rejection reason input */}
            <div className="form-group">
              <label className="form-label">
                Rejection Reason <span className="required">*</span>
              </label>
              <textarea
                className={`form-textarea ${rejectError ? 'input-error' : ''}`}
                placeholder="Explain why this ticket is being rejected (e.g., duplicate, invalid, spam)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                maxLength={500}
              />
              <span className="form-hint">{rejectReason.length}/500 characters (minimum 10)</span>
              {rejectError && <span className="form-error">{rejectError}</span>}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="button button-dark"
                style={{ background: '#c0392b' }}
                onClick={handleRejectSubmit}
              >
                Confirm Reject
              </button>
              <button type="button" className="button button-outline" onClick={closeRejectModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminTickets
