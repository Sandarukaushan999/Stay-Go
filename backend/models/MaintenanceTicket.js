const mongoose = require('mongoose');

const maintenanceTicketSchema = new mongoose.Schema(
  {
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['plumbing', 'electrical', 'furniture', 'cleaning', 'other'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'assigned', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images: [{ type: String }],
    timeline: [
      {
        status: String,
        note: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    roomNumber: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MaintenanceTicket', maintenanceTicketSchema);
