// TicketFilters component - filter bar for ticket lists
// Lets users filter tickets by status, priority, category, and search text
// Used in MyTickets (student), TechnicianTasks, and AdminTickets screens

function TicketFilters({ filters, onFilterChange, showCategory = true, showSearch = false }) {
  // Handle when user changes any filter dropdown or search input
  function handleChange(filterName, value) {
    onFilterChange({ ...filters, [filterName]: value })
  }

  return (
    <div className="ticket-filters">
      {/* Status filter dropdown */}
      <div className="filter-group">
        <label className="filter-label">Status</label>
        <select
          className="filter-select"
          value={filters.status || ''}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Priority filter dropdown */}
      <div className="filter-group">
        <label className="filter-label">Priority</label>
        <select
          className="filter-select"
          value={filters.priority || ''}
          onChange={(e) => handleChange('priority', e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>

      {/* Category filter dropdown - only shown when showCategory is true */}
      {showCategory && (
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            className="filter-select"
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="furniture">Furniture</option>
            <option value="cleaning">Cleaning</option>
            <option value="network">Network</option>
            <option value="other">Other</option>
          </select>
        </div>
      )}

      {/* Search input - only shown when showSearch is true */}
      {showSearch && (
        <div className="filter-group filter-group-search">
          <label className="filter-label">Search</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Search by ID, title, or room..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>
      )}

      {/* Clear all filters button */}
      <button
        type="button"
        className="filter-clear-btn"
        onClick={() => onFilterChange({ status: '', priority: '', category: '', search: '' })}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default TicketFilters
