const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  getMyProfile,
  updateMyProfile,
  updateRiderAvailability,
} = require('../controllers/profileController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/me', asyncHandler(getMyProfile));
router.put('/me', asyncHandler(updateMyProfile));
router.put('/me/availability', asyncHandler(updateRiderAvailability));

module.exports = router;
