const User = require('../models/User');
const Trip = require('../models/Trip');
const RideRequest = require('../models/RideRequest');
const Incident = require('../models/Incident');
const { ROLES } = require('../constants/roles');
const { TRIP_STATUS } = require('../constants/status');

const ADMIN_MANAGED_ROLES = [ROLES.RIDER, ROLES.PASSENGER];

function hasOwn(payload, key) {
  return Object.prototype.hasOwnProperty.call(payload || {}, key);
}

function normalizeText(value, { lowercase = false } = {}) {
  if (typeof value !== 'string') {
    return '';
  }

  const normalized = value.trim();
  return lowercase ? normalized.toLowerCase() : normalized;
}

function normalizeLocation(value, fallback = { lat: 0, lng: 0, addressText: '' }) {
  if (!value || typeof value !== 'object') {
    return fallback;
  }

  const lat = Number(value.lat);
  const lng = Number(value.lng);

  return {
    lat: Number.isFinite(lat) ? lat : Number(fallback.lat || 0),
    lng: Number.isFinite(lng) ? lng : Number(fallback.lng || 0),
    addressText: normalizeText(value.addressText || fallback.addressText || ''),
  };
}

function normalizeEmergencyContact(value, fallback = { name: '', phone: '' }) {
  if (!value || typeof value !== 'object') {
    return fallback;
  }

  return {
    name: normalizeText(value.name || fallback.name || ''),
    phone: normalizeText(value.phone || fallback.phone || ''),
  };
}

function roleLabel(role) {
  if (role === ROLES.RIDER) {
    return 'Rider';
  }

  return 'Passenger';
}

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

async function getPassengers(req, res) {
  const passengers = await User.find({ role: ROLES.PASSENGER })
    .select('-passwordHash')
    .sort({ createdAt: -1 })
    .limit(500);

  return res.json({ passengers });
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

async function updateUser(req, res) {
  const managedUser = await User.findById(req.params.id);

  if (!managedUser || !ADMIN_MANAGED_ROLES.includes(managedUser.role)) {
    return res.status(404).json({ message: 'Managed user not found' });
  }

  const updates = req.body || {};

  if (hasOwn(updates, 'name')) {
    managedUser.name = normalizeText(updates.name);
  }

  if (hasOwn(updates, 'email')) {
    const email = normalizeText(updates.email, { lowercase: true });

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existing = await User.findOne({ email, _id: { $ne: managedUser._id } });

    if (existing) {
      return res.status(409).json({ message: 'Email is already in use' });
    }

    managedUser.email = email;
  }

  if (hasOwn(updates, 'contactNumber')) {
    managedUser.contactNumber = normalizeText(updates.contactNumber);
  }

  if (hasOwn(updates, 'gender')) {
    managedUser.gender = normalizeText(updates.gender);
  }

  if (hasOwn(updates, 'address')) {
    managedUser.address = normalizeText(updates.address);
  }

  if (hasOwn(updates, 'studentId')) {
    managedUser.studentId = normalizeText(updates.studentId);
  }

  if (hasOwn(updates, 'campusId')) {
    managedUser.campusId = normalizeText(updates.campusId);
  }

  if (hasOwn(updates, 'isVerified')) {
    managedUser.isVerified = Boolean(updates.isVerified);
  }

  if (hasOwn(updates, 'isBlocked')) {
    managedUser.isBlocked = Boolean(updates.isBlocked);
  }

  if (managedUser.role === ROLES.RIDER) {
    if (hasOwn(updates, 'vehicleNumber')) {
      managedUser.vehicleNumber = normalizeText(updates.vehicleNumber);
    }

    if (hasOwn(updates, 'vehicleType')) {
      managedUser.vehicleType = normalizeText(updates.vehicleType);
    }

    if (hasOwn(updates, 'seatCount')) {
      const seatCount = Number(updates.seatCount);
      managedUser.seatCount = Number.isFinite(seatCount) && seatCount >= 0 ? seatCount : 0;
    }

    if (hasOwn(updates, 'availability')) {
      const availability = normalizeText(updates.availability).toLowerCase();
      managedUser.availability = availability || 'offline';
    }

    if (hasOwn(updates, 'isOnline')) {
      managedUser.isOnline = Boolean(updates.isOnline);
    }

    if (hasOwn(updates, 'hostelLocation')) {
      managedUser.hostelLocation = normalizeLocation(updates.hostelLocation, managedUser.hostelLocation);
    }
  }

  if (managedUser.role === ROLES.PASSENGER) {
    if (hasOwn(updates, 'pickupLocation')) {
      managedUser.pickupLocation = normalizeLocation(updates.pickupLocation, managedUser.pickupLocation);
    }

    if (hasOwn(updates, 'emergencyContact')) {
      managedUser.emergencyContact = normalizeEmergencyContact(
        updates.emergencyContact,
        managedUser.emergencyContact
      );
    }
  }

  await managedUser.save();

  return res.json({
    message: `${roleLabel(managedUser.role)} updated successfully`,
    user: managedUser.toPublicJSON(),
  });
}

async function deleteUser(req, res) {
  const managedUser = await User.findById(req.params.id);

  if (!managedUser || !ADMIN_MANAGED_ROLES.includes(managedUser.role)) {
    return res.status(404).json({ message: 'Managed user not found' });
  }

  await managedUser.deleteOne();

  return res.json({
    message: `${roleLabel(managedUser.role)} deleted successfully`,
    deletedUserId: String(req.params.id),
  });
}

module.exports = {
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
};
