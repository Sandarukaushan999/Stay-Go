const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { geocode, reverseGeocode, route } = require('../controllers/mapController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/geocode', requireAuth, asyncHandler(geocode));
router.post('/reverse-geocode', requireAuth, asyncHandler(reverseGeocode));
router.post('/route', requireAuth, asyncHandler(route));

module.exports = router;
