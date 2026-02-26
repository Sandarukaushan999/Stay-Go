const express = require('express');
const router = express.Router();
const { listUsers, updateUser, listComplaints, updateComplaint } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { defaultLimiter } = require('../middleware/rateLimiter');

router.use(defaultLimiter, protect, authorize('admin'));

router.get('/users', listUsers);
router.put('/users/:id', updateUser);
router.get('/complaints', listComplaints);
router.put('/complaints/:id', updateComplaint);

module.exports = router;
