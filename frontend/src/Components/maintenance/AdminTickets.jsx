// AdminTickets component - PLACEHOLDER
// Will be fully built in Phase 4
// Admin manages all tickets - assign technicians, reject tickets

function AdminTickets({ tickets, technicians, onViewTicket, onAssign, onReject }) {
  return (
    <section className="maint-section">
      <div className="maint-section-header">
        <p className="eyebrow">All tickets</p>
        <h2>Admin ticket management</h2>
        <p>View all tickets, assign technicians, and manage the maintenance workflow.</p>
      </div>
      <div className="empty-state">
        <span className="empty-state-icon">⚙️</span>
        <h3>Admin Ticket Management</h3>
        <p>Full admin view with assign/reject actions will be built in Phase 4.</p>
      </div>
    </section>
  )
}

export default AdminTickets
