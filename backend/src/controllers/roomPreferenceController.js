const { validationResult } = require('express-validator');
const RoomPreference = require('../models/RoomPreference');
const StudentProfile = require('../models/StudentProfile');
const ApiError = require('../utils/apiError');
const { sendSuccess } = require('../utils/apiResponse');

function checkValidation(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, 'Validation failed', errors.array());
    }
}

// POST /api/room-preferences/me — create or upsert
exports.createOrUpdate = async (req, res, next) => {
    try {
        checkValidation(req);

        const student = await StudentProfile.findById(req.studentId);
        if (!student) throw new ApiError(404, 'Student profile not found');
        if (!student.profileCompleted) {
            throw new ApiError(400, 'Complete your profile before setting room preferences');
        }
        if (student.finalLockCompleted) {
            throw new ApiError(403, 'Cannot change room preference after roommate lock');
        }

        const data = { ...req.body, studentId: req.studentId };

        const pref = await RoomPreference.findOneAndUpdate(
            { studentId: req.studentId },
            data,
            { new: true, upsert: true, runValidators: true }
        );

        // Mark roomPreferenceCompleted on student profile
        if (!student.roomPreferenceCompleted) {
            student.roomPreferenceCompleted = true;
            await student.save();
        }

        sendSuccess(res, 'Room preference saved', pref, 200);
    } catch (err) {
        next(err);
    }
};

// GET /api/room-preferences/me
exports.getMyPreference = async (req, res, next) => {
    try {
        const pref = await RoomPreference.findOne({ studentId: req.studentId });
        if (!pref) throw new ApiError(404, 'Room preference not found');
        sendSuccess(res, 'Room preference retrieved', pref);
    } catch (err) {
        next(err);
    }
};

// PUT /api/room-preferences/me
exports.updateMyPreference = async (req, res, next) => {
    try {
        checkValidation(req);

        const student = await StudentProfile.findById(req.studentId);
        if (!student) throw new ApiError(404, 'Student profile not found');
        if (student.finalLockCompleted) {
            throw new ApiError(403, 'Cannot change room preference after roommate lock');
        }

        const pref = await RoomPreference.findOneAndUpdate(
            { studentId: req.studentId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!pref) throw new ApiError(404, 'Room preference not found');

        sendSuccess(res, 'Room preference updated', pref);
    } catch (err) {
        next(err);
    }
};
