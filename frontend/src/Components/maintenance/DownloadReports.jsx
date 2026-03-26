// DownloadReports component - PLACEHOLDER
// Will be fully built in Phase 5
// Admin can generate and download PDF maintenance reports

function DownloadReports({ tickets }) {
  return (
    <section className="maint-section">
      <div className="maint-section-header">
        <p className="eyebrow">Reports</p>
        <h2>Download maintenance reports</h2>
        <p>Generate and download summary reports about maintenance activities.</p>
      </div>
      <div className="empty-state">
        <span className="empty-state-icon">📄</span>
        <h3>Report Generator</h3>
        <p>Report filters and PDF download will be built in Phase 5.</p>
      </div>
    </section>
  )
}

export default DownloadReports
