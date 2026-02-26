const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    ride: { type: mongoose.Schema.Types.ObjectId, ref: 'RideOffer', required: true },
    payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    payee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    method: { type: String, enum: ['cash', 'online'], default: 'cash' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
