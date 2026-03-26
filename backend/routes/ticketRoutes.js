const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth, roleCheck } = require('../middleware/auth');
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
  getAnalytics
} = require('../controllers/ticketController');

// ============================================
// FILE UPLOAD SETUP
// Configure multer to handle image uploads for ticket attachments
// Files are saved in the "uploads" folder
// ============================================
const storage = multer.diskStorage({
  // Set the folder where uploaded files will be saved
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // Create a unique filename to avoid overwriting
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// Only allow JPG and PNG image files, max 5MB each
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG images are allowed'));
    }
  }
});

// ============================================
// TICKET ROUTES
// Each route has auth middleware (must be logged in)
// and roleCheck middleware (must have the correct role)
// ============================================

// Student creates a new ticket (with optional file upload, max 3 files)
router.post('/', auth, roleCheck('student'), upload.array('attachments', 3), createTicket);

// Student gets their own tickets
router.get('/my', auth, roleCheck('student'), getMyTickets);

// Technician gets tickets assigned to them
router.get('/assigned', auth, roleCheck('staff'), getAssignedTickets);

// Admin gets analytics data for dashboard charts
router.get('/analytics', auth, roleCheck('admin'), getAnalytics);

// Admin gets all tickets (with optional query filters)
router.get('/', auth, roleCheck('admin'), getAllTickets);

// Any logged-in user gets a single ticket by ID
router.get('/:id', auth, getTicketById);

// Admin assigns a technician to a ticket
router.patch('/:id/assign', auth, roleCheck('admin'), assignTicket);

// Admin rejects a ticket with a reason
router.patch('/:id/reject', auth, roleCheck('admin'), rejectTicket);

// Technician starts working on a ticket
router.patch('/:id/start', auth, roleCheck('staff'), startTicket);

// Technician marks a ticket as resolved
router.patch('/:id/resolve', auth, roleCheck('staff'), resolveTicket);

// Student rates a resolved ticket (closes it)
router.patch('/:id/rate', auth, roleCheck('student'), rateTicket);

module.exports = router;
