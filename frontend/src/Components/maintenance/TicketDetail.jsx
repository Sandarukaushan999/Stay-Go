// TicketDetail component - PLACEHOLDER
// Will be fully built in Phase 3
// Shows full details of a single ticket with timeline and rating

function TicketDetail({ ticket, currentUser, onRate, onBack }) {
  return (
    <section className="maint-section">
      <button type="button" className="back-btn" onClick={onBack}>← Back to list</button>
      <div className="maint-section-header">
        <p className="eyebrow">Ticket detail</p>
        <h2>Ticket information</h2>
        <p>Full ticket details with status timeline will be built in the next phase.</p>
      </div>
      <div className="empty-state">
        <span className="empty-state-icon">🔍</span>
        <h3>Ticket Detail View</h3>
        <p>Full detail view with timeline and rating will be built in the next phase.</p>
      </div>
    </section>
  )
}

export default TicketDetail
