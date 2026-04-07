const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  getDashboard,
  getUsers,
  getRiders,
  getPassengers,
  getTrips,
  getIncidents,
  approveRider,
  blockUser,
  updateUser,
  deleteUser,
} = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(requireAuth, requireRole(ROLES.ADMIN));

router.get('/dashboard', asyncHandler(getDashboard));
router.get('/users', asyncHandler(getUsers));
router.get('/riders', asyncHandler(getRiders));
router.get('/passengers', asyncHandler(getPassengers));
router.get('/trips', asyncHandler(getTrips));
router.get('/incidents', asyncHandler(getIncidents));
router.patch('/riders/:id/approve', asyncHandler(approveRider));
router.patch('/users/:id/block', asyncHandler(blockUser));
router.put('/users/:id', asyncHandler(updateUser));
router.delete('/users/:id', asyncHandler(deleteUser));

module.exports = router;
