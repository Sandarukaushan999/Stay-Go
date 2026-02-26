const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updatePreferences,
  getMatches,
  sendMatchRequest,
  respondToRequest,
} = require('../controllers/roommateController');
const { protect } = require('../middleware/auth');
const { defaultLimiter } = require('../middleware/rateLimiter');

router.use(defaultLimiter, protect);

router.get('/profile', getMyProfile);
router.put('/preferences', updatePreferences);
router.get('/matches', getMatches);
router.post('/request/:id', sendMatchRequest);
router.put('/request/:id', respondToRequest);

module.exports = router;
