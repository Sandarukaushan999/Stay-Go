const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  listMyNotifications,
  markNotificationRead,
} = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/', asyncHandler(listMyNotifications));
router.patch('/:id/read', asyncHandler(markNotificationRead));

module.exports = router;
