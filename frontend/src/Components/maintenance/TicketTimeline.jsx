// TicketTimeline component - shows the history of a ticket as a vertical timeline
// Each step shows: status change, who did it, when, and any notes
// This helps students and staff see exactly what happened with a ticket

function TicketTimeline({ statusHistory = [] }) {
  // Map status values to readable labels
  const statusLabels = {
    submitted: 'Ticket Submitted',
    assigned: 'Technician Assigned',
    in_progress: 'Work Started',
    resolved: 'Issue Resolved',
    closed: 'Ticket Closed',
    rejected: 'Ticket Rejected',
  }

  // Format date to a simple readable format like "25 Mar 2026, 10:30 AM"
  function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-LK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // If no history available, show a message
  if (statusHistory.length === 0) {
    return (
      <div className="ticket-timeline">
        <p className="timeline-empty">No status history available yet.</p>
      </div>
    )
  }

  return (
    <div className="ticket-timeline">
      {statusHistory.map((entry, index) => (
        <div
          key={index}
          className={`timeline-entry ${index === statusHistory.length - 1 ? 'timeline-entry-active' : ''}`}
        >
          {/* The dot and line on the left side of the timeline */}
          <div className="timeline-marker">
            <span className="timeline-dot" />
            {index < statusHistory.length - 1 && <span className="timeline-line" />}
          </div>

          {/* The content on the right side - status, date, note */}
          <div className="timeline-content">
            <strong className="timeline-status">
              {statusLabels[entry.status] || entry.status}
            </strong>
            <span className="timeline-date">{formatDate(entry.changedAt)}</span>
            {/* Show the name of person who made this change */}
            {entry.changedBy && (
              <span className="timeline-user">
                by {typeof entry.changedBy === 'object' ? entry.changedBy.name : 'System'}
              </span>
            )}
            {/* Show any notes for this status change */}
            {entry.note && <p className="timeline-note">{entry.note}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TicketTimeline
