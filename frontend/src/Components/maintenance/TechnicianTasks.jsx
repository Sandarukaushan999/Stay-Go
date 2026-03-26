// TechnicianTasks component - PLACEHOLDER
// Will be fully built in Phase 4
// Technicians see their assigned tickets and can start/resolve them

function TechnicianTasks({ tickets, onViewTicket, onStart, onResolve }) {
  return (
    <section className="maint-section">
      <div className="maint-section-header">
        <p className="eyebrow">My tasks</p>
        <h2>Assigned maintenance tasks</h2>
        <p>View tickets assigned to you and update their progress.</p>
      </div>
      <div className="empty-state">
        <span className="empty-state-icon">🛠️</span>
        <h3>Technician Tasks</h3>
        <p>Task list with start/resolve actions will be built in Phase 4.</p>
      </div>
    </section>
  )
}

export default TechnicianTasks
