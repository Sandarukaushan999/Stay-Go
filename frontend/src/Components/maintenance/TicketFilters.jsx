// TicketFilters component - REDESIGNED compact inline filter bar
// All filters + sort + result count in one clean row
// Used in MyTickets (student), TechnicianTasks, and AdminTickets screens

function TicketFilters({
  filters,
  onFilterChange,
  showCategory = true,
  showSearch = false,
  sortBy,
  onSortChange,
  resultCount,
  totalCount,
}) {
  // Handle when user changes any filter dropdown or search input
  function handleChange(filterName, value) {
    onFilterChange({ ...filters, [filterName]: value })
  }

  return (
    <div className="ticket-filters">
      {/* Label */}
      <span className="filter-label-tag">Filters</span>

      {/* Status filter */}
      <select
        className="filter-select"
        value={filters.status || ''}
        onChange={(e) => handleChange('status', e.target.value)}
        aria-label="Filter by status"
      >
        <option value="">All Status</option>
        <option value="submitted">Submitted</option>
        <option value="assigned">Assigned</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
        <option value="rejected">Rejected</option>
      </select>

      {/* Priority filter */}
      <select
        className="filter-select"
        value={filters.priority || ''}
        onChange={(e) => handleChange('priority', e.target.value)}
        aria-label="Filter by priority"
      >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="emergency">Emergency</option>
      </select>

      {/* Category filter - only shown when needed */}
      {showCategory && (
        <select
          className="filter-select"
          value={filters.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          <option value="plumbing">🔧 Plumbing</option>
          <option value="electrical">⚡ Electrical</option>
          <option value="furniture">🪑 Furniture</option>
          <option value="cleaning">🧹 Cleaning</option>
          <option value="network">🌐 Network</option>
          <option value="other">📋 Other</option>
        </select>
      )}

      {/* Sort dropdown - only shown when provided */}
      {onSortChange && (
        <select
          className="filter-select"
          value={sortBy || 'newest'}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort by"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">Priority (Highest)</option>
        </select>
      )}

      {/* Search input - only shown when needed */}
      {showSearch && (
        <input
          type="text"
          className="filter-input"
          placeholder="Search ID, title, or room..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          aria-label="Search tickets"
        />
      )}

      {/* Result count - pushed to the right */}
      {totalCount !== undefined && (
        <span className="filter-result-count">
          {resultCount} of {totalCount} tickets
        </span>
      )}

      {/* Clear all filters button */}
      <button
        type="button"
        className="filter-clear-btn"
        onClick={() => onFilterChange({ status: '', priority: '', category: '', search: '' })}
      >
        Clear
      </button>
    </div>
  )
}

export default TicketFilters
