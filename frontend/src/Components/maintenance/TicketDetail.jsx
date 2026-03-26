import { useState } from 'react'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import TicketTimeline from './TicketTimeline'
import RatingStars from './RatingStars'

// ============================================
// TicketDetail component
// Shows the full details of a single maintenance ticket
// Left side: ticket info, description, and rating section
// Right side: status timeline and assigned technician info
// Students can rate resolved tickets here (which closes the ticket)
// ============================================

function TicketDetail({ ticket, currentUser, onRate, onBack }) {
  // ---- RATING STATE ----
  // Store the rating value (1-5) and optional feedback text
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [ratingError, setRatingError] = useState('')
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false)

  // If no ticket is provided, show a message
  if (!ticket) {
    return (
      <section className="maint-section">
        <div className="empty-state">
          <span className="empty-state-icon">❌</span>
          <h3>Ticket not found</h3>
          <p>The ticket you are looking for does not exist or has been removed.</p>
          <button type="button" className="button button-outline" onClick={onBack}>
            Go Back
          </button>
        </div>
      </section>
    )
  }

  // ---- HELPER FUNCTIONS ----

  // Format date to readable format like "25 Mar 2026, 10:30 AM"
  function formatDate(dateString) {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-LK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Map category values to readable labels
  const categoryLabels = {
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    furniture: 'Furniture',
    cleaning: 'Cleaning',
    network: 'Network / WiFi',
    other: 'Other',
  }

  // Check if the current user can rate this ticket
  // Only the student who submitted the ticket can rate it, and only when status is "resolved"
  const canRate = ticket.status === 'resolved'
    && currentUser
    && currentUser.role === 'student'
    && ticket.submittedBy
    && (currentUser.id || currentUser._id) === (ticket.submittedBy.id || ticket.submittedBy._id)
    && !isRatingSubmitted

  // ---- HANDLE RATING SUBMISSION ----
  function handleRateSubmit() {
    // Validate rating - must select at least 1 star
    if (rating === 0) {
      setRatingError('Please select a rating (1-5 stars)')
      return
    }

    // Validate feedback length if provided
    if (feedback.length > 200) {
      setRatingError('Feedback cannot exceed 200 characters')
      return
    }

    // Clear any errors
    setRatingError('')

    // Call parent function to save the rating and close the ticket
    onRate(ticket._id, rating, feedback.trim() || null)
    setIsRatingSubmitted(true)
  }

  return (
    <div>
      {/* Back button to return to ticket list */}
      <button type="button" className="back-btn" onClick={onBack}>
        ← Back to list
      </button>

      <div className="ticket-detail-layout" style={{ marginTop: '18px' }}>
        {/* ---- LEFT COLUMN: Ticket Information ---- */}
        <div className="ticket-detail-main">
          {/* Main ticket info card */}
          <div className="detail-card">
            {/* Header with ticket ID and badges */}
            <div className="detail-header">
              <div>
                <span className="ticket-id" style={{ fontSize: '1rem' }}>{ticket.ticketId}</span>
                <h2 style={{ margin: '8px 0 0', fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', lineHeight: 1.2 }}>
                  {ticket.title}
                </h2>
              </div>
              <div className="detail-badges">
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
            </div>

            {/* Info grid - category, block, room, date */}
            <div className="detail-info-grid">
              <div className="detail-info-item">
                <span className="detail-info-label">Category</span>
                <span className="detail-info-value">{categoryLabels[ticket.category] || ticket.category}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Hostel Block</span>
                <span className="detail-info-value">Block {ticket.hostelBlock}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Room Number</span>
                <span className="detail-info-value">{ticket.roomNumber}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Submitted On</span>
                <span className="detail-info-value">{formatDate(ticket.createdAt)}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="detail-info-label" style={{ display: 'block', marginTop: '20px' }}>Description</span>
              <div className="detail-description">
                {ticket.description}
              </div>
            </div>

            {/* Submitted by info */}
            {ticket.submittedBy && (
              <div style={{ marginTop: '18px' }}>
                <span className="detail-info-label">Submitted By</span>
                <p style={{ margin: '4px 0 0', fontWeight: 600 }}>
                  {ticket.submittedBy.name}
                  {ticket.submittedBy.email && (
                    <span style={{ fontWeight: 400, color: '#5b645f', marginLeft: '8px' }}>
                      ({ticket.submittedBy.email})
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Rejection reason card - only show if ticket was rejected */}
          {ticket.status === 'rejected' && ticket.rejectionReason && (
            <div className="detail-card" style={{ borderLeft: '4px solid #dc3545', background: 'rgba(220, 53, 69, 0.03)' }}>
              <span className="detail-info-label">Rejection Reason</span>
              <p style={{ margin: '8px 0 0', lineHeight: 1.6 }}>{ticket.rejectionReason}</p>
            </div>
          )}

          {/* Resolution note card - only show if ticket was resolved */}
          {ticket.resolutionNote && (
            <div className="detail-card" style={{ borderLeft: '4px solid #BAF91A', background: 'rgba(186, 249, 26, 0.04)' }}>
              <span className="detail-info-label">Resolution Note</span>
              <p style={{ margin: '8px 0 0', lineHeight: 1.6 }}>{ticket.resolutionNote}</p>
            </div>
          )}

          {/* Rating display - show if ticket is already rated */}
          {ticket.rating && (
            <div className="detail-card" style={{ borderLeft: '4px solid #f59e0b', background: 'rgba(245, 158, 11, 0.04)' }}>
              <span className="detail-info-label">Student Rating</span>
              <div style={{ marginTop: '10px' }}>
                <RatingStars rating={ticket.rating} readOnly={true} />
              </div>
              {ticket.ratingFeedback && (
                <p style={{ margin: '10px 0 0', fontStyle: 'italic', color: '#5b645f' }}>
                  "{ticket.ratingFeedback}"
                </p>
              )}
            </div>
          )}

          {/* Rating section - only show for students when ticket is resolved */}
          {canRate && (
            <div className="detail-card">
              <div className="rating-section">
                <h3>Rate this service</h3>
                <p style={{ margin: '0 0 14px', fontSize: '0.9rem', color: '#5b645f' }}>
                  How satisfied are you with the maintenance service? Your feedback helps us improve.
                </p>

                {/* Star rating input */}
                <RatingStars rating={rating} onRate={setRating} readOnly={false} />

                {/* Optional feedback text */}
                <textarea
                  className="rating-feedback-input"
                  placeholder="Optional: Share your experience (max 200 characters)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  maxLength={200}
                />
                <span className="form-hint">{feedback.length}/200 characters</span>

                {/* Error message */}
                {ratingError && <span className="form-error">{ratingError}</span>}

                {/* Submit rating button */}
                <div className="form-actions" style={{ marginTop: '14px' }}>
                  <button type="button" className="button button-dark" onClick={handleRateSubmit}>
                    Submit Rating & Close Ticket
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rating success message */}
          {isRatingSubmitted && (
            <div className="detail-card" style={{ borderLeft: '4px solid #BAF91A', background: 'rgba(186, 249, 26, 0.04)' }}>
              <div className="empty-state" style={{ padding: '16px 0' }}>
                <span className="empty-state-icon">🎉</span>
                <h3>Thank you for your feedback!</h3>
                <p>Your rating has been submitted and the ticket is now closed.</p>
              </div>
            </div>
          )}
        </div>

        {/* ---- RIGHT COLUMN: Timeline & Technician Info ---- */}
        <div className="ticket-detail-sidebar">
          {/* Assigned technician card */}
          <div className="detail-card detail-card-dark">
            <p className="eyebrow">Assigned Technician</p>
            {ticket.assignedTo ? (
              <div style={{ marginTop: '12px' }}>
                <h3 style={{ margin: '0 0 6px' }}>{ticket.assignedTo.name}</h3>
                {ticket.assignedTo.email && (
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{ticket.assignedTo.email}</p>
                )}
              </div>
            ) : (
              <div style={{ marginTop: '12px' }}>
                <h3 style={{ margin: '0 0 6px', opacity: 0.6 }}>Not assigned yet</h3>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>
                  An admin will assign a technician to your ticket soon.
                </p>
              </div>
            )}
          </div>

          {/* Status timeline card */}
          <div className="detail-card">
            <span className="detail-info-label">Status Timeline</span>
            <div style={{ marginTop: '14px' }}>
              <TicketTimeline statusHistory={ticket.statusHistory} />
            </div>
          </div>

          {/* Quick info card */}
          <div className="detail-card">
            <span className="detail-info-label">Quick Info</span>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#5b645f' }}>Status</span>
                <StatusBadge status={ticket.status} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#5b645f' }}>Priority</span>
                <PriorityBadge priority={ticket.priority} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#5b645f' }}>Category</span>
                <span style={{ fontWeight: 600 }}>{categoryLabels[ticket.category]}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#5b645f' }}>Location</span>
                <span style={{ fontWeight: 600 }}>Block {ticket.hostelBlock}, Room {ticket.roomNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetail
