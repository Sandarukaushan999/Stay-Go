const mongoose = require('mongoose');
const { SLEEP_SCHEDULE, SOCIAL_HABITS, STUDY_HABITS } = require('../constants/enums');

const studentProfileSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        whatsApp: { type: String, required: true, trim: true },
        gender: { type: String, required: true, trim: true },
        age: { type: Number, required: true, min: 1 },
        sleepSchedule: {
            type: String,
            required: true,
            enum: Object.values(SLEEP_SCHEDULE),
        },
        cleanliness: { type: Number, required: true, min: 1, max: 5 },
        socialHabits: {
            type: String,
            required: true,
            enum: Object.values(SOCIAL_HABITS),
        },
        studyHabits: {
            type: String,
            required: true,
            enum: Object.values(STUDY_HABITS),
        },
        profileCompleted: { type: Boolean, default: false },
        roomPreferenceCompleted: { type: Boolean, default: false },
        finalLockCompleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
