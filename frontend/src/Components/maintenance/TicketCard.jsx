// TicketCard component - shows a summary of one ticket in a card layout
// REDESIGNED: priority color left border, category icons, hover arrow
// Used in MyTickets, TechnicianTasks, and AdminTickets screens

import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'

// Category icons - emoji for quick visual scanning
const categoryIcons = {
  plumbing: '🔧',
  electrical: '⚡',
  furniture: '🪑',
  cleaning: '🧹',
  network: '🌐',
  other: '📋',
}

// Category labels for display
const categoryLabels = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  furniture: 'Furniture',
  cleaning: 'Cleaning',
  network: 'Network',
  other: 'Other',
}

function TicketCard({ ticket, onClick }) {
  // Format date to simple readable format like "25 Mar 2026"
  function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-LK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <article
      className={`ticket-card tc-priority-${ticket.priority}`}
      onClick={onClick}
    >
      {/* Top row - ticket ID and date */}
      <div className="ticket-card-header">
        <span className="ticket-id">{ticket.ticketId}</span>
        <span className="ticket-date">{formatDate(ticket.createdAt)}</span>
      </div>

      {/* Title of the ticket */}
      <h3 className="ticket-card-title">{ticket.title}</h3>

      {/* Category with icon and location info */}
      <div className="ticket-card-info">
        <span className="ticket-category">
          {categoryIcons[ticket.category] || '📋'} {categoryLabels[ticket.category] || ticket.category}
        </span>
        <span className="ticket-location">Block {ticket.hostelBlock} · Room {ticket.roomNumber}</span>
      </div>

      {/* Bottom row - priority and status badges */}
      <div className="ticket-card-footer">
        <PriorityBadge priority={ticket.priority} />
        <StatusBadge status={ticket.status} />
      </div>

      {/* Hover arrow - shows "click to view" hint on hover */}
      <span className="ticket-card-arrow" aria-hidden="true">→</span>
    </article>
  )
}

export default TicketCard
