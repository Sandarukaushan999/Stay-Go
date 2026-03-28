const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  createRideRequest,
  getNearbyRiders,
  acceptRideRequest,
  startRide,
  completeRide,
  cancelRide,
  getRide,
  reportUnsafeBehavior,
  triggerRideSos,
  getMyRideRequests,
} = require('../controllers/rideController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.post('/request', asyncHandler(createRideRequest));
router.get('/nearby-riders', asyncHandler(getNearbyRiders));
router.get('/my-requests', asyncHandler(getMyRideRequests));
router.get('/:id', asyncHandler(getRide));
router.post('/:id/accept', asyncHandler(acceptRideRequest));
router.post('/:id/start', asyncHandler(startRide));
router.post('/:id/complete', asyncHandler(completeRide));
router.post('/:id/cancel', asyncHandler(cancelRide));
router.post('/:id/report-unsafe', asyncHandler(reportUnsafeBehavior));
router.post('/:id/sos', asyncHandler(triggerRideSos));

module.exports = router;

