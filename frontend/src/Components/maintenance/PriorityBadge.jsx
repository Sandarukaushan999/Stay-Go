// PriorityBadge component - shows how urgent a ticket is
// Emergency = most urgent (red), High = orange, Medium = yellow, Low = green
// Used in ticket cards and admin ticket management

function PriorityBadge({ priority }) {
  // Map each priority level to a CSS class for different colors
  const priorityStyles = {
    low: 'priority-badge-low',
    medium: 'priority-badge-medium',
    high: 'priority-badge-high',
    emergency: 'priority-badge-emergency',
  }

  // Map priority values to readable text with icon
  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    emergency: 'Emergency',
  }

  return (
    <span className={`priority-badge ${priorityStyles[priority] || ''}`}>
      {priorityLabels[priority] || priority}
    </span>
  )
}

export default PriorityBadge
