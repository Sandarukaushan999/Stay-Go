const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    compatibilityScore: { type: Number, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'blocked'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

matchSchema.index({ requester: 1, recipient: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);
