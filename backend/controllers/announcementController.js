const Announcement = require('../models/Announcement');

// ============================================
// CREATE: Admin creates a new announcement
// Announcements are used to notify students and staff about
// maintenance schedules, water cuts, power outages, etc.
// ============================================
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, priority } = req.body;

    // Create new announcement with the admin who created it
    const announcement = new Announcement({
      title,
      content,
      priority: priority || 'normal',
      createdBy: req.user.id
    });

    await announcement.save();

    res.status(201).json({
      message: 'Announcement created successfully!',
      announcement
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ============================================
// READ: Get all active announcements
// Students and technicians use this to see current announcements
// Only returns announcements where isActive = true
// ============================================
const getActiveAnnouncements = async (req, res) => {
  try {
    // Find only active announcements, newest first
    const announcements = await Announcement.find({ isActive: true })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// READ: Get all announcements including inactive ones
// Only admin uses this to manage all announcements
// ============================================
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// UPDATE: Admin edits an existing announcement
// Can change title, content, or priority
// ============================================
const updateAnnouncement = async (req, res) => {
  try {
    const { title, content, priority } = req.body;

    // Find the announcement and update it
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content, priority },
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement updated!', announcement });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ============================================
// DELETE: Admin deletes an announcement permanently
// ============================================
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// TOGGLE: Admin hides or shows an announcement
// Instead of deleting, admin can just make it inactive
// ============================================
const toggleAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Flip the isActive value (true becomes false, false becomes true)
    announcement.isActive = !announcement.isActive;
    await announcement.save();

    const statusText = announcement.isActive ? 'activated' : 'deactivated';
    res.json({ message: `Announcement ${statusText}!`, announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAnnouncement,
  getActiveAnnouncements,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncement
};
