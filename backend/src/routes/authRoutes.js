const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { registerRider, registerPassenger, login, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register-rider', asyncHandler(registerRider));
router.post('/register-passenger', asyncHandler(registerPassenger));
router.post('/login', asyncHandler(login));
router.get('/me', requireAuth, asyncHandler(me));

module.exports = router;
