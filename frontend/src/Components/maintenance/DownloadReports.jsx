import { useState, useMemo } from 'react'

// ============================================
// DownloadReports component
// Admin can generate and download PDF summary reports
// Features:
//   - Date range selector (from/to)
//   - Filter by hostel block, priority, and status
//   - Report preview with summary stats
//   - Download as PDF (uses browser print for now, will use jsPDF later)
// ============================================

function DownloadReports({ tickets }) {
  // ---- STATE ----
  // Date range for the report
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Filter options
  const [filterBlock, setFilterBlock] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Track if report has been generated
  const [isGenerated, setIsGenerated] = useState(false)

  // Validation error
  const [error, setError] = useState('')

  // ---- FILTER TICKETS FOR REPORT ----
  const reportTickets = useMemo(() => {
    let result = [...tickets]

    // Apply date range filter
    if (dateFrom) {
      result = result.filter((t) => new Date(t.createdAt) >= new Date(dateFrom))
    }
    if (dateTo) {
      // Add one day to include the end date fully
      const endDate = new Date(dateTo)
      endDate.setDate(endDate.getDate() + 1)
      result = result.filter((t) => new Date(t.createdAt) < endDate)
    }

    // Apply hostel block filter
    if (filterBlock) {
      result = result.filter((t) => t.hostelBlock === filterBlock)
    }

    // Apply priority filter
    if (filterPriority) {
      result = result.filter((t) => t.priority === filterPriority)
    }

    // Apply status filter
    if (filterStatus) {
      result = result.filter((t) => t.status === filterStatus)
    }

    return result
  }, [tickets, dateFrom, dateTo, filterBlock, filterPriority, filterStatus])

  // ---- CALCULATE REPORT STATS ----
  const reportStats = useMemo(() => {
    const total = reportTickets.length
    const resolved = reportTickets.filter((t) =>
      t.status === 'resolved' || t.status === 'closed'
    ).length
    const pending = reportTickets.filter((t) =>
      t.status === 'submitted' || t.status === 'assigned' || t.status === 'in_progress'
    ).length
    const rejected = reportTickets.filter((t) => t.status === 'rejected').length

    // Count by priority
    const priorityCounts = { low: 0, medium: 0, high: 0, emergency: 0 }
    reportTickets.forEach((t) => {
      if (priorityCounts[t.priority] !== undefined) {
        priorityCounts[t.priority]++
      }
    })

    // Average rating
    const ratedTickets = reportTickets.filter((t) => t.rating !== null)
    const avgRating = ratedTickets.length > 0
      ? (ratedTickets.reduce((sum, t) => sum + t.rating, 0) / ratedTickets.length).toFixed(1)
      : 'N/A'

    return { total, resolved, pending, rejected, priorityCounts, avgRating }
  }, [reportTickets])

  // ---- GENERATE REPORT ----
  function handleGenerate() {
    setError('')

    // Validate - at least one filter must be applied
    if (!dateFrom && !dateTo && !filterBlock && !filterPriority && !filterStatus) {
      setError('Please select at least one filter or date range to generate a report')
      return
    }

    // Validate date range - "from" cannot be after "to"
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      setError('Start date cannot be after end date')
      return
    }

    setIsGenerated(true)
  }

  // ---- DOWNLOAD PDF ----
  // For now we use browser print dialog to save as PDF
  // In future this will be replaced with jsPDF library
  function handleDownload() {
    // Create a printable version of the report
    const printContent = document.getElementById('report-preview')
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Maintenance Report - STAY & GO</title>
          <style>
            body { font-family: 'Manrope', Arial, sans-serif; padding: 30px; color: #101312; }
            h1 { font-family: 'Space Grotesk', Arial, sans-serif; font-size: 24px; margin-bottom: 5px; }
            h2 { font-family: 'Space Grotesk', Arial, sans-serif; font-size: 18px; margin-top: 24px; }
            .report-meta { color: #5b645f; font-size: 13px; margin-bottom: 24px; }
            .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 16px 0; }
            .stat-box { padding: 14px; border: 1px solid #eee; border-radius: 8px; text-align: center; }
            .stat-box strong { display: block; font-size: 28px; font-family: 'Space Grotesk', Arial, sans-serif; }
            .stat-box span { font-size: 12px; color: #5b645f; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 13px; }
            th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; }
            th { font-size: 11px; text-transform: uppercase; color: #5b645f; letter-spacing: 0.08em; }
            .footer { margin-top: 30px; padding-top: 14px; border-top: 1px solid #eee; font-size: 12px; color: #5b645f; }
          </style>
        </head>
        <body>
          <h1>Maintenance Summary Report</h1>
          <p class="report-meta">
            STAY & GO — Hostel Maintenance Management System<br>
            Generated: ${new Date().toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}<br>
            ${dateFrom ? 'From: ' + dateFrom : ''} ${dateTo ? ' To: ' + dateTo : ''}
            ${filterBlock ? ' | Block: ' + filterBlock : ''}
            ${filterPriority ? ' | Priority: ' + filterPriority : ''}
            ${filterStatus ? ' | Status: ' + filterStatus : ''}
          </p>

          <h2>Summary Statistics</h2>
          <div class="stat-grid">
            <div class="stat-box"><span>Total Tickets</span><strong>${reportStats.total}</strong></div>
            <div class="stat-box"><span>Resolved/Closed</span><strong>${reportStats.resolved}</strong></div>
            <div class="stat-box"><span>Pending</span><strong>${reportStats.pending}</strong></div>
            <div class="stat-box"><span>Rejected</span><strong>${reportStats.rejected}</strong></div>
            <div class="stat-box"><span>Avg Rating</span><strong>${reportStats.avgRating}</strong></div>
            <div class="stat-box"><span>Resolution Rate</span><strong>${reportStats.total > 0 ? ((reportStats.resolved / reportStats.total) * 100).toFixed(1) : 0}%</strong></div>
          </div>

          <h2>Priority Breakdown</h2>
          <div class="stat-grid">
            <div class="stat-box"><span>Low</span><strong>${reportStats.priorityCounts.low}</strong></div>
            <div class="stat-box"><span>Medium</span><strong>${reportStats.priorityCounts.medium}</strong></div>
            <div class="stat-box"><span>High</span><strong>${reportStats.priorityCounts.high}</strong></div>
            <div class="stat-box"><span>Emergency</span><strong>${reportStats.priorityCounts.emergency}</strong></div>
          </div>

          <h2>Ticket Details (${reportTickets.length} tickets)</h2>
          <table>
            <thead>
              <tr><th>ID</th><th>Title</th><th>Block</th><th>Room</th><th>Priority</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              ${reportTickets.map((t) => `
                <tr>
                  <td>${t.ticketId}</td>
                  <td>${t.title}</td>
                  <td>${t.hostelBlock}</td>
                  <td>${t.roomNumber}</td>
                  <td>${t.priority}</td>
                  <td>${t.status}</td>
                  <td>${new Date(t.createdAt).toLocaleDateString('en-LK')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>This report was generated by the STAY & GO Hostel Maintenance Management System.</p>
            <p>Sarah M.D. (IT23219052) — SLIIT BSc (Hons) IT</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  // ---- RESET FILTERS ----
  function handleReset() {
    setDateFrom('')
    setDateTo('')
    setFilterBlock('')
    setFilterPriority('')
    setFilterStatus('')
    setIsGenerated(false)
    setError('')
  }

  // ---- FORMAT DATE ----
  function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-LK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // ---- STATUS LABELS ----
  const statusLabels = {
    submitted: 'Submitted',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    rejected: 'Rejected',
  }

  return (
    <section className="maint-section">
      {/* Page header */}
      <div className="maint-section-header">
        <p className="eyebrow">Reports</p>
        <h2>Download maintenance reports</h2>
        <p>Generate summary reports based on date range and filters. Download as PDF for record keeping.</p>
      </div>

      {/* ---- REPORT FILTERS ---- */}
      <div className="detail-card">
        <h3 style={{ margin: '0 0 18px', fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem' }}>
          Report Filters
        </h3>

        <div className="report-filters">
          {/* Date range */}
          <div className="form-group">
            <label className="form-label">From Date</label>
            <input
              type="date"
              className="form-input"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">To Date</label>
            <input
              type="date"
              className="form-input"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          {/* Hostel block filter */}
          <div className="form-group">
            <label className="form-label">Hostel Block</label>
            <select
              className="form-select"
              value={filterBlock}
              onChange={(e) => setFilterBlock(e.target.value)}
            >
              <option value="">All Blocks</option>
              {['A', 'B', 'C', 'D', 'E', 'F'].map((b) => (
                <option key={b} value={b}>Block {b}</option>
              ))}
            </select>
          </div>

          {/* Priority filter */}
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="form-error" style={{ marginTop: '12px' }}>{error}</p>
        )}

        {/* Action buttons */}
        <div className="form-actions" style={{ marginTop: '18px' }}>
          <button type="button" className="button button-dark" onClick={handleGenerate}>
            Generate Report
          </button>
          <button type="button" className="button button-outline" onClick={handleReset}>
            Reset Filters
          </button>
        </div>
      </div>

      {/* ---- REPORT PREVIEW ---- */}
      {isGenerated && (
        <div className="detail-card" id="report-preview" style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px', fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem' }}>
                Report Preview
              </h3>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#5b645f' }}>
                Generated: {new Date().toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' })}
                {dateFrom && ` | From: ${dateFrom}`}
                {dateTo && ` | To: ${dateTo}`}
                {filterBlock && ` | Block ${filterBlock}`}
                {filterPriority && ` | ${filterPriority}`}
                {filterStatus && ` | ${statusLabels[filterStatus]}`}
              </p>
            </div>

            {/* Download button */}
            <button type="button" className="button button-dark" onClick={handleDownload}>
              Download PDF
            </button>
          </div>

          {/* Summary stats */}
          <div className="report-summary">
            <div className="report-stat">
              <span>Total Tickets</span>
              <strong>{reportStats.total}</strong>
            </div>
            <div className="report-stat">
              <span>Resolved / Closed</span>
              <strong>{reportStats.resolved}</strong>
            </div>
            <div className="report-stat">
              <span>Pending</span>
              <strong>{reportStats.pending}</strong>
            </div>
            <div className="report-stat">
              <span>Rejected</span>
              <strong>{reportStats.rejected}</strong>
            </div>
            <div className="report-stat">
              <span>Avg Rating</span>
              <strong>{reportStats.avgRating}</strong>
            </div>
            <div className="report-stat">
              <span>Resolution Rate</span>
              <strong>
                {reportStats.total > 0
                  ? ((reportStats.resolved / reportStats.total) * 100).toFixed(1) + '%'
                  : '0%'
                }
              </strong>
            </div>
          </div>

          {/* Priority breakdown */}
          <h4 style={{ margin: '24px 0 12px', fontFamily: "'Space Grotesk', sans-serif" }}>
            Priority Breakdown
          </h4>
          <div className="status-counts">
            <div className="status-count-item">
              <span>Low:</span> <strong>{reportStats.priorityCounts.low}</strong>
            </div>
            <div className="status-count-item">
              <span>Medium:</span> <strong>{reportStats.priorityCounts.medium}</strong>
            </div>
            <div className="status-count-item">
              <span>High:</span> <strong>{reportStats.priorityCounts.high}</strong>
            </div>
            <div className="status-count-item">
              <span>Emergency:</span> <strong>{reportStats.priorityCounts.emergency}</strong>
            </div>
          </div>

          {/* Ticket list table */}
          <h4 style={{ margin: '24px 0 12px', fontFamily: "'Space Grotesk', sans-serif" }}>
            Tickets ({reportTickets.length})
          </h4>

          {reportTickets.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="perf-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Title</th>
                    <th>Block</th>
                    <th>Room</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportTickets.map((t) => (
                    <tr key={t._id}>
                      <td style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#876DFF' }}>
                        {t.ticketId}
                      </td>
                      <td>{t.title}</td>
                      <td>Block {t.hostelBlock}</td>
                      <td>{t.roomNumber}</td>
                      <td style={{ textTransform: 'capitalize' }}>{t.priority}</td>
                      <td>{statusLabels[t.status] || t.status}</td>
                      <td>{formatDate(t.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">📄</span>
              <h3>No tickets match the selected filters</h3>
              <p>Try adjusting the date range or filters to include more tickets.</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default DownloadReports
