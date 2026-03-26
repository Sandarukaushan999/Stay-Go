const express = require('express');
const router = express.Router();
const { auth, roleCheck } = require('../middleware/auth');
const {
  createAnnouncement,
  getActiveAnnouncements,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncement
} = require('../controllers/announcementController');

// ============================================
// ANNOUNCEMENT ROUTES
// Admin can create, update, delete, and toggle announcements
// All logged-in users can view active announcements
// ============================================

// Any logged-in user can see active announcements
router.get('/', auth, getActiveAnnouncements);

// Admin gets all announcements (including hidden/inactive ones)
router.get('/all', auth, roleCheck('admin'), getAllAnnouncements);

// Admin creates a new announcement
router.post('/', auth, roleCheck('admin'), createAnnouncement);

// Admin updates an existing announcement
router.put('/:id', auth, roleCheck('admin'), updateAnnouncement);

// Admin deletes an announcement permanently
router.delete('/:id', auth, roleCheck('admin'), deleteAnnouncement);

// Admin toggles announcement visibility (active/inactive)
router.patch('/:id/toggle', auth, roleCheck('admin'), toggleAnnouncement);

module.exports = router;
