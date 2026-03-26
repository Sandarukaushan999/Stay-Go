const User = require('../models/User');
const Trip = require('../models/Trip');
const RideRequest = require('../models/RideRequest');
const Incident = require('../models/Incident');
const { ROLES } = require('../constants/roles');
const { TRIP_STATUS } = require('../constants/status');

async function getDashboard(req, res) {
  const [
    totalRiders,
    totalPassengers,
    activeTrips,
    overdueTrips,
    incidentsToday,
    approvedRiders,
    blockedUsers,
    tripSuccessRateData,
    riderRatingData,
  ] = await Promise.all([
    User.countDocuments({ role: ROLES.RIDER }),
    User.countDocuments({ role: ROLES.PASSENGER }),
    Trip.countDocuments({ status: TRIP_STATUS.STARTED }),
    Trip.countDocuments({ status: TRIP_STATUS.OVERDUE }),
    Incident.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
    User.countDocuments({ role: ROLES.RIDER, isVerified: true }),
    User.countDocuments({ isBlocked: true }),
    RideRequest.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
            },
          },
        },
      },
    ]),
    User.aggregate([
      { $match: { role: ROLES.RIDER } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          maxRating: { $max: '$rating' },
          minRating: { $min: '$rating' },
        },
      },
    ]),
  ]);

  const tripStats = tripSuccessRateData[0] || { total: 0, completed: 0 };
  const tripSuccessRate = tripStats.total ? (tripStats.completed / tripStats.total) * 100 : 0;
  const riderRatingSummary = riderRatingData[0] || {
    averageRating: 0,
    maxRating: 0,
    minRating: 0,
  };

  const campusWiseRideCounts = await RideRequest.aggregate([
    {
      $group: {
        _id: '$campusId',
        totalRides: { $sum: 1 },
      },
    },
    { $sort: { totalRides: -1 } },
  ]);

  return res.json({
    totalRiders,
    totalPassengers,
    activeRides: activeTrips,
    overdueRides: overdueTrips,
    incidentsToday,
    approvedRiders,
    blockedUsers,
    campusWiseRideCounts,
    tripSuccessRate,
    riderRatingSummary,
  });
}

async function getUsers(req, res) {
  const users = await User.find({})
    .select('-passwordHash')
    .sort({ createdAt: -1 })
    .limit(500);

  return res.json({ users });
}

async function getRiders(req, res) {
  const riders = await User.find({ role: ROLES.RIDER })
    .select('-passwordHash')
    .sort({ createdAt: -1 })
    .limit(500);

  return res.json({ riders });
}

async function getTrips(req, res) {
  const trips = await Trip.find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .populate('riderId', 'name email contactNumber')
    .populate('passengerId', 'name email contactNumber');

  return res.json({ trips });
}

async function getIncidents(req, res) {
  const incidents = await Incident.find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .populate('tripId', 'status startedAt completedAt')
    .populate('createdBy', 'name role');

  return res.json({ incidents });
}

async function approveRider(req, res) {
  const rider = await User.findOne({ _id: req.params.id, role: ROLES.RIDER });

  if (!rider) {
    return res.status(404).json({ message: 'Rider not found' });
  }

  rider.isVerified = true;
  await rider.save();

  return res.json({ message: 'Rider approved successfully', rider: rider.toPublicJSON() });
}

async function blockUser(req, res) {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { block = true } = req.body;
  user.isBlocked = Boolean(block);
  await user.save();

  return res.json({
    message: user.isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
    user: user.toPublicJSON(),
  });
}

module.exports = {
  getDashboard,
  getUsers,
  getRiders,
  getTrips,
  getIncidents,
  approveRider,
  blockUser,
};
