const { validationResult } = require('express-validator');
const Room = require('../models/Room');
const StudentProfile = require('../models/StudentProfile');
const RoomPreference = require('../models/RoomPreference');
const { updateRoomAvailability } = require('../services/roomService');
const { createNotification } = require('../services/roommateNotificationService');
const { NOTIFICATION_TYPE } = require('../constants/enums');
const ApiError = require('../utils/apiError');
const { sendSuccess } = require('../utils/apiResponse');

function checkValidation(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, 'Validation failed', errors.array());
    }
}

// GET /api/rooms — list all rooms with optional query filters
exports.listRooms = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.block) filter.block = req.query.block;
        if (req.query.floor) filter.floor = req.query.floor;
        if (req.query.acType) filter.acType = req.query.acType;
        if (req.query.roomPosition) filter.roomPosition = req.query.roomPosition;
        if (req.query.availabilityStatus) filter.availabilityStatus = req.query.availabilityStatus;

        const rooms = await Room.find(filter).sort({ roomNumber: 1 });
        sendSuccess(res, 'Rooms retrieved', rooms);
    } catch (err) {
        next(err);
    }
};

// GET /api/rooms/available — rooms filtered by current student's saved preferences
exports.listAvailableRooms = async (req, res, next) => {
    try {
        // Load current student and verify eligibility
        const student = await StudentProfile.findById(req.studentId);
        if (!student) throw new ApiError(404, 'Student profile not found');
        if (!student.profileCompleted) {
            throw new ApiError(400, 'Complete your profile first');
        }
        if (!student.roomPreferenceCompleted) {
            throw new ApiError(400, 'Set your room preference first');
        }

        // Load saved room preference
        const pref = await RoomPreference.findOne({ studentId: req.studentId });
        if (!pref) {
            throw new ApiError(404, 'Room preference record not found');
        }

        // Build filter from the student's saved preference
        const filter = {
            availabilityStatus: { $in: ['AVAILABLE', 'PARTIALLY_FILLED'] },
            acType: pref.acType,
            roomPosition: pref.roomPosition,
            capacity: pref.capacity,
        };

        // Block/floor are soft filters: include them to narrow results when
        // the student has a preference, but a future iteration could make
        // this optional or show block/floor as "preferred" in results.
        if (pref.block) filter.block = pref.block;
        if (pref.floor) filter.floor = pref.floor;

        const rooms = await Room.find(filter).sort({ roomNumber: 1 });
        sendSuccess(res, 'Available rooms retrieved', rooms);
    } catch (err) {
        next(err);
    }
};

// POST /api/rooms — admin create room
exports.createRoom = async (req, res, next) => {
    try {
        checkValidation(req);
        const room = await Room.create(req.body);
        sendSuccess(res, 'Room created', room, 201);
    } catch (err) {
        next(err);
    }
};

// PUT /api/rooms/:id — admin update room
exports.updateRoom = async (req, res, next) => {
    try {
        checkValidation(req);
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!room) throw new ApiError(404, 'Room not found');
        sendSuccess(res, 'Room updated', room);
    } catch (err) {
        next(err);
    }
};

// PATCH /api/rooms/:id/status — admin update availability status
exports.updateRoomStatus = async (req, res, next) => {
    try {
        checkValidation(req);
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            { availabilityStatus: req.body.availabilityStatus },
            { new: true, runValidators: true }
        );
        if (!room) throw new ApiError(404, 'Room not found');
        sendSuccess(res, 'Room status updated', room);
    } catch (err) {
        next(err);
    }
};

// POST /api/rooms/:id/assign-student/:studentId — admin assign student to room
exports.assignStudent = async (req, res, next) => {
    try {
        const { id: roomId, studentId } = req.params;

        const room = await Room.findById(roomId);
        if (!room) throw new ApiError(404, 'Room not found');

        const student = await StudentProfile.findById(studentId);
        if (!student) throw new ApiError(404, 'Student not found');

        // Check if already assigned
        if (room.assignedStudents.includes(studentId)) {
            throw new ApiError(409, 'Student already assigned to this room');
        }

        // Check capacity
        if (room.occupancyCount >= room.capacity) {
            throw new ApiError(400, 'Room is at full capacity');
        }

        room.assignedStudents.push(studentId);
        await room.save();
        await updateRoomAvailability(roomId);

        // Notify the student about room assignment
        await createNotification(
            studentId,
            NOTIFICATION_TYPE.ROOM_CHANGED,
            'Room Assigned',
            `You have been assigned to room ${room.roomNumber}.`,
            room._id
        );

        const updatedRoom = await Room.findById(roomId);
        sendSuccess(res, 'Student assigned to room', updatedRoom);
    } catch (err) {
        next(err);
    }
};
