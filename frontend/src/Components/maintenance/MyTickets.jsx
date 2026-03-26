import { useState, useMemo } from 'react'
import TicketCard from './TicketCard'
import TicketFilters from './TicketFilters'

// ============================================
// MyTickets component - REDESIGNED
// Color-coded status overview cards + compact filter bar + redesigned ticket cards
// Students can view, filter, sort, and click to view details
// ============================================

function MyTickets({ tickets, onViewTicket }) {
  // ---- FILTER AND SORT STATE ----
  const [filters, setFilters] = useState({
    status: '', priority: '', category: '', search: '',
  })
  const [sortBy, setSortBy] = useState('newest')

  // ---- FILTER AND SORT TICKETS ----
  const filteredTickets = useMemo(() => {
    let result = [...tickets]

    // Apply filters
    if (filters.status) result = result.filter((t) => t.status === filters.status)
    if (filters.priority) result = result.filter((t) => t.priority === filters.priority)
    if (filters.category) result = result.filter((t) => t.category === filters.category)

    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortBy === 'priority') {
      const order = { emergency: 0, high: 1, medium: 2, low: 3 }
      result.sort((a, b) => order[a.priority] - order[b.priority])
    }

    return result
  }, [tickets, filters, sortBy])

  // ---- COUNT TICKETS BY STATUS ----
  const statusCounts = useMemo(() => {
    const counts = { submitted: 0, assigned: 0, in_progress: 0, resolved: 0, closed: 0, rejected: 0 }
    tickets.forEach((t) => { if (counts[t.status] !== undefined) counts[t.status]++ })
    return counts
  }, [tickets])

  return (
    <section className="maint-section">
      {/* Page header */}
      <div className="maint-section-header">
        <p className="eyebrow">My tickets</p>
        <h2>Your maintenance requests</h2>
        <p>View and track all your submitted maintenance complaints. Click on a ticket to see full details.</p>
      </div>

      {/* Color-coded status overview cards */}
      {tickets.length > 0 && (
        <div className="status-overview">
          <div className="status-ov-card status-ov-total">
            <span>Total</span>
            <strong>{tickets.length}</strong>
          </div>
          <div className="status-ov-card status-ov-submitted">
            <span>Submitted</span>
            <strong>{statusCounts.submitted}</strong>
          </div>
          <div className="status-ov-card status-ov-assigned">
            <span>Assigned</span>
            <strong>{statusCounts.assigned}</strong>
          </div>
          <div className="status-ov-card status-ov-progress">
            <span>In Progress</span>
            <strong>{statusCounts.in_progress}</strong>
          </div>
          <div className="status-ov-card status-ov-resolved">
            <span>Resolved</span>
            <strong>{statusCounts.resolved}</strong>
          </div>
          <div className="status-ov-card status-ov-closed">
            <span>Closed</span>
            <strong>{statusCounts.closed}</strong>
          </div>
        </div>
      )}

      {/* Compact filter + sort bar */}
      {tickets.length > 0 && (
        <TicketFilters
          filters={filters}
          onFilterChange={setFilters}
          showCategory={true}
          showSearch={false}
          sortBy={sortBy}
          onSortChange={setSortBy}
          resultCount={filteredTickets.length}
          totalCount={tickets.length}
        />
      )}

      {/* Ticket cards grid */}
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
