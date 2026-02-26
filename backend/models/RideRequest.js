const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema(
  {
    ride: { type: mongoose.Schema.Types.ObjectId, ref: 'RideOffer', required: true },
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
    },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String, maxlength: 300 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RideRequest', rideRequestSchema);
