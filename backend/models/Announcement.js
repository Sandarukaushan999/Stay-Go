const mongoose = require('mongoose');

// This is the schema for admin announcements
// Admins can post announcements about maintenance schedules,
// water cuts, power outages, or any hostel related updates
// Students and technicians can view active announcements

const announcementSchema = new mongoose.Schema({
  // Title of the announcement (e.g., "Water supply maintenance on Block A")
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },

  // Full content/body of the announcement
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [20, 'Content must be at least 20 characters'],
    maxlength: [500, 'Content cannot exceed 500 characters']
  },

  // How important is this announcement
  // urgent = red styling, important = yellow, normal = default
  priority: {
    type: String,
    enum: ['normal', 'important', 'urgent'],
    default: 'normal'
  },

  // Admin can hide announcements without deleting them
  isActive: {
    type: Boolean,
    default: true
  },

  // Which admin created this announcement
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, {
  // Automatically add createdAt and updatedAt fields
  timestamps: true
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
