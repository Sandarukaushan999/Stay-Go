const { validationResult } = require('express-validator');
const StudentProfile = require('../models/StudentProfile');
const ApiError = require('../utils/apiError');
const { sendSuccess } = require('../utils/apiResponse');

// Helper: check validation result
function checkValidation(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, 'Validation failed', errors.array());
    }
}

// Helper: determine if all required profile fields are present
function isProfileComplete(data) {
    const required = [
        'firstName', 'lastName', 'address', 'email', 'whatsApp',
        'gender', 'age', 'sleepSchedule', 'cleanliness', 'socialHabits', 'studyHabits',
    ];
    return required.every((f) => data[f] !== undefined && data[f] !== null && data[f] !== '');
}

// POST /api/students/profile
exports.createProfile = async (req, res, next) => {
    try {
        checkValidation(req);

        // Check if this student already has a profile (by dev-auth id)
        const existing = await StudentProfile.findById(req.studentId);
        if (existing) {
            throw new ApiError(409, 'Profile already exists for this student');
        }

        const profileData = {
            _id: req.studentId, // tie profile doc ID to the auth identity
            ...req.body,
        };
        profileData.profileCompleted = isProfileComplete(profileData);

        const profile = await StudentProfile.create(profileData);
        sendSuccess(res, 'Profile created successfully', profile, 201);
    } catch (err) {
        next(err);
    }
};

// GET /api/students/profile/me
exports.getMyProfile = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findById(req.studentId);
        if (!profile) throw new ApiError(404, 'Profile not found');
        sendSuccess(res, 'Profile retrieved', profile);
    } catch (err) {
        next(err);
    }
};

// PUT /api/students/profile/me
exports.updateMyProfile = async (req, res, next) => {
    try {
        checkValidation(req);

        const profile = await StudentProfile.findById(req.studentId);
        if (!profile) throw new ApiError(404, 'Profile not found');

        // Prevent profile edits if already locked
        if (profile.finalLockCompleted) {
            throw new ApiError(403, 'Profile cannot be edited after roommate lock');
        }

        Object.assign(profile, req.body);
        profile.profileCompleted = isProfileComplete(profile.toObject());
        await profile.save();

        sendSuccess(res, 'Profile updated successfully', profile);
    } catch (err) {
        next(err);
    }
};

// GET /api/students/:id — public-safe summary (no WhatsApp)
exports.getStudentById = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findById(req.params.id).select(
            '-whatsApp -__v'
        );
        if (!profile) throw new ApiError(404, 'Student not found');
        sendSuccess(res, 'Student retrieved', profile);
    } catch (err) {
        next(err);
    }
};
