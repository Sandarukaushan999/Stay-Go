const { validationResult } = require('express-validator');
const StudentProfile = require('../models/StudentProfile');
const MatchRequest = require('../models/MatchRequest');
const MatchPair = require('../models/MatchPair');
const RoomPreference = require('../models/RoomPreference');
const { getSuggestions, validateCompatibility } = require('../services/matchingService');
const { createNotification } = require('../services/roommateNotificationService');
const { MATCH_REQUEST_STATUS, NOTIFICATION_TYPE } = require('../constants/enums');
const ApiError = require('../utils/apiError');
const { sendSuccess } = require('../utils/apiResponse');

function checkValidation(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, 'Validation failed', errors.array());
    }
}

// ── GET /api/matching/suggestions ──
exports.getSuggestions = async (req, res, next) => {
    try {
        const student = await StudentProfile.findById(req.studentId);
        if (!student) throw new ApiError(404, 'Profile not found');
        if (!student.profileCompleted) {
            throw new ApiError(400, 'Complete your profile first');
        }
        if (!student.roomPreferenceCompleted) {
            throw new ApiError(400, 'Set your room preference first');
        }
        if (student.finalLockCompleted) {
            throw new ApiError(400, 'You already have a locked roommate');
        }

        const suggestions = await getSuggestions(req.studentId);
        sendSuccess(res, 'Suggestions retrieved', suggestions);
    } catch (err) {
        next(err);
    }
};

// ── POST /api/matching/requests/:receiverStudentId ──
exports.sendRequest = async (req, res, next) => {
    try {
        checkValidation(req);
        const senderId = req.studentId;
        const { receiverStudentId } = req.params;

        // No self-request
        if (senderId === receiverStudentId) {
            throw new ApiError(400, 'Cannot send a request to yourself');
        }

        // Full compatibility check — enforces the same business rules as the
        // suggestion engine: both profiles complete, both room preferences
        // exist, same gender, same acType/roomPosition/capacity.
        const { sender, visibleScore } = await validateCompatibility(senderId, receiverStudentId);

        // No duplicate active pending request between same pair (either direction)
        const existingRequest = await MatchRequest.findOne({
            $or: [
                { senderStudentId: senderId, receiverStudentId, status: MATCH_REQUEST_STATUS.PENDING },
                { senderStudentId: receiverStudentId, receiverStudentId: senderId, status: MATCH_REQUEST_STATUS.PENDING },
            ],
        });
        if (existingRequest) {
            throw new ApiError(409, 'An active request already exists between you and this student');
        }

        const matchRequest = await MatchRequest.create({
            senderStudentId: senderId,
            receiverStudentId,
            compatibilityScore: visibleScore,
        });

        // Notify receiver
        await createNotification(
            receiverStudentId,
            NOTIFICATION_TYPE.MATCH_REQUEST_RECEIVED,
            'New Match Request',
            `${sender.firstName} ${sender.lastName} sent you a roommate request (${visibleScore}% match).`,
            matchRequest._id
        );

        sendSuccess(res, 'Match request sent', matchRequest, 201);
    } catch (err) {
        next(err);
    }
};

// ── GET /api/matching/requests/sent ──
exports.getSentRequests = async (req, res, next) => {
    try {
        const requests = await MatchRequest.find({ senderStudentId: req.studentId })
            .populate('receiverStudentId', 'firstName lastName gender age')
            .sort({ createdAt: -1 });
        sendSuccess(res, 'Sent requests retrieved', requests);
    } catch (err) {
        next(err);
    }
};

// ── GET /api/matching/requests/received ──
exports.getReceivedRequests = async (req, res, next) => {
    try {
        const requests = await MatchRequest.find({ receiverStudentId: req.studentId })
            .populate('senderStudentId', 'firstName lastName gender age')
            .sort({ createdAt: -1 });
        sendSuccess(res, 'Received requests retrieved', requests);
    } catch (err) {
        next(err);
    }
};

// ── PATCH /api/matching/requests/:requestId/accept ──
exports.acceptRequest = async (req, res, next) => {
    try {
        const request = await MatchRequest.findById(req.params.requestId);
        if (!request) throw new ApiError(404, 'Request not found');

        // Only the receiver can accept
        if (request.receiverStudentId.toString() !== req.studentId) {
            throw new ApiError(403, 'Only the receiver can accept this request');
        }
        if (request.status !== MATCH_REQUEST_STATUS.PENDING) {
            throw new ApiError(400, `Cannot accept a request with status: ${request.status}`);
        }

        // Verify neither student is already locked
        const sender = await StudentProfile.findById(request.senderStudentId);
        const receiver = await StudentProfile.findById(request.receiverStudentId);
        if (sender.finalLockCompleted || receiver.finalLockCompleted) {
            throw new ApiError(400, 'One or both students already have a locked roommate');
        }

        // Accept the request
        request.status = MATCH_REQUEST_STATUS.ACCEPTED;
        request.respondedAt = new Date();
        await request.save();

        // Cancel all other pending requests involving either student
        await MatchRequest.updateMany(
            {
                _id: { $ne: request._id },
                status: MATCH_REQUEST_STATUS.PENDING,
                $or: [
                    { senderStudentId: { $in: [request.senderStudentId, request.receiverStudentId] } },
                    { receiverStudentId: { $in: [request.senderStudentId, request.receiverStudentId] } },
                ],
            },
            { status: MATCH_REQUEST_STATUS.CANCELLED, respondedAt: new Date() }
        );

        // Create locked pair
        const pair = await MatchPair.create({
            studentA: request.senderStudentId,
            studentB: request.receiverStudentId,
            compatibilityScore: request.compatibilityScore,
            isLocked: true,
            lockedAt: new Date(),
        });

        // Mark both students as locked
        sender.finalLockCompleted = true;
        receiver.finalLockCompleted = true;
        await sender.save();
        await receiver.save();

        // Notify both students
        await createNotification(
            request.senderStudentId,
            NOTIFICATION_TYPE.MATCH_REQUEST_ACCEPTED,
            'Request Accepted',
            `${receiver.firstName} ${receiver.lastName} accepted your roommate request!`,
            pair._id
        );
        await createNotification(
            request.receiverStudentId,
            NOTIFICATION_TYPE.ROOMMATE_PAIR_LOCKED,
            'Roommate Locked',
            `You and ${sender.firstName} ${sender.lastName} are now roommates!`,
            pair._id
        );
        await createNotification(
            request.senderStudentId,
            NOTIFICATION_TYPE.ROOMMATE_PAIR_LOCKED,
            'Roommate Locked',
            `You and ${receiver.firstName} ${receiver.lastName} are now roommates!`,
            pair._id
        );

        sendSuccess(res, 'Request accepted and roommate pair locked', { request, pair });
    } catch (err) {
        next(err);
    }
};

// ── PATCH /api/matching/requests/:requestId/reject ──
exports.rejectRequest = async (req, res, next) => {
    try {
        const request = await MatchRequest.findById(req.params.requestId);
        if (!request) throw new ApiError(404, 'Request not found');

        if (request.receiverStudentId.toString() !== req.studentId) {
            throw new ApiError(403, 'Only the receiver can reject this request');
        }
        if (request.status !== MATCH_REQUEST_STATUS.PENDING) {
            throw new ApiError(400, `Cannot reject a request with status: ${request.status}`);
        }

        request.status = MATCH_REQUEST_STATUS.REJECTED;
        request.respondedAt = new Date();
        await request.save();

        // Notify sender
        const receiver = await StudentProfile.findById(req.studentId);
        await createNotification(
            request.senderStudentId,
            NOTIFICATION_TYPE.MATCH_REQUEST_REJECTED,
            'Request Rejected',
            `${receiver.firstName} ${receiver.lastName} declined your roommate request.`,
            request._id
        );

        sendSuccess(res, 'Request rejected', request);
    } catch (err) {
        next(err);
    }
};

// ── PATCH /api/matching/requests/:requestId/cancel ──
exports.cancelRequest = async (req, res, next) => {
    try {
        const request = await MatchRequest.findById(req.params.requestId);
        if (!request) throw new ApiError(404, 'Request not found');

        if (request.senderStudentId.toString() !== req.studentId) {
            throw new ApiError(403, 'Only the sender can cancel this request');
        }
        if (request.status !== MATCH_REQUEST_STATUS.PENDING) {
            throw new ApiError(400, `Cannot cancel a request with status: ${request.status}`);
        }

        request.status = MATCH_REQUEST_STATUS.CANCELLED;
        request.respondedAt = new Date();
        await request.save();

        sendSuccess(res, 'Request cancelled', request);
    } catch (err) {
        next(err);
    }
};

// ── GET /api/matching/pair/me ──
exports.getMyPair = async (req, res, next) => {
    try {
        const pair = await MatchPair.findOne({
            $or: [{ studentA: req.studentId }, { studentB: req.studentId }],
            isLocked: true,
        })
            .populate('studentA', 'firstName lastName gender age whatsApp sleepSchedule cleanliness socialHabits studyHabits')
            .populate('studentB', 'firstName lastName gender age whatsApp sleepSchedule cleanliness socialHabits studyHabits')
            .populate('roomId');

        if (!pair) {
            return sendSuccess(res, 'No locked pair found', null);
        }

        // WhatsApp is revealed here because the pair is locked
        sendSuccess(res, 'Roommate pair retrieved', pair);
    } catch (err) {
        next(err);
    }
};
