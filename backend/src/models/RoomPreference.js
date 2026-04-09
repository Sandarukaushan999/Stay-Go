const mongoose = require('mongoose');
const { AC_TYPE, ROOM_POSITION } = require('../constants/enums');

const roomPreferenceSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudentProfile',
            required: true,
            unique: true,
        },
        block: { type: String, required: true, trim: true },
        floor: { type: String, required: true, trim: true },
        acType: {
            type: String,
            required: true,
            enum: Object.values(AC_TYPE),
        },
        roomPosition: {
            type: String,
            required: true,
            enum: Object.values(ROOM_POSITION),
        },
        capacity: { type: Number, required: true, min: 1, max: 4 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('RoomPreference', roomPreferenceSchema);
