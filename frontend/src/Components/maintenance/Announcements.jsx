import { useState } from 'react'

// ============================================
// Announcements component
// Two views based on user role:
//   1. Admin view: Create, edit, delete, and toggle announcements
//   2. Student/Technician view: Read-only list of active announcements
// Announcements have priority levels: normal, important, urgent
// Urgent announcements show with red styling, important with yellow
// ============================================

function Announcements({ announcements, currentRole, onCreate, onUpdate, onDelete, onToggle }) {
  // ---- STATE ----
  // Form state for creating/editing announcements
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState('normal')
  const [errors, setErrors] = useState({})

  // Confirmation modal state for deleting
  const [deletingId, setDeletingId] = useState(null)

  // Check if current user is admin
  const isAdmin = currentRole === 'admin'

  // ---- FILTER ANNOUNCEMENTS ----
  // Students and technicians only see active announcements
  // Admin sees all announcements
  const visibleAnnouncements = isAdmin
    ? announcements
    : announcements.filter((a) => a.isActive)

  // ---- FORMAT DATE ----
  function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-LK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // ---- GET PRIORITY CSS CLASS ----
  function getPriorityClass(p) {
    if (p === 'urgent') return 'announcement-urgent'
    if (p === 'important') return 'announcement-important'
    return 'announcement-normal'
  }

  // ---- GET PRIORITY LABEL ----
  function getPriorityLabel(p) {
    if (p === 'urgent') return 'Urgent'
    if (p === 'important') return 'Important'
    return 'Normal'
  }

  // ---- VALIDATE FORM ----
  function validateForm() {
    const newErrors = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters'
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required'
    } else if (content.trim().length < 20) {
      newErrors.content = 'Content must be at least 20 characters'
    } else if (content.trim().length > 500) {
      newErrors.content = 'Content cannot exceed 500 characters'
    }

    return newErrors
  }

  // ---- OPEN FORM FOR NEW ANNOUNCEMENT ----
  function openCreateForm() {
    setEditingId(null)
    setTitle('')
    setContent('')
    setPriority('normal')
    setErrors({})
    setIsFormOpen(true)
  }

  // ---- OPEN FORM FOR EDITING ----
  function openEditForm(announcement) {
    setEditingId(announcement._id)
    setTitle(announcement.title)
    setContent(announcement.content)
    setPriority(announcement.priority)
    setErrors({})
    setIsFormOpen(true)
  }

  // ---- CLOSE FORM ----
  function closeForm() {
    setIsFormOpen(false)
    setEditingId(null)
    setTitle('')
    setContent('')
    setPriority('normal')
    setErrors({})
  }

  // ---- SUBMIT FORM (Create or Update) ----
  function handleSubmit(e) {
    e.preventDefault()

    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    const data = {
      title: title.trim(),
      content: content.trim(),
      priority,
    }

    if (editingId) {
      // Update existing announcement
      onUpdate(editingId, data)
    } else {
      // Create new announcement
      onCreate(data)
    }

    closeForm()
  }

  // ---- DELETE HANDLERS ----
  function handleDeleteConfirm() {
    if (deletingId) {
      onDelete(deletingId)
      setDeletingId(null)
    }
  }

  return (
    <section className="maint-section">
      {/* Page header */}
      <div className="maint-section-header">
        <p className="eyebrow">Announcements</p>
        <h2>{isAdmin ? 'Manage announcements' : 'Hostel announcements'}</h2>
        <p>
          {isAdmin
            ? 'Create, edit, and manage announcements for students and staff.'
            : 'View important announcements from the hostel administration.'
          }
        </p>
      </div>

      {/* Admin: Create new announcement button */}
      {isAdmin && !isFormOpen && (
        <button type="button" className="button button-dark" onClick={openCreateForm}>
          + Create Announcement
        </button>
      )}

      {/* ---- CREATE / EDIT FORM (Admin only) ---- */}
      {isAdmin && isFormOpen && (
        <div className="detail-card" style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontFamily: "'Space Grotesk', sans-serif" }}>
            {editingId ? 'Edit Announcement' : 'Create New Announcement'}
          </h3>

          <form className="maint-form" onSubmit={handleSubmit}>
            {/* Title input */}
            <div className="form-group">
              <label className="form-label">
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                placeholder="E.g., Scheduled water supply maintenance"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
              <span className="form-hint">{title.length}/100 characters</span>
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            {/* Content textarea */}
            <div className="form-group">
              <label className="form-label">
                Content <span className="required">*</span>
              </label>
              <textarea
                className={`form-textarea ${errors.content ? 'input-error' : ''}`}
                placeholder="Write the full announcement details here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
              />
              <span className="form-hint">{content.length}/500 characters</span>
              {errors.content && <span className="form-error">{errors.content}</span>}
            </div>

            {/* Priority selection */}
            <div className="form-group">
              <label className="form-label">Priority</label>
              <div className="radio-group">
                {['normal', 'important', 'urgent'].map((p) => (
                  <div className="radio-option" key={p}>
                    <input
                      type="radio"
                      id={`ann-priority-${p}`}
                      name="ann-priority"
                      value={p}
                      checked={priority === p}
                      onChange={(e) => setPriority(e.target.value)}
                    />
                    <label className="radio-label" htmlFor={`ann-priority-${p}`}>
                      {getPriorityLabel(p)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Form buttons */}
            <div className="form-actions">
              <button type="submit" className="button button-dark">
                {editingId ? 'Update Announcement' : 'Publish Announcement'}
              </button>
              <button type="button" className="button button-outline" onClick={closeForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---- ANNOUNCEMENT LIST ---- */}
      {visibleAnnouncements.length > 0 ? (
        <div className="announcement-list">
          {visibleAnnouncements.map((announcement) => (
            <div
              className={`announcement-card ${getPriorityClass(announcement.priority)}`}
              key={announcement._id}
            >
              <div className="announcement-header">
                <div style={{ flex: 1 }}>
                  {/* Priority badge */}
                  <span style={{
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: announcement.priority === 'urgent' ? '#c0392b'
                      : announcement.priority === 'important' ? '#8a6d00'
                      : '#5b645f',
                  }}>
                    {getPriorityLabel(announcement.priority)}
                  </span>

                  {/* Title */}
                  <h3>{announcement.title}</h3>

                  {/* Content */}
                  <p>{announcement.content}</p>

                  {/* Meta info - date and author */}
                  <div className="announcement-meta">
                    <span>Posted: {formatDate(announcement.createdAt)}</span>
                    {announcement.createdBy && (
                      <span>By: {announcement.createdBy.name || 'Admin'}</span>
                    )}
                    {/* Show inactive badge for admin */}
                    {isAdmin && !announcement.isActive && (
                      <span style={{
                        padding: '2px 10px',
                        borderRadius: '999px',
                        background: 'rgba(220, 53, 69, 0.1)',
                        color: '#c0392b',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}>
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                {/* Admin action buttons */}
                {isAdmin && (
                  <div className="announcement-admin-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn-view"
                      onClick={() => openEditForm(announcement)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-assign"
                      onClick={() => onToggle(announcement._id)}
                    >
                      {announcement.isActive ? 'Hide' : 'Show'}
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-reject"
                      onClick={() => setDeletingId(announcement._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state-icon">📢</span>
          <h3>No announcements</h3>
          <p>
            {isAdmin
              ? 'No announcements have been created yet. Click "Create Announcement" to post one.'
              : 'There are no announcements at the moment. Check back later.'
            }
          </p>
        </div>
      )}

      {/* ---- DELETE CONFIRMATION MODAL ---- */}
      {deletingId && (
        <div className="modal-overlay" onClick={() => setDeletingId(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Announcement</h3>
            <p style={{ color: '#5b645f', margin: '0 0 16px' }}>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-dark"
                style={{ background: '#c0392b' }}
                onClick={handleDeleteConfirm}
              >
                Yes, Delete
              </button>
              <button
                type="button"
                className="button button-outline"
                onClick={() => setDeletingId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Announcements
