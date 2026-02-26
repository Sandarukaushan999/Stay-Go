const express = require('express');
const router = express.Router();
const { listRides, createRide, requestRide, updateRideStatus } = require('../controllers/rideController');
const { protect, authorize } = require('../middleware/auth');
const { defaultLimiter } = require('../middleware/rateLimiter');

router.use(defaultLimiter, protect);

router.get('/', listRides);
router.post('/', authorize('driver'), createRide);
router.post('/:id/request', authorize('student'), requestRide);
router.put('/:id/status', authorize('driver'), updateRideStatus);

module.exports = router;
