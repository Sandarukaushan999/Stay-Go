const mongoose = require('mongoose');
const RideRequest = require('../models/RideRequest');
const Trip = require('../models/Trip');
const User = require('../models/User');
const env = require('../config/env');
const { RIDE_REQUEST_STATUS, TRIP_STATUS } = require('../constants/status');
const { ROLES } = require('../constants/roles');
const { getRoute } = require('../services/mapService');
const { haversineMeters } = require('../utils/geoUtils');
const { createNotification, notifyAdmins } = require('../services/notificationService');

function canAccessRide(ride, user) {
  if (user.role === ROLES.ADMIN) return true;
  if (user.role === ROLES.PASSENGER && String(ride.passengerId) === String(user._id)) return true;
  if (user.role === ROLES.RIDER && String(ride.riderId) === String(user._id)) return true;
  return false;
}

function fallbackRoute(origin, destination) {
  const distanceMeters = haversineMeters(origin, destination);
  const speedMetersPerSecond = 8.3;
  return {
    distanceMeters,
    expectedDurationSeconds: Math.max(60, Math.round(distanceMeters / speedMetersPerSecond)),
    routeGeometry: [
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
    ],
  };
}

function normalizeSosMessage(message) {
  if (typeof message !== 'string') {
    return '';
  }

  return message.trim().slice(0, 180);
}

async function createRideRequest(req, res) {
  if (req.user.role !== ROLES.PASSENGER) {
    return res.status(403).json({ message: 'Only passengers can request rides' });
  }

  const { origin, destination, campusId = '', seatCount = 1, femaleOnly = false, riderId = null } = req.body;

  if (!origin || !destination || typeof origin.lat !== 'number' || typeof destination.lat !== 'number') {
    return res.status(400).json({ message: 'origin and destination with lat/lng are required' });
  }

  let selectedRiderId = null;
  if (riderId) {
    const rider = await User.findById(riderId);
    if (!rider || rider.role !== ROLES.RIDER || rider.isBlocked || !rider.isVerified) {
      return res.status(400).json({ message: 'Selected rider is not available' });
    }
    selectedRiderId = rider._id;
  }

  let routeData;
  try {
    routeData = await getRoute(origin, destination);
  } catch (error) {
    routeData = fallbackRoute(origin, destination);
  }

  const ride = await RideRequest.create({
    riderId: selectedRiderId,
    passengerId: req.user._id,
    campusId,
    seatCount,
    femaleOnly,
    origin,
    destination,
    routeGeometry: routeData.routeGeometry,
    distanceMeters: routeData.distanceMeters,
    expectedDurationSeconds: routeData.expectedDurationSeconds,
    status: RIDE_REQUEST_STATUS.REQUESTED,
  });

  if (selectedRiderId) {
    await createNotification({
      userId: selectedRiderId,
      title: 'New Ride Request',
      message: `${req.user.name} has requested a ride.`,
      type: 'ride.requested',
      payload: { rideId: ride._id },
    });
  }

  return res.status(201).json({ ride });
}

async function getNearbyRiders(req, res) {
  const { campusId = '', lat, lng, limit = 20, femaleOnly = 'false' } = req.query;

  const filter = {
    role: ROLES.RIDER,
    isBlocked: false,
    isVerified: true,
    isOnline: true,
  };

  if (campusId) {
    filter.campusId = campusId;
  }

  const riders = await User.find(filter)
    .select('name email contactNumber gender vehicleNumber vehicleType seatCount campusId hostelLocation rating isOnline isVerified availability')
    .limit(Math.min(Number(limit) || 20, 100));

  const pickupPoint =
    typeof lat === 'string' && typeof lng === 'string'
      ? { lat: Number(lat), lng: Number(lng) }
      : null;

  const isFemaleOnly = femaleOnly === 'true';

  const data = riders
    .filter((rider) => {
      if (!isFemaleOnly) return true;
      return rider.gender?.toLowerCase() === 'female';
    })
    .map((rider) => {
      const distanceMeters = pickupPoint
        ? haversineMeters(pickupPoint, {
            lat: Number(rider.hostelLocation?.lat || 0),
            lng: Number(rider.hostelLocation?.lng || 0),
          })
        : null;

      return {
        id: rider._id,
        name: rider.name,
        email: rider.email,
        contactNumber: rider.contactNumber,
        gender: rider.gender,
        vehicleNumber: rider.vehicleNumber,
        vehicleType: rider.vehicleType,
        seatCount: rider.seatCount,
        campusId: rider.campusId,
        hostelLocation: rider.hostelLocation,
        rating: rider.rating,
        isOnline: rider.isOnline,
        isVerified: rider.isVerified,
        availability: rider.availability,
        distanceMeters,
      };
    })
    .sort((a, b) => {
      if (a.distanceMeters == null || b.distanceMeters == null) return 0;
      return a.distanceMeters - b.distanceMeters;
    });

  return res.json({ riders: data });
}

async function acceptRideRequest(req, res) {
  if (req.user.role !== ROLES.RIDER) {
    return res.status(403).json({ message: 'Only riders can accept ride requests' });
  }

  const ride = await RideRequest.findById(req.params.id);
  if (!ride) {
    return res.status(404).json({ message: 'Ride request not found' });
  }

  if (ride.status !== RIDE_REQUEST_STATUS.REQUESTED) {
    return res.status(400).json({ message: 'Ride request is not in requested state' });
  }

  if (ride.riderId && String(ride.riderId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Ride assigned to another rider' });
  }

  ride.riderId = req.user._id;
  ride.status = RIDE_REQUEST_STATUS.ACCEPTED;
  ride.acceptedAt = new Date();
  await ride.save();

  await createNotification({
    userId: ride.passengerId,
    title: 'Ride Accepted',
    message: `${req.user.name} accepted your ride request.`,
    type: 'ride.accepted',
    payload: { rideId: ride._id },
  });

  return res.json({ ride });
}

async function startRide(req, res) {
  if (req.user.role !== ROLES.RIDER) {
    return res.status(403).json({ message: 'Only riders can start trips' });
  }

  const ride = await RideRequest.findById(req.params.id);
  if (!ride) {
    return res.status(404).json({ message: 'Ride request not found' });
  }

  if (String(ride.riderId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'You are not assigned to this ride' });
  }

  if (![RIDE_REQUEST_STATUS.ACCEPTED, RIDE_REQUEST_STATUS.STARTED].includes(ride.status)) {
    return res.status(400).json({ message: 'Ride must be accepted before start' });
  }

  let trip = await Trip.findOne({ rideRequestId: ride._id });
  if (!trip) {
    const startedAt = new Date();
    const bufferedDeadlineAt = new Date(
      startedAt.getTime() +
        (Number(ride.expectedDurationSeconds || 0) + env.overdueBufferMinutes * 60) * 1000
    );

    trip = await Trip.create({
      rideRequestId: ride._id,
      riderId: ride.riderId,
      passengerId: ride.passengerId,
      origin: ride.origin,
      destination: ride.destination,
      routeGeometry: ride.routeGeometry,
      distanceMeters: ride.distanceMeters,
      expectedDurationSeconds: ride.expectedDurationSeconds,
      startedAt,
      bufferedDeadlineAt,
      bufferMinutes: env.overdueBufferMinutes,
      status: TRIP_STATUS.STARTED,
      currentLocation: {
        lat: ride.origin.lat,
        lng: ride.origin.lng,
        addressText: ride.origin.addressText,
        updatedAt: startedAt,
      },
      lastMovementAt: startedAt,
    });
  }

  ride.status = RIDE_REQUEST_STATUS.STARTED;
  await ride.save();

  await createNotification({
    userId: ride.passengerId,
    title: 'Trip Started',
    message: `${req.user.name} started the trip.`,
    type: 'trip.started',
    payload: { tripId: trip._id, rideId: ride._id },
  });

  return res.json({ ride, trip });
}

async function completeRide(req, res) {
  if (req.user.role !== ROLES.RIDER) {
    return res.status(403).json({ message: 'Only riders can complete trips' });
  }

  const ride = await RideRequest.findById(req.params.id);
  if (!ride) {
    return res.status(404).json({ message: 'Ride request not found' });
  }

  if (String(ride.riderId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'You are not assigned to this ride' });
  }

  const trip = await Trip.findOne({ rideRequestId: ride._id });
  if (!trip) {
    return res.status(400).json({ message: 'Trip has not started yet' });
  }

  trip.status = TRIP_STATUS.COMPLETED;
  trip.completedAt = new Date();
  await trip.save();

  ride.status = RIDE_REQUEST_STATUS.COMPLETED;
  ride.completedAt = trip.completedAt;
  await ride.save();

  await createNotification({
    userId: ride.passengerId,
    title: 'Trip Completed',
    message: 'Your trip has been completed. Please rate your rider.',
    type: 'trip.completed',
    payload: { tripId: trip._id, rideId: ride._id },
  });

  return res.json({ ride, trip });
}

async function cancelRide(req, res) {
  const ride = await RideRequest.findById(req.params.id);
  if (!ride) {
    return res.status(404).json({ message: 'Ride request not found' });
  }

  const isRider = req.user.role === ROLES.RIDER && String(ride.riderId) === String(req.user._id);
  const isPassenger = req.user.role === ROLES.PASSENGER && String(ride.passengerId) === String(req.user._id);
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (!isRider && !isPassenger && !isAdmin) {
    return res.status(403).json({ message: 'You cannot cancel this ride' });
  }

  if ([RIDE_REQUEST_STATUS.CANCELLED, RIDE_REQUEST_STATUS.COMPLETED].includes(ride.status)) {
    return res.status(400).json({ message: `Ride already ${ride.status}` });
  }

  ride.status = RIDE_REQUEST_STATUS.CANCELLED;
  ride.cancelledAt = new Date();
  await ride.save();

  const trip = await Trip.findOne({ rideRequestId: ride._id });
  if (trip && !trip.completedAt) {
    trip.status = TRIP_STATUS.CANCELLED;
    trip.completedAt = new Date();
    await trip.save();
  }

  if (ride.riderId) {
    await createNotification({
      userId: ride.riderId,
      title: 'Ride Cancelled',
      message: 'Ride was cancelled.',
      type: 'ride.cancelled',
      payload: { rideId: ride._id },
    });
  }

  await createNotification({
    userId: ride.passengerId,
    title: 'Ride Cancelled',
    message: 'Ride was cancelled.',
    type: 'ride.cancelled',
    payload: { rideId: ride._id },
  });

  return res.json({ ride, trip: trip || null });
}

async function getRide(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ride id' });
  }

  const ride = await RideRequest.findById(req.params.id)
    .populate('riderId', 'name email contactNumber vehicleNumber vehicleType seatCount rating')
    .populate('passengerId', 'name email contactNumber emergencyContact');

  if (!ride) {
    return res.status(404).json({ message: 'Ride request not found' });
  }

  if (!canAccessRide(ride, req.user)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const trip = await Trip.findOne({ rideRequestId: ride._id });

  return res.json({
    ride,
    trip,
  });
}

async function reportUnsafeBehavior(req, res) {
  if (req.user.role !== ROLES.PASSENGER) {
    return res.status(403).json({ message: 'Only passengers can report unsafe behavior' });
  }

  const ride = await RideRequest.findById(req.params.id);

  if (!ride) {
    return res.status(404).json({ message: 'Ride request not found' });
  }

  if (String(ride.passengerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'You can only report your ride' });
  }

  if (!ride.riderId) {
    return res.status(400).json({ message: 'Ride does not have an assigned rider' });
  }

  const rider = await User.findById(ride.riderId);
  if (!rider) {
    return res.status(404).json({ message: 'Rider not found' });
  }

  rider.complaintCount += 1;
  await rider.save();

  if (rider.complaintCount >= 3) {
    await notifyAdmins({
      title: 'Rider Complaint Threshold Reached',
      message: `${rider.name} now has ${rider.complaintCount} complaints and needs review.`,
      type: 'admin.rider-review',
      payload: { riderId: rider._id, rideId: ride._id },
    });
  }

  return res.json({
    message: 'Unsafe behavior report submitted',
    complaintCount: rider.complaintCount,
  });
}

async function triggerRideSos(req, res) {
  const ride = await RideRequest.findById(req.params.id)
    .populate('passengerId', 'name emergencyContact')
    .populate('riderId', 'name');

  if (!ride) {
    return res.status(404).json({ message: 'Ride request not found' });
  }

  if (!canAccessRide(ride, req.user)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const trip = await Trip.findOne({ rideRequestId: ride._id }).select('_id');
  const senderRole = req.user.role;
  const sosMessage = normalizeSosMessage(req.body?.message);
  const location = ride.origin?.addressText || ride.destination?.addressText || 'Ride route';
  const passengerName = ride.passengerId?.name || 'Passenger';
  const riderName = ride.riderId?.name || 'Unassigned Rider';
  const baseAdminMessage = trip
    ? `SOS received from ${senderRole} for trip ${trip._id}.`
    : `SOS received from ${senderRole} for ride request ${ride._id}.`;
  const adminMessage = sosMessage ? `${baseAdminMessage} Note: ${sosMessage}` : baseAdminMessage;

  await notifyAdmins({
    title: 'SOS Alert',
    message: adminMessage,
    type: 'safety.sos',
    payload: {
      rideId: ride._id,
      tripId: trip?._id || null,
      senderRole,
      level: 'critical',
      location,
      passengerName,
      riderName,
      sosMessage,
    },
  });

  if (senderRole === ROLES.PASSENGER && ride.riderId) {
    const riderId = ride.riderId?._id || ride.riderId;

    await createNotification({
      userId: riderId,
      title: 'Passenger SOS Triggered',
      message: sosMessage
        ? `Passenger triggered SOS: "${sosMessage}". Please stop safely and contact support.`
        : 'Passenger triggered SOS. Please stop safely and contact support.',
      type: 'safety.sos',
      payload: {
        rideId: ride._id,
        tripId: trip?._id || null,
        location,
        level: 'critical',
        emergencyContact: ride.passengerId?.emergencyContact || null,
      },
    });
  }

  if (senderRole === ROLES.RIDER) {
    const passengerId = ride.passengerId?._id || ride.passengerId;

    await createNotification({
      userId: passengerId,
      title: 'Rider SOS Triggered',
      message: sosMessage
        ? `Rider triggered SOS: "${sosMessage}". Stay calm and wait for support updates.`
        : 'Rider triggered SOS. Stay calm and wait for support updates.',
      type: 'safety.sos',
      payload: {
        rideId: ride._id,
        tripId: trip?._id || null,
        location,
        level: 'critical',
      },
    });
  }

  return res.json({
    message: 'SOS alert sent successfully',
    rideId: ride._id,
    tripId: trip?._id || null,
  });
}
async function getMyRideRequests(req, res) {
  let filter = {};

  if (req.user.role === ROLES.PASSENGER) {
    filter.passengerId = req.user._id;
  } else if (req.user.role === ROLES.RIDER) {
    filter.$or = [{ riderId: req.user._id }, { riderId: null, status: RIDE_REQUEST_STATUS.REQUESTED }];
  }

  const rides = await RideRequest.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('riderId', 'name vehicleNumber vehicleType rating')
    .populate('passengerId', 'name');

  return res.json({ rides });
}

module.exports = {
  createRideRequest,
  getNearbyRiders,
  acceptRideRequest,
  startRide,
  completeRide,
  cancelRide,
  getRide,
  reportUnsafeBehavior,
  triggerRideSos,
  getMyRideRequests,
};

