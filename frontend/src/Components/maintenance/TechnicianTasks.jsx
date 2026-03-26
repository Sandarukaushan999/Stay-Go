import { useState, useMemo } from 'react'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'

// ============================================
// TechnicianTasks component
// Technicians see their assigned maintenance tickets here
// Tickets are grouped by status: Assigned (new) | In Progress | Resolved
// Technician can:
//   - "Start Work" on assigned tickets (status: assigned -> in_progress)
//   - "Mark Resolved" on in-progress tickets (status: in_progress -> resolved)
// ============================================

function TechnicianTasks({ tickets, onViewTicket, onStart, onResolve }) {
  // ---- STATE ----
  // Track which ticket has the resolve modal open
  const [resolvingTicket, setResolvingTicket] = useState(null)
  // Resolution note text that technician writes when resolving
  const [resolutionNote, setResolutionNote] = useState('')
  // Error message for resolution note validation
  const [resolveError, setResolveError] = useState('')

  // ---- GROUP TICKETS BY STATUS ----
  // Separate tickets into three groups for display
  const assignedTickets = useMemo(() =>
    tickets.filter((t) => t.status === 'assigned'), [tickets]
  )
  const inProgressTickets = useMemo(() =>
    tickets.filter((t) => t.status === 'in_progress'), [tickets]
  )
  const resolvedTickets = useMemo(() =>
    tickets.filter((t) => t.status === 'resolved' || t.status === 'closed'), [tickets]
  )

  // ---- HANDLE START WORK ----
  // When technician clicks "Start Work" button
  function handleStartWork(ticketId) {
    onStart(ticketId)
  }

  // ---- HANDLE RESOLVE ----
  // Open the resolve modal for a ticket
  function openResolveModal(ticket) {
    setResolvingTicket(ticket)
    setResolutionNote('')
    setResolveError('')
  }

  // Close the resolve modal
  function closeResolveModal() {
    setResolvingTicket(null)
    setResolutionNote('')
    setResolveError('')
  }

  // Submit the resolution - validate and send to parent
  function handleResolveSubmit() {
    // Resolution note must be at least 10 characters
    if (!resolutionNote.trim()) {
      setResolveError('Please describe what you did to fix the issue')
      return
    }
    if (resolutionNote.trim().length < 10) {
      setResolveError('Resolution note must be at least 10 characters')
      return
    }

    // Call parent function to update ticket status
    onResolve(resolvingTicket._id, resolutionNote.trim())
    closeResolveModal()
  }

  // ---- HELPER: Format date ----
  function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-LK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // ---- HELPER: Category labels ----
  const categoryLabels = {
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    furniture: 'Furniture',
    cleaning: 'Cleaning',
    network: 'Network',
    other: 'Other',
  }

  // ---- RENDER A TASK CARD WITH ACTIONS ----
  // This is a custom card for technician view with action buttons
  function renderTaskCard(ticket, actions) {
    return (
      <div className="ticket-card" key={ticket._id} style={{ cursor: 'default' }}>
        {/* Top row - ticket ID and date */}
        <div className="ticket-card-header">
          <span className="ticket-id">{ticket.ticketId}</span>
          <span className="ticket-date">{formatDate(ticket.createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className="ticket-card-title">{ticket.title}</h3>

        {/* Category and location info */}
        <div className="ticket-card-info">
          <span className="ticket-category">{categoryLabels[ticket.category] || ticket.category}</span>
          <span className="ticket-location">Block {ticket.hostelBlock} - Room {ticket.roomNumber}</span>
        </div>

        {/* Priority and status badges */}
        <div className="ticket-card-footer">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>

        {/* Action buttons - different for each status group */}
        <div className="task-actions">
          <button
            type="button"
            className="button button-outline"
            style={{ fontSize: '0.86rem', minHeight: '38px', padding: '0 16px' }}
            onClick={() => onViewTicket(ticket)}
          >
            View Details
          </button>
          {actions}
        </div>
      </div>
    )
  }

  // ---- RENDER A GROUP OF TASKS ----
  // Shows a group header with count and the task cards
  function renderTaskGroup(title, taskList, renderActions) {
    return (
      <div className="task-group">
        <div className="task-group-header">
          <span className="task-group-title">{title}</span>
          <span className="task-group-count">{taskList.length}</span>
        </div>

        {taskList.length > 0 ? (
          <div className="ticket-grid">
            {taskList.map((ticket) => renderTaskCard(ticket, renderActions(ticket)))}
          </div>
        ) : (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            color: '#5b645f',
            fontSize: '0.92rem',
            background: 'rgba(16, 19, 18, 0.02)',
            borderRadius: '14px',
          }}>
            No tickets in this group
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="maint-section">
      {/* Page header */}
      <div className="maint-section-header">
        <p className="eyebrow">My tasks</p>
        <h2>Assigned maintenance tasks</h2>
        <p>View tickets assigned to you and update their progress. Start work when you begin, and mark as resolved when done.</p>
      </div>

      {/* Show total task count */}
      {tickets.length > 0 && (
        <div className="status-counts">
          <div className="status-count-item">
            <span>Total Assigned:</span>
            <strong>{tickets.length}</strong>
          </div>
          <div className="status-count-item">
            <span>New:</span>
            <strong>{assignedTickets.length}</strong>
          </div>
          <div className="status-count-item">
            <span>In Progress:</span>
            <strong>{inProgressTickets.length}</strong>
          </div>
          <div className="status-count-item">
            <span>Completed:</span>
            <strong>{resolvedTickets.length}</strong>
          </div>
        </div>
      )}

      {/* If no tickets at all, show empty state */}
      {tickets.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🛠️</span>
          <h3>No tasks assigned yet</h3>
          <p>You do not have any maintenance tickets assigned to you at the moment. Check back later.</p>
        </div>
      ) : (
        <>
          {/* Group 1: Assigned (new tickets - need to start work) */}
          {renderTaskGroup('New — Assigned to You', assignedTickets, (ticket) => (
            <button
              type="button"
              className="button button-dark"
              style={{ fontSize: '0.86rem', minHeight: '38px', padding: '0 16px' }}
              onClick={() => handleStartWork(ticket._id)}
            >
              Start Work
            </button>
          ))}

          {/* Group 2: In Progress (working on - can mark resolved) */}
          {renderTaskGroup('In Progress — Working On', inProgressTickets, (ticket) => (
            <button
              type="button"
              className="button button-dark"
              style={{ fontSize: '0.86rem', minHeight: '38px', padding: '0 16px', background: '#876DFF', color: '#fff' }}
              onClick={() => openResolveModal(ticket)}
            >
              Mark Resolved
            </button>
          ))}

          {/* Group 3: Resolved / Closed (completed) */}
          {renderTaskGroup('Completed', resolvedTickets, () => null)}
        </>
      )}

      {/* ---- RESOLVE MODAL ---- */}
      {/* Shows when technician clicks "Mark Resolved" */}
      {resolvingTicket && (
        <div className="modal-overlay" onClick={closeResolveModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Resolve Ticket: {resolvingTicket.ticketId}</h3>
            <p style={{ color: '#5b645f', margin: '0 0 16px' }}>
              Please describe what you did to fix the issue. This note will be visible to the student.
            </p>

            {/* Resolution note input */}
            <div className="form-group">
              <label className="form-label">
                Resolution Note <span className="required">*</span>
              </label>
              <textarea
                className={`form-textarea ${resolveError ? 'input-error' : ''}`}
                placeholder="Describe the work done to fix the issue (e.g., Replaced broken pipe, tightened screws, etc.)"
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                maxLength={500}
              />
              <span className="form-hint">{resolutionNote.length}/500 characters (minimum 10)</span>
              {resolveError && <span className="form-error">{resolveError}</span>}
            </div>

            {/* Modal action buttons */}
            <div className="modal-actions">
              <button type="button" className="button button-dark" onClick={handleResolveSubmit}>
                Confirm Resolved
              </button>
              <button type="button" className="button button-outline" onClick={closeResolveModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default TechnicianTasks
