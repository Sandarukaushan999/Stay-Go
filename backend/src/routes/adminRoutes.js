const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  getDashboard,
  getUsers,
  getRiders,
  getTrips,
  getIncidents,
  approveRider,
  blockUser,
} = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(requireAuth, requireRole(ROLES.ADMIN));

router.get('/dashboard', asyncHandler(getDashboard));
router.get('/users', asyncHandler(getUsers));
router.get('/riders', asyncHandler(getRiders));
router.get('/trips', asyncHandler(getTrips));
router.get('/incidents', asyncHandler(getIncidents));
router.patch('/riders/:id/approve', asyncHandler(approveRider));
router.patch('/users/:id/block', asyncHandler(blockUser));

module.exports = router;
