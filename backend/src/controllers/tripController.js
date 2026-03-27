const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const User = require('../models/User');
const { ROLES } = require('../constants/roles');
const { haversineMeters } = require('../utils/geoUtils');
const { createNotification, notifyAdmins } = require('../services/notificationService');
const { getSocket } = require('../config/socket');

function canAccessTrip(trip, user) {
  if (user.role === ROLES.ADMIN) return true;
  if (user.role === ROLES.RIDER && String(trip.riderId) === String(user._id)) return true;
  if (user.role === ROLES.PASSENGER && String(trip.passengerId) === String(user._id)) return true;
  return false;
}

async function updateTripLocation(req, res) {
  if (req.user.role !== ROLES.RIDER) {
    return res.status(403).json({ message: 'Only riders can send location updates' });
  }

  const { lat, lng, addressText = '' } = req.body;

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ message: 'lat and lng are required as numbers' });
  }

  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' });
  }

  if (String(trip.riderId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not your trip' });
  }

  const now = new Date();

  const previousLocation = {
    lat: Number(trip.currentLocation?.lat || 0),
    lng: Number(trip.currentLocation?.lng || 0),
  };

  const nextLocation = { lat, lng };
  const movementMeters = haversineMeters(previousLocation, nextLocation);

  trip.currentLocation = {
    lat,
    lng,
    addressText,
    updatedAt: now,
  };

  if (movementMeters > 25) {
    trip.lastMovementAt = now;
    trip.suspiciousStopFlag = false;
  }

  await trip.save();

  const io = getSocket();
  if (io) {
    io.to(`trip:${trip._id}`).emit('trip:location', {
      tripId: String(trip._id),
      lat,
      lng,
      addressText,
      updatedAt: now,
    });
  }

  return res.json({ trip });
}

async function getTrip(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid trip id' });
  }

  const trip = await Trip.findById(req.params.id)
    .populate('riderId', 'name email contactNumber vehicleType vehicleNumber rating')
    .populate('passengerId', 'name email contactNumber emergencyContact');

  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' });
  }

  if (!canAccessTrip(trip, req.user)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return res.json({ trip });
}

async function getTripLive(req, res) {
  return getTrip(req, res);
}

async function triggerSos(req, res) {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' });
  }

  if (!canAccessTrip(trip, req.user)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const senderRole = req.user.role;

  await notifyAdmins({
    title: 'SOS Alert',
    message: `SOS received from ${senderRole} for trip ${trip._id}.`,
    type: 'safety.sos',
    payload: { tripId: trip._id, senderRole },
  });

  if (senderRole === ROLES.PASSENGER) {
    const passenger = await User.findById(trip.passengerId);

    await createNotification({
      userId: trip.riderId,
      title: 'Passenger SOS Triggered',
      message: 'Passenger triggered SOS. Please stop safely and contact support.',
      type: 'safety.sos',
      payload: {
        tripId: trip._id,
        emergencyContact: passenger?.emergencyContact || null,
      },
    });
  }

  if (senderRole === ROLES.RIDER) {
    await createNotification({
      userId: trip.passengerId,
      title: 'Rider SOS Triggered',
      message: 'Rider triggered SOS. Stay calm and wait for support updates.',
      type: 'safety.sos',
      payload: {
        tripId: trip._id,
      },
    });
  }

  return res.json({ message: 'SOS alert sent successfully' });
}

async function getTripHistory(req, res) {
  const filter = {};

  if (req.user.role === ROLES.RIDER) {
    filter.riderId = req.user._id;
  } else if (req.user.role === ROLES.PASSENGER) {
    filter.passengerId = req.user._id;
  }

  const trips = await Trip.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('riderId', 'name vehicleType vehicleNumber rating')
    .populate('passengerId', 'name');

  return res.json({ trips });
}

module.exports = {
  updateTripLocation,
  getTrip,
  getTripLive,
  triggerSos,
  getTripHistory,
};
