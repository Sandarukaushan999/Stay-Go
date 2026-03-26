// Announcements component - PLACEHOLDER
// Will be fully built in Phase 4
// Admin can create/edit/delete announcements, all users can view

function Announcements({ announcements, currentRole, onCreate, onUpdate, onDelete, onToggle }) {
  return (
    <section className="maint-section">
      <div className="maint-section-header">
        <p className="eyebrow">Announcements</p>
        <h2>Hostel announcements</h2>
        <p>View important announcements from the hostel administration.</p>
      </div>
      <div className="empty-state">
        <span className="empty-state-icon">📢</span>
        <h3>Announcements</h3>
        <p>Announcement CRUD and view will be built in Phase 4.</p>
      </div>
    </section>
  )
}

export default Announcements
