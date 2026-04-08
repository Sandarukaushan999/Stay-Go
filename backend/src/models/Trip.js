const mongoose = require('mongoose');
const { TRIP_STATUS } = require('../constants/status');

const pointSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    addressText: { type: String, default: '' },
  },
  { _id: false }
);

const locationUpdateSchema = new mongoose.Schema(
  {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    addressText: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    rideRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'RideRequest', required: true, unique: true, index: true },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    origin: { type: pointSchema, required: true },
    destination: { type: pointSchema, required: true },
    routeGeometry: { type: [[Number]], default: [] },
    distanceMeters: { type: Number, default: 0 },
    expectedDurationSeconds: { type: Number, default: 0 },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date, default: null },
    bufferedDeadlineAt: { type: Date, required: true, index: true },
    bufferMinutes: { type: Number, default: 15 },
    status: {
      type: String,
      enum: Object.values(TRIP_STATUS),
      default: TRIP_STATUS.STARTED,
      index: true,
    },
    safetyMessageSent: { type: Boolean, default: false },
    currentLocation: { type: locationUpdateSchema, default: () => ({}) },
    lastMovementAt: { type: Date, default: Date.now },
    suspiciousStopFlag: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Trip', tripSchema);
