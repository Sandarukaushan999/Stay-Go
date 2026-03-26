const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    type: { type: String, default: 'crash', index: true },
    message: { type: String, default: '' },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
      addressText: { type: String, default: '' },
    },
    imageUrl: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model('Incident', incidentSchema);
