// TicketCard component - shows a summary of one ticket in a card layout
// Used in MyTickets, TechnicianTasks, and AdminTickets screens
// Shows: ticket ID, title, category, priority, status, date, and room info

import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'

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

  // Map category values to nice readable labels
  const categoryLabels = {
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    furniture: 'Furniture',
    cleaning: 'Cleaning',
    network: 'Network',
    other: 'Other',
  }

  return (
    <article className="ticket-card" onClick={onClick}>
      {/* Top row - ticket ID and date */}
      <div className="ticket-card-header">
        <span className="ticket-id">{ticket.ticketId}</span>
        <span className="ticket-date">{formatDate(ticket.createdAt)}</span>
      </div>

      {/* Title of the ticket */}
      <h3 className="ticket-card-title">{ticket.title}</h3>

      {/* Category and location info */}
      <div className="ticket-card-info">
        <span className="ticket-category">{categoryLabels[ticket.category] || ticket.category}</span>
        <span className="ticket-location">Block {ticket.hostelBlock} - Room {ticket.roomNumber}</span>
      </div>

      {/* Bottom row - priority and status badges */}
      <div className="ticket-card-footer">
        <PriorityBadge priority={ticket.priority} />
        <StatusBadge status={ticket.status} />
      </div>
    </article>
  )
}

export default TicketCard
