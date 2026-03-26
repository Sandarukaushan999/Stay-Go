// SubmitComplaint component - PLACEHOLDER
// Will be fully built in Phase 3
// Students use this form to submit new maintenance complaints

function SubmitComplaint({ onSubmit }) {
  return (
    <section className="maint-section">
      <div className="maint-section-header">
        <p className="eyebrow">Submit a complaint</p>
        <h2>Report a maintenance issue</h2>
        <p>Fill in the details below to submit a new maintenance request. Our team will review and assign a technician.</p>
      </div>
      <div className="empty-state">
        <span className="empty-state-icon">🔧</span>
        <h3>Submit Complaint Form</h3>
        <p>This form will be fully built in the next phase with all validations.</p>
      </div>
    </section>
  )
}

export default SubmitComplaint
