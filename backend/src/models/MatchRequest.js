const mongoose = require('mongoose');
const { MATCH_REQUEST_STATUS } = require('../constants/enums');

const matchRequestSchema = new mongoose.Schema(
    {
        senderStudentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudentProfile',
            required: true,
        },
        receiverStudentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudentProfile',
            required: true,
        },
        compatibilityScore: { type: Number, required: true },
        status: {
            type: String,
            required: true,
            enum: Object.values(MATCH_REQUEST_STATUS),
            default: MATCH_REQUEST_STATUS.PENDING,
        },
        respondedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// Compound index for fast lookup and preventing duplicate active requests
matchRequestSchema.index({ senderStudentId: 1, receiverStudentId: 1 });

module.exports = mongoose.model('MatchRequest', matchRequestSchema);
