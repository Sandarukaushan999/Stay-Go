const mongoose = require('mongoose');

// This is the schema for maintenance tickets
// Each ticket represents a complaint or issue reported by a student
// The ticket goes through different stages: submitted -> assigned -> in_progress -> resolved -> closed

// This sub-schema tracks every status change of the ticket
// So we can show a timeline of what happened and when
const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  changedAt: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  }
});

// Main ticket schema - defines what data each ticket stores
const ticketSchema = new mongoose.Schema({
  // Unique ticket ID like "MT-20260325-001" for easy reference
  ticketId: {
    type: String,
    unique: true,
    required: true
  },

  // Short title describing the issue (e.g., "Broken tap in bathroom")
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },

  // Category of the issue - helps admin sort and assign the right technician
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['plumbing', 'electrical', 'furniture', 'cleaning', 'network', 'other']
  },

  // How urgent is this issue - emergency gets handled first
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['low', 'medium', 'high', 'emergency']
  },

  // Which hostel block the issue is in
  hostelBlock: {
    type: String,
    required: [true, 'Hostel block is required'],
    enum: ['A', 'B', 'C', 'D', 'E', 'F']
  },

  // Room number where the issue is located
  roomNumber: {
    type: String,
    required: [true, 'Room number is required']
  },

  // Detailed description of what the problem is
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  // File paths for photos of the issue (optional, max 3)
  attachments: [{
    type: String
  }],

  // Current status of the ticket - changes as it moves through the workflow
  status: {
    type: String,
    enum: ['submitted', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected'],
    default: 'submitted'
  },

  // Which student submitted this ticket (reference to User model)
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Which technician is assigned to fix this issue (set by admin)
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // If admin rejects the ticket, they must give a reason
  rejectionReason: {
    type: String,
    default: null
  },

  // When technician resolves, they write what they did to fix it
  resolutionNote: {
    type: String,
    default: null
  },

  // Student rates the service after issue is resolved (1 to 5 stars)
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },

  // Optional feedback text from student along with the rating
  ratingFeedback: {
    type: String,
    maxlength: [200, 'Feedback cannot exceed 200 characters'],
    default: null
  },

  // Array that stores every status change - used to show the timeline
  statusHistory: [statusHistorySchema]

}, {
  // Automatically add createdAt and updatedAt fields
  timestamps: true
});

// Create the model from the schema
const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
