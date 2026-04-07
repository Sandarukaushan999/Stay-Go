const mongoose = require('mongoose');
const { RIDE_REQUEST_STATUS } = require('../constants/status');

const pointSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    addressText: { type: String, default: '' },
  },
  { _id: false }
);

const rideRequestSchema = new mongoose.Schema(
  {
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    campusId: { type: String, default: '' },
    seatCount: { type: Number, default: 1 },
    femaleOnly: { type: Boolean, default: false },
    origin: { type: pointSchema, required: true },
    destination: { type: pointSchema, required: true },
    routeGeometry: { type: [[Number]], default: [] },
    distanceMeters: { type: Number, default: 0 },
    expectedDurationSeconds: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(RIDE_REQUEST_STATUS),
      default: RIDE_REQUEST_STATUS.REQUESTED,
      index: true,
    },
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RideRequest', rideRequestSchema);
