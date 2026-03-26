import { useState, useRef } from 'react'

// ============================================
// SubmitComplaint component
// Students use this form to report maintenance issues in the hostel
// The form has full validation - all required fields must be filled correctly
// After successful submission, a unique ticket ID is generated
// ============================================

function SubmitComplaint({ onSubmit }) {
  // ---- FORM STATE ----
  // Store each form field value in state
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [hostelBlock, setHostelBlock] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])

  // Store validation errors for each field
  const [errors, setErrors] = useState({})

  // Track if form was submitted successfully
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Reference to the hidden file input element
  const fileInputRef = useRef(null)

  // ---- CATEGORY OPTIONS ----
  // List of maintenance issue categories for the dropdown
  const categoryOptions = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'network', label: 'Network / WiFi' },
    { value: 'other', label: 'Other' },
  ]

  // ---- HOSTEL BLOCK OPTIONS ----
  const blockOptions = ['A', 'B', 'C', 'D', 'E', 'F']

  // ---- PRIORITY OPTIONS ----
  const priorityOptions = [
    { value: 'low', label: 'Low', desc: 'Not urgent, can wait' },
    { value: 'medium', label: 'Medium', desc: 'Should be fixed soon' },
    { value: 'high', label: 'High', desc: 'Needs quick attention' },
    { value: 'emergency', label: 'Emergency', desc: 'Immediate action needed' },
  ]

  // ---- VALIDATION FUNCTION ----
  // Check all form fields and return error messages for invalid ones
  function validateForm() {
    const newErrors = {}

    // Title validation - must be between 5 and 100 characters
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters'
    }

    // Category validation - must select one
    if (!category) {
      newErrors.category = 'Please select a category'
    }

    // Priority validation - must select one
    if (!priority) {
      newErrors.priority = 'Please select a priority level'
    }

    // Hostel block validation - must select one
    if (!hostelBlock) {
      newErrors.hostelBlock = 'Please select your hostel block'
    }

    // Room number validation - must be 3 or 4 digits
    if (!roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required'
    } else if (!/^\d{3,4}$/.test(roomNumber.trim())) {
      newErrors.roomNumber = 'Room number must be 3 or 4 digits (e.g., 101, 1204)'
    }

    // Description validation - must be between 20 and 500 characters
    if (!description.trim()) {
      newErrors.description = 'Description is required'
    } else if (description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    } else if (description.trim().length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters'
    }

    // File validation - max 3 files, only JPG/PNG, max 5MB each
    if (files.length > 3) {
      newErrors.files = 'Maximum 3 files allowed'
    }

    return newErrors
  }

  // ---- HANDLE FILE SELECTION ----
  // When user selects files, validate and add them to the list
  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files)
    const validFiles = []
    const fileErrors = []

    selectedFiles.forEach((file) => {
      // Check file type - only allow JPG and PNG
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
      if (!isValidType) {
        fileErrors.push(`${file.name}: Only JPG and PNG files are allowed`)
        return
      }

      // Check file size - max 5MB
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        fileErrors.push(`${file.name}: File size must be under 5MB`)
        return
      }

      validFiles.push(file)
    })

    // Check total file count
    if (files.length + validFiles.length > 3) {
      setErrors({ ...errors, files: 'Maximum 3 files allowed in total' })
      return
    }

    // Add valid files to the list
    if (fileErrors.length > 0) {
      setErrors({ ...errors, files: fileErrors.join('. ') })
    } else {
      setErrors({ ...errors, files: null })
    }

    setFiles([...files, ...validFiles])

    // Reset file input so same file can be selected again
    e.target.value = ''
  }

  // Remove a file from the list
  function removeFile(index) {
    setFiles(files.filter((_, i) => i !== index))
    setErrors({ ...errors, files: null })
  }

  // ---- HANDLE FORM SUBMISSION ----
  function handleSubmit(e) {
    // Prevent page reload
    e.preventDefault()

    // Validate all fields
    const formErrors = validateForm()

    // If there are errors, show them and stop
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      // Scroll to top so user can see errors
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // All validations passed - create the ticket data
    const formData = {
      title: title.trim(),
      category,
      priority,
      hostelBlock,
      roomNumber: roomNumber.trim(),
      description: description.trim(),
    }

    // Call the parent function to save the ticket
    onSubmit(formData)

    // Show success message
    setIsSubmitted(true)
  }

  // ---- RESET FORM ----
  // Clear all fields to submit another ticket
  function handleReset() {
    setTitle('')
    setCategory('')
    setPriority('')
    setHostelBlock('')
    setRoomNumber('')
    setDescription('')
    setFiles([])
    setErrors({})
    setIsSubmitted(false)
  }

  // ---- SUCCESS SCREEN ----
  // Show this after successful submission
  if (isSubmitted) {
    return (
      <section className="maint-section">
        <div className="empty-state">
          <span className="empty-state-icon">✅</span>
          <h3>Complaint Submitted Successfully!</h3>
          <p>Your maintenance request has been submitted. You can track its progress in the "My Tickets" section.</p>
          <div className="form-actions" style={{ justifyContent: 'center', marginTop: '14px' }}>
            <button type="button" className="button button-dark" onClick={handleReset}>
              Submit Another
            </button>
          </div>
        </div>
      </section>
    )
  }

  // ---- RENDER FORM ----
  return (
    <section className="maint-section">
      {/* Page header */}
      <div className="maint-section-header">
        <p className="eyebrow">Submit a complaint</p>
        <h2>Report a maintenance issue</h2>
        <p>Fill in the details below to submit a new maintenance request. Our team will review and assign a technician as soon as possible.</p>
      </div>

      <form className="maint-form" onSubmit={handleSubmit} noValidate>
        {/* Row 1: Title (full width) */}
        <div className="form-group form-group-full">
          <label className="form-label">
            Issue Title <span className="required">*</span>
          </label>
          <input
            type="text"
            className={`form-input ${errors.title ? 'input-error' : ''}`}
            placeholder="E.g., Broken tap in bathroom, Power socket not working"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {/* Show character count to help user */}
          <span className="form-hint">{title.length}/100 characters (minimum 5)</span>
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        {/* Row 2: Category and Hostel Block */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              className={`form-select ${errors.category ? 'input-error' : ''}`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.category && <span className="form-error">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Hostel Block <span className="required">*</span>
            </label>
            <select
              className={`form-select ${errors.hostelBlock ? 'input-error' : ''}`}
              value={hostelBlock}
              onChange={(e) => setHostelBlock(e.target.value)}
            >
              <option value="">Select block</option>
              {blockOptions.map((block) => (
                <option key={block} value={block}>Block {block}</option>
              ))}
            </select>
            {errors.hostelBlock && <span className="form-error">{errors.hostelBlock}</span>}
          </div>
        </div>

        {/* Row 3: Room Number */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Room Number <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-input ${errors.roomNumber ? 'input-error' : ''}`}
              placeholder="E.g., 204, 1105"
              value={roomNumber}
              onChange={(e) => {
                // Only allow numbers to be typed
                const value = e.target.value.replace(/[^0-9]/g, '')
                setRoomNumber(value)
              }}
              maxLength={4}
            />
            {errors.roomNumber && <span className="form-error">{errors.roomNumber}</span>}
          </div>

          {/* Empty div for grid alignment */}
          <div />
        </div>

        {/* Row 4: Priority Selection */}
        <div className="form-group form-group-full">
          <label className="form-label">
            Priority Level <span className="required">*</span>
          </label>
          <div className="radio-group">
            {priorityOptions.map((opt) => (
              <div className="radio-option" key={opt.value}>
                <input
                  type="radio"
                  id={`priority-${opt.value}`}
                  name="priority"
                  value={opt.value}
                  checked={priority === opt.value}
                  onChange={(e) => setPriority(e.target.value)}
                />
                <label className="radio-label" htmlFor={`priority-${opt.value}`}>
                  {opt.label}
                  <span style={{ marginLeft: '6px', fontWeight: 400, fontSize: '0.82rem', opacity: 0.7 }}>
                    — {opt.desc}
                  </span>
                </label>
              </div>
            ))}
          </div>
          {errors.priority && <span className="form-error">{errors.priority}</span>}
        </div>

        {/* Row 5: Description */}
        <div className="form-group form-group-full">
          <label className="form-label">
            Description <span className="required">*</span>
          </label>
          <textarea
            className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            placeholder="Describe the issue in detail. What is the problem? Where exactly is it? How long has it been like this?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />
          <span className="form-hint">{description.length}/500 characters (minimum 20)</span>
          {errors.description && <span className="form-error">{errors.description}</span>}
        </div>

        {/* Row 6: File Upload */}
        <div className="form-group form-group-full">
          <label className="form-label">Attachments (optional)</label>

          {/* Clickable upload area */}
          <div
            className="file-upload-area"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="file-upload-icon">📎</span>
            <p className="file-upload-text">
              <strong>Click to upload photos</strong>
              <br />
              JPG or PNG only, max 5MB each, up to 3 files
            </p>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".jpg,.jpeg,.png"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {/* Show selected files */}
          {files.length > 0 && (
            <div className="file-preview-list">
              {files.map((file, index) => (
                <div className="file-preview-item" key={index}>
                  <span>📄 {file.name}</span>
                  <button
                    type="button"
                    className="file-remove-btn"
                    onClick={() => removeFile(index)}
                    aria-label={`Remove ${file.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {errors.files && <span className="form-error">{errors.files}</span>}
        </div>

        {/* Submit and Reset buttons */}
        <div className="form-actions">
          <button type="submit" className="button button-dark">
            Submit Complaint
          </button>
          <button type="button" className="button button-outline" onClick={handleReset}>
            Clear Form
          </button>
        </div>
      </form>
    </section>
  )
}

export default SubmitComplaint
