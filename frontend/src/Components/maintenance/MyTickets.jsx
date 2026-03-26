import { useState, useMemo } from 'react'
import TicketCard from './TicketCard'
import TicketFilters from './TicketFilters'

// ============================================
// MyTickets component
// Students can view all their submitted maintenance tickets here
// They can filter tickets by status and priority
// They can sort tickets by date, priority, or status
// Clicking on a ticket card opens the full detail view
// ============================================

function MyTickets({ tickets, onViewTicket }) {
  // ---- FILTER STATE ----
  // Store the current filter values (status, priority)
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: '',
  })

  // Store the current sort option
  const [sortBy, setSortBy] = useState('newest')

  // ---- FILTER AND SORT TICKETS ----
  // useMemo recalculates only when tickets, filters, or sortBy changes
  // This prevents unnecessary re-calculations on every render
  const filteredTickets = useMemo(() => {
    let result = [...tickets]

    // Apply status filter if selected
    if (filters.status) {
      result = result.filter((ticket) => ticket.status === filters.status)
    }

    // Apply priority filter if selected
    if (filters.priority) {
      result = result.filter((ticket) => ticket.priority === filters.priority)
    }

    // Apply category filter if selected
    if (filters.category) {
      result = result.filter((ticket) => ticket.category === filters.category)
    }

    // Apply sorting
    if (sortBy === 'newest') {
      // Sort by newest first (most recent date at top)
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'oldest') {
      // Sort by oldest first
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortBy === 'priority') {
      // Sort by priority level (emergency first, low last)
      const priorityOrder = { emergency: 0, high: 1, medium: 2, low: 3 }
      result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    }

    return result
  }, [tickets, filters, sortBy])

  // ---- COUNT TICKETS BY STATUS ----
  // Show how many tickets are in each status for quick overview
  const statusCounts = useMemo(() => {
    const counts = {}
    tickets.forEach((ticket) => {
      counts[ticket.status] = (counts[ticket.status] || 0) + 1
    })
    return counts
  }, [tickets])

  // Status labels for display
  const statusLabels = {
    submitted: 'Submitted',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    rejected: 'Rejected',
  }

  return (
    <section className="maint-section">
      {/* Page header */}
      <div className="maint-section-header">
        <p className="eyebrow">My tickets</p>
        <h2>Your maintenance requests</h2>
        <p>View and track all your submitted maintenance complaints. Click on a ticket to see full details.</p>
      </div>

      {/* Status count badges - quick overview of ticket statuses */}
      {tickets.length > 0 && (
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
      )}

      {/* Filter bar and sort dropdown */}
      {tickets.length > 0 && (
        <div style={{ display: 'flex', gap: '14px', flexDirection: 'column' }}>
          <TicketFilters
            filters={filters}
            onFilterChange={setFilters}
            showCategory={true}
            showSearch={false}
          />

          {/* Sort dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="filter-label" style={{ margin: 0 }}>Sort by:</span>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority (Highest First)</option>
            </select>
            <span style={{ fontSize: '0.86rem', color: '#5b645f' }}>
              Showing {filteredTickets.length} of {tickets.length} tickets
            </span>
          </div>
        </div>
      )}

      {/* Ticket list - show cards in a grid */}
      {filteredTickets.length > 0 ? (
        <div className="ticket-grid">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              onClick={() => onViewTicket(ticket)}
            />
          ))}
        </div>
      ) : tickets.length > 0 ? (
        // Show this when filters return no results
        <div className="empty-state">
          <span className="empty-state-icon">🔍</span>
          <h3>No tickets match your filters</h3>
          <p>Try changing or clearing the filters to see more tickets.</p>
          <button
            type="button"
            className="button button-outline"
            onClick={() => setFilters({ status: '', priority: '', category: '', search: '' })}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        // Show this when student has no tickets at all
        <div className="empty-state">
          <span className="empty-state-icon">📋</span>
          <h3>No tickets yet</h3>
          <p>You have not submitted any maintenance complaints yet. Use the "Submit Complaint" tab to report an issue.</p>
        </div>
      )}
    </section>
  )
}

export default MyTickets
