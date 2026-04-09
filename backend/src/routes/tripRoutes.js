const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  updateTripLocation,
  getTrip,
  getTripLive,
  triggerSos,
  getTripHistory,
} = require('../controllers/tripController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/history', asyncHandler(getTripHistory));
router.get('/:id', asyncHandler(getTrip));
router.get('/:id/live', asyncHandler(getTripLive));
router.post('/:id/location-update', asyncHandler(updateTripLocation));
router.post('/:id/sos', asyncHandler(triggerSos));

module.exports = router;
