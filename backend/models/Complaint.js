const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    against: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['harassment', 'fraud', 'noise', 'damage', 'other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'under_review', 'resolved', 'dismissed'],
      default: 'open',
    },
    adminNote: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
