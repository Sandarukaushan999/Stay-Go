const express = require('express');
const router = express.Router();
const { listTickets, createTicket, updateTicket } = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');
const { defaultLimiter } = require('../middleware/rateLimiter');

router.use(defaultLimiter, protect);

router.get('/', listTickets);
router.post('/', authorize('student'), createTicket);
router.put('/:id', authorize('technician', 'admin'), updateTicket);

module.exports = router;
