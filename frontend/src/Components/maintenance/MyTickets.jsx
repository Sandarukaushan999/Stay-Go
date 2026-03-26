// MyTickets component - PLACEHOLDER
// Will be fully built in Phase 3
// Students view their submitted tickets here

function MyTickets({ tickets, onViewTicket }) {
  return (
    <section className="maint-section">
      <div className="maint-section-header">
        <p className="eyebrow">My tickets</p>
        <h2>Your maintenance requests</h2>
        <p>View and track all your submitted maintenance complaints.</p>
      </div>
      <div className="empty-state">
        <span className="empty-state-icon">📋</span>
        <h3>My Tickets List</h3>
        <p>Ticket list with filters will be built in the next phase.</p>
      </div>
    </section>
  )
}

export default MyTickets
