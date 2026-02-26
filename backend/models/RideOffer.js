const mongoose = require('mongoose');

const rideOfferSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    origin: {
      address: { type: String, required: true },
      coordinates: { lat: Number, lng: Number },
    },
    destination: {
      address: { type: String, required: true },
      coordinates: { lat: Number, lng: Number },
    },
    departureTime: { type: Date, required: true },
    seatsAvailable: { type: Number, required: true, min: 1, max: 10 },
    farePerKm: { type: Number, required: true },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'cancelled'],
      default: 'open',
    },
    distanceKm: { type: Number },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('RideOffer', rideOfferSchema);
