// StatusBadge component - shows the current status of a ticket
// Each status has a different color so users can quickly identify ticket state
// Used in ticket cards, ticket detail view, and admin ticket table

function StatusBadge({ status }) {
  // Map each status to a CSS class for different colors
  const statusStyles = {
    submitted: 'status-badge-submitted',
    assigned: 'status-badge-assigned',
    in_progress: 'status-badge-progress',
    resolved: 'status-badge-resolved',
    closed: 'status-badge-closed',
    rejected: 'status-badge-rejected',
  }

  // Map status values to nice readable text for display
  const statusLabels = {
    submitted: 'Submitted',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    rejected: 'Rejected',
  }

  return (
    <span className={`status-badge ${statusStyles[status] || ''}`}>
      {statusLabels[status] || status}
    </span>
  )
}

export default StatusBadge
