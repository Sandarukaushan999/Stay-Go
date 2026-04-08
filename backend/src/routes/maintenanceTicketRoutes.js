const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../constants/roles');
const {
  createTicket,
  getMyTickets,
  getAssignedTickets,
  getAllTickets,
  getTicketById,
  assignTicket,
  rejectTicket,
  startTicket,
  resolveTicket,
  rateTicket,
  getAnalytics,
  getTechnicians,
} = require('../controllers/maintenanceTicketController');

// ============================================
// FILE UPLOAD SETUP using multer
// Saves uploaded ticket attachment images to the uploads folder
// ============================================

// Make sure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads/maintenance');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  // Create a unique filename to avoid overwriting
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// Only allow JPG/PNG, max 5MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG images are allowed'));
    }
  },
});

// ============================================
// MAINTENANCE TICKET ROUTES
// All routes mounted under /api/maintenance/tickets
// All routes require authentication
// Some routes require specific roles
// ============================================

const router = express.Router();

// Any authenticated user can submit a complaint (max 3 file attachments)
router.post('/', requireAuth, upload.array('attachments', 3), asyncHandler(createTicket));

// User gets their own tickets
router.get('/my', requireAuth, asyncHandler(getMyTickets));

// Technician gets tickets assigned to them
router.get('/assigned', requireAuth, requireRole(ROLES.STAFF), asyncHandler(getAssignedTickets));

// Admin gets analytics data
router.get('/analytics', requireAuth, requireRole(ROLES.ADMIN), asyncHandler(getAnalytics));

// Admin gets list of technicians (for assigning tickets)
router.get('/technicians', requireAuth, requireRole(ROLES.ADMIN), asyncHandler(getTechnicians));

// Admin gets all tickets (with filters)
router.get('/', requireAuth, requireRole(ROLES.ADMIN), asyncHandler(getAllTickets));

// Any authenticated user can view a single ticket by ID
router.get('/:id', requireAuth, asyncHandler(getTicketById));

// Admin assigns technician
router.patch('/:id/assign', requireAuth, requireRole(ROLES.ADMIN), asyncHandler(assignTicket));

// Admin rejects ticket
router.patch('/:id/reject', requireAuth, requireRole(ROLES.ADMIN), asyncHandler(rejectTicket));

// Technician starts work
router.patch('/:id/start', requireAuth, requireRole(ROLES.STAFF), asyncHandler(startTicket));

// Technician marks resolved
router.patch('/:id/resolve', requireAuth, requireRole(ROLES.STAFF), asyncHandler(resolveTicket));

// Student rates and closes ticket
router.patch('/:id/rate', requireAuth, asyncHandler(rateTicket));

module.exports = router;
