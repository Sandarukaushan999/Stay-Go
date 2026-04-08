const Announcement = require('../models/Announcement');

// ============================================
// MAINTENANCE ANNOUNCEMENT CONTROLLER
// All controller functions for announcements
// Uses team's auth pattern: req.user is the full User object
// ============================================

// ============================================
// CREATE: Admin creates a new announcement
// ============================================
async function createAnnouncement(req, res) {
  const { title, content, priority } = req.body;

  const announcement = await Announcement.create({
    title,
    content,
    priority: priority || 'normal',
    createdBy: req.user._id,
  });

  return res.status(201).json({
    message: 'Announcement created successfully!',
    announcement,
  });
}

// ============================================
// READ: Get all active announcements
// All authenticated users can view active announcements
// ============================================
async function getActiveAnnouncements(req, res) {
  const announcements = await Announcement.find({ isActive: true })
    .populate('createdBy', 'name role')
    .sort({ createdAt: -1 });

  return res.json(announcements);
}

// ============================================
// READ: Get all announcements (Admin only)
// Includes inactive/hidden ones
// ============================================
async function getAllAnnouncements(req, res) {
  const announcements = await Announcement.find()
    .populate('createdBy', 'name role')
    .sort({ createdAt: -1 });

  return res.json(announcements);
}

// ============================================
// UPDATE: Admin edits an existing announcement
// ============================================
async function updateAnnouncement(req, res) {
  const { title, content, priority } = req.body;

  const announcement = await Announcement.findByIdAndUpdate(
    req.params.id,
    { title, content, priority },
    { new: true, runValidators: true }
  );

  if (!announcement) {
    return res.status(404).json({ message: 'Announcement not found' });
  }

  return res.json({ message: 'Announcement updated!', announcement });
}

// ============================================
// DELETE: Admin deletes an announcement permanently
// ============================================
async function deleteAnnouncement(req, res) {
  const announcement = await Announcement.findByIdAndDelete(req.params.id);

  if (!announcement) {
    return res.status(404).json({ message: 'Announcement not found' });
  }

  return res.json({ message: 'Announcement deleted successfully' });
}

// ============================================
// TOGGLE: Admin hides or shows an announcement
// Flips the isActive value (instead of deleting)
// ============================================
async function toggleAnnouncement(req, res) {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return res.status(404).json({ message: 'Announcement not found' });
  }

  announcement.isActive = !announcement.isActive;
  await announcement.save();

  const statusText = announcement.isActive ? 'activated' : 'deactivated';
  return res.json({ message: `Announcement ${statusText}!`, announcement });
}

module.exports = {
  createAnnouncement,
  getActiveAnnouncements,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncement,
};
