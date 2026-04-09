const mongoose = require('mongoose');

const matchPairSchema = new mongoose.Schema(
    {
        studentA: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudentProfile',
            required: true,
        },
        studentB: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudentProfile',
            required: true,
        },
        compatibilityScore: { type: Number, required: true },
        isLocked: { type: Boolean, default: true },
        lockedAt: { type: Date, default: Date.now },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('MatchPair', matchPairSchema);
