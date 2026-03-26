import { useMemo } from 'react'
import RatingStars from './RatingStars'

// ============================================
// MaintenanceAnalytics component
// Admin dashboard showing maintenance performance statistics
// Includes:
//   1. KPI cards (total tickets, open tickets, avg resolution time, avg rating)
//   2. Priority breakdown donut chart
//   3. Tickets by status bar chart
//   4. Tickets by hostel block bar chart
//   5. Technician performance table
// All data is calculated from the tickets array passed as props
// ============================================

function MaintenanceAnalytics({ tickets }) {
  // ---- CALCULATE KPI DATA ----
  const kpiData = useMemo(() => {
    // Total tickets count
    const total = tickets.length

    // Open tickets - not closed or rejected
    const open = tickets.filter((t) =>
      t.status !== 'closed' && t.status !== 'rejected'
    ).length

    // Calculate average resolution time in hours
    // Only for tickets that have been resolved or closed
    const resolvedTickets = tickets.filter((t) =>
      t.status === 'resolved' || t.status === 'closed'
    )
    let avgResolutionHours = 0
    if (resolvedTickets.length > 0) {
      const totalHours = resolvedTickets.reduce((sum, t) => {
        // Find when ticket was submitted and when it was resolved
        const submitted = t.statusHistory.find((h) => h.status === 'submitted')
        const resolved = t.statusHistory.find((h) => h.status === 'resolved')
        if (submitted && resolved) {
          const diff = new Date(resolved.changedAt) - new Date(submitted.changedAt)
          return sum + (diff / (1000 * 60 * 60)) // Convert milliseconds to hours
        }
        return sum
      }, 0)
      avgResolutionHours = (totalHours / resolvedTickets.length).toFixed(1)
    }

    // Calculate average student rating
    const ratedTickets = tickets.filter((t) => t.rating !== null)
    let avgRating = 0
    if (ratedTickets.length > 0) {
      avgRating = (ratedTickets.reduce((sum, t) => sum + t.rating, 0) / ratedTickets.length).toFixed(1)
    }

    return { total, open, avgResolutionHours, avgRating, ratedCount: ratedTickets.length }
  }, [tickets])

  // ---- CALCULATE PRIORITY BREAKDOWN ----
  // Count tickets by priority level for the donut chart
  const priorityData = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0, emergency: 0 }
    tickets.forEach((t) => {
      if (counts[t.priority] !== undefined) {
        counts[t.priority]++
      }
    })
    return counts
  }, [tickets])

  // ---- CALCULATE STATUS BREAKDOWN ----
  // Count tickets by status for the horizontal bar chart
  const statusData = useMemo(() => {
    const counts = {
      submitted: 0, assigned: 0, in_progress: 0,
      resolved: 0, closed: 0, rejected: 0
    }
    tickets.forEach((t) => {
      if (counts[t.status] !== undefined) {
        counts[t.status]++
      }
    })
    return counts
  }, [tickets])

  // ---- CALCULATE HOSTEL BLOCK BREAKDOWN ----
  // Count tickets by hostel block for bar chart
  const blockData = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 }
    tickets.forEach((t) => {
      if (counts[t.hostelBlock] !== undefined) {
        counts[t.hostelBlock]++
      }
    })
    return counts
  }, [tickets])

  // ---- CALCULATE TECHNICIAN PERFORMANCE ----
  // Build a table showing each technician's stats
  const technicianData = useMemo(() => {
    const techMap = {}

    tickets.forEach((t) => {
      // Only count tickets that have been assigned to someone
      if (!t.assignedTo) return

      const techId = t.assignedTo.id || t.assignedTo._id
      const techName = t.assignedTo.name || 'Unknown'

      // Create entry for this technician if not exists
      if (!techMap[techId]) {
        techMap[techId] = {
          name: techName,
          assigned: 0,
          resolved: 0,
          totalRating: 0,
          ratedCount: 0,
        }
      }

      // Count assigned tickets
      techMap[techId].assigned++

      // Count resolved/closed tickets
      if (t.status === 'resolved' || t.status === 'closed') {
        techMap[techId].resolved++
      }

      // Sum up ratings
      if (t.rating) {
        techMap[techId].totalRating += t.rating
        techMap[techId].ratedCount++
      }
    })

    // Convert map to array and calculate averages
    return Object.values(techMap).map((tech) => ({
      ...tech,
      avgRating: tech.ratedCount > 0
        ? (tech.totalRating / tech.ratedCount).toFixed(1)
        : 'N/A',
    })).sort((a, b) => b.resolved - a.resolved) // Sort by most resolved
  }, [tickets])

  // ---- DONUT CHART COLORS ----
  const priorityColors = {
    low: '#BAF91A',
    medium: '#f59e0b',
    high: '#ff7f00',
    emergency: '#dc3545',
  }

  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    emergency: 'Emergency',
  }

  // ---- STATUS LABELS AND COLORS ----
  const statusLabels = {
    submitted: 'Submitted',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    rejected: 'Rejected',
  }

  const statusColors = {
    submitted: 'rgba(16, 19, 18, 0.2)',
    assigned: '#876DFF',
    in_progress: '#BAF91A',
    resolved: '#E2FF99',
    closed: 'rgba(16, 19, 18, 0.12)',
    rejected: '#dc3545',
  }

  // ---- CALCULATE DONUT CHART ----
  // Build the conic-gradient CSS for the donut chart
  function buildDonutGradient() {
    const total = tickets.length || 1
    const segments = []
    let currentPercent = 0

    Object.entries(priorityData).forEach(([key, count]) => {
      const percent = (count / total) * 100
      segments.push(`${priorityColors[key]} ${currentPercent}% ${currentPercent + percent}%`)
      currentPercent += percent
    })

    return `conic-gradient(${segments.join(', ')})`
  }

  // ---- FIND MAX VALUE FOR BAR CHART SCALING ----
  function getMaxValue(data) {
    const values = Object.values(data)
    return Math.max(...values, 1) // At least 1 to avoid division by zero
  }

  return (
    <section className="maint-section">
      {/* Page header */}
      <div className="maint-section-header">
        <p className="eyebrow">Analytics</p>
        <h2>Maintenance performance dashboard</h2>
        <p>Monitor ticket statistics, resolution times, and technician performance across all hostel blocks.</p>
      </div>

      {/* ---- KPI CARDS ---- */}
      <div className="analytics-kpi-grid">
        <div className="kpi-item">
          <span>Total Tickets</span>
          <strong>{kpiData.total}</strong>
          <small>All time</small>
        </div>
        <div className="kpi-item">
          <span>Open Tickets</span>
          <strong>{kpiData.open}</strong>
          <small>Need attention</small>
        </div>
        <div className="kpi-item">
          <span>Avg Resolution</span>
          <strong>{kpiData.avgResolutionHours}h</strong>
          <small>Hours to resolve</small>
        </div>
        <div className="kpi-item">
          <span>Satisfaction</span>
          <strong>{kpiData.avgRating > 0 ? `${kpiData.avgRating}/5` : 'N/A'}</strong>
          <small>{kpiData.ratedCount} ratings</small>
        </div>
      </div>

      {/* ---- CHARTS GRID ---- */}
      <div className="analytics-charts-grid">
        {/* Priority Breakdown - Donut Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <p className="panel-label" style={{ margin: 0 }}>Ticket priority breakdown</p>
              <h3>Service queue balance</h3>
            </div>
            <span className="chart-badge">Donut</span>
          </div>

          <div className="simple-donut">
            {/* Donut visual */}
            <div
              className="donut-visual"
              style={{ background: buildDonutGradient() }}
            >
              <div className="donut-inner">
                <strong>{tickets.length}</strong>
                <span>Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="donut-legend">
              {Object.entries(priorityData).map(([key, count]) => (
                <div className="legend-item" key={key}>
                  <span
                    className="legend-dot"
                    style={{ background: priorityColors[key] }}
                  />
                  <span className="legend-text">{priorityLabels[key]}</span>
                  <span className="legend-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tickets by Status - Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <p className="panel-label" style={{ margin: 0 }}>Tickets by status</p>
              <h3>Workflow distribution</h3>
            </div>
            <span className="chart-badge">Bar</span>
          </div>

          <div className="simple-bar-chart">
            {Object.entries(statusData).map(([key, count]) => {
              const maxVal = getMaxValue(statusData)
              const heightPercent = (count / maxVal) * 100
              return (
                <div className="simple-bar-item" key={key}>
                  <span className="simple-bar-value">{count}</span>
                  <div
                    className="simple-bar"
                    style={{
                      height: `${Math.max(heightPercent, 3)}%`,
                      background: statusColors[key],
                    }}
                  />
                  <span className="simple-bar-label">{statusLabels[key]}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tickets by Hostel Block - Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <p className="panel-label" style={{ margin: 0 }}>Tickets by hostel block</p>
              <h3>Block-wise demand</h3>
            </div>
            <span className="chart-badge">Bar</span>
          </div>

          <div className="simple-bar-chart">
            {Object.entries(blockData).map(([block, count]) => {
              const maxVal = getMaxValue(blockData)
              const heightPercent = (count / maxVal) * 100
              return (
                <div className="simple-bar-item" key={block}>
                  <span className="simple-bar-value">{count}</span>
                  <div
                    className="simple-bar"
                    style={{
                      height: `${Math.max(heightPercent, 3)}%`,
                      background: 'linear-gradient(180deg, #876DFF, #a78bff)',
                    }}
                  />
                  <span className="simple-bar-label">Block {block}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Technician Performance Table */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <p className="panel-label" style={{ margin: 0 }}>Technician performance</p>
              <h3>Staff efficiency overview</h3>
            </div>
            <span className="chart-badge">Table</span>
          </div>

          {technicianData.length > 0 ? (
            <table className="perf-table">
              <thead>
                <tr>
                  <th>Technician</th>
                  <th>Assigned</th>
                  <th>Resolved</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {technicianData.map((tech, index) => (
                  <tr key={index}>
                    <td>{tech.name}</td>
                    <td>{tech.assigned}</td>
                    <td>{tech.resolved}</td>
                    <td>
                      {tech.avgRating !== 'N/A' ? (
                        <RatingStars rating={Number(tech.avgRating)} readOnly={true} />
                      ) : (
                        <span style={{ color: '#5b645f', fontSize: '0.88rem' }}>No ratings</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{
              padding: '32px',
              textAlign: 'center',
              color: '#5b645f',
              fontSize: '0.92rem',
            }}>
              No technician data available yet
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default MaintenanceAnalytics
