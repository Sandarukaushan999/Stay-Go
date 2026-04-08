const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../constants/roles');
const {
  createAnnouncement,
  getActiveAnnouncements,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncement,
} = require('../controllers/maintenanceAnnouncementController');

// ============================================
// MAINTENANCE ANNOUNCEMENT ROUTES
// All routes mounted under /api/maintenance/announcements
// All routes require authentication
// CRUD operations require admin role
// ============================================

const router = express.Router();

// All authenticated users can view active announcements
router.get('/', requireAuth, asyncHandler(getActiveAnnouncements));

// Admin gets all announcements (including hidden ones)
router.get('/all', requireAuth, requireRole(ROLES.ADMIN), asyncHandler(getAllAnnouncements));

// Admin creates a new announcement
router.post('/', requireAuth, requireRole(ROLES.ADMIN), asyncHandler(createAnnouncement));

// Admin updates an existing announcement
router.put('/:id', requireAuth, requireRole(ROLES.ADMIN), asyncHandler(updateAnnouncement));

// Admin deletes an announcement
router.delete('/:id', requireAuth, requireRole(ROLES.ADMIN), asyncHandler(deleteAnnouncement));

// Admin toggles announcement visibility
router.patch('/:id/toggle', requireAuth, requireRole(ROLES.ADMIN), asyncHandler(toggleAnnouncement));

module.exports = router;
