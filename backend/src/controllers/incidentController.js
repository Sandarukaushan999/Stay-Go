const mongoose = require('mongoose');
const Incident = require('../models/Incident');
const Trip = require('../models/Trip');
const { ROLES } = require('../constants/roles');
const { createNotification, notifyAdmins } = require('../services/notificationService');

async function reportIncident(req, res) {
  const { tripId, type = 'crash', message = '', severity = 'medium', location, imageUrl = '' } = req.body;

  if (!tripId || !mongoose.isValidObjectId(tripId)) {
    return res.status(400).json({ message: 'Valid tripId is required' });
  }

  const trip = await Trip.findById(tripId);

  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' });
  }

  const isParty = [String(trip.riderId), String(trip.passengerId)].includes(String(req.user._id));
  if (!isParty && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const incident = await Incident.create({
    tripId,
    riderId: trip.riderId,
    passengerId: trip.passengerId,
    type,
    message,
    severity,
    location: location || trip.currentLocation || { lat: 0, lng: 0, addressText: '' },
    imageUrl,
    createdBy: req.user._id,
  });

  await createNotification({
    userId: trip.passengerId,
    title: 'Incident Reported',
    message: `A ${type} incident was reported during your trip.`,
    type: 'incident.reported',
    payload: { incidentId: incident._id, tripId },
  });

  await createNotification({
    userId: trip.riderId,
    title: 'Incident Reported',
    message: `A ${type} incident was logged for your trip.`,
    type: 'incident.reported',
    payload: { incidentId: incident._id, tripId },
  });

  await notifyAdmins({
    title: 'New Incident Alert',
    message: `${type.toUpperCase()} incident reported for trip ${tripId}.`,
    type: 'admin.incident',
    payload: { incidentId: incident._id, tripId },
  });

  return res.status(201).json({ incident });
}

async function listIncidents(req, res) {
  let filter = {};

  if (req.user.role === ROLES.RIDER) {
    filter.riderId = req.user._id;
  } else if (req.user.role === ROLES.PASSENGER) {
    filter.passengerId = req.user._id;
  }

  const incidents = await Incident.find(filter)
    .sort({ createdAt: -1 })
    .limit(200)
    .populate('tripId', 'status startedAt completedAt')
    .populate('createdBy', 'name email role');

  return res.json({ incidents });
}

async function getIncident(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid incident id' });
  }

  const incident = await Incident.findById(req.params.id)
    .populate('tripId', 'riderId passengerId status startedAt completedAt')
    .populate('createdBy', 'name email role');

  if (!incident) {
    return res.status(404).json({ message: 'Incident not found' });
  }

  const canAccess =
    req.user.role === ROLES.ADMIN ||
    String(incident.riderId) === String(req.user._id) ||
    String(incident.passengerId) === String(req.user._id);

  if (!canAccess) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return res.json({ incident });
}

module.exports = {
  reportIncident,
  listIncidents,
  getIncident,
};
