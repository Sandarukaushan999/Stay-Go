const mongoose = require('mongoose');
const { AC_TYPE, ROOM_POSITION, AVAILABILITY_STATUS } = require('../constants/enums');

const roomSchema = new mongoose.Schema(
    {
        roomNumber: { type: String, required: true, unique: true, trim: true },
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
        capacity: { type: Number, required: true, min: 1 },
        occupancyCount: { type: Number, default: 0 },
        availabilityStatus: {
            type: String,
            required: true,
            enum: Object.values(AVAILABILITY_STATUS),
            default: AVAILABILITY_STATUS.AVAILABLE,
        },
        assignedStudents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'StudentProfile',
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
