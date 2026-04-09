const StudentProfile = require('../models/StudentProfile');
const RoomPreference = require('../models/RoomPreference');
const MatchPair = require('../models/MatchPair');
const { calculateRawScore, toVisibleScore } = require('../utils/matchScore');

/**
 * Get compatible roommate suggestions for the given student.
 * Returns an array sorted by compatibility score (descending).
 */
async function getSuggestions(studentId) {
    // 1. Fetch current student and their room preference
    const student = await StudentProfile.findById(studentId);
    if (!student) throw new Error('Student not found');

    const roomPref = await RoomPreference.findOne({ studentId });
    if (!roomPref) throw new Error('Room preference not found');

    // 2. Find candidate students
    const candidates = await StudentProfile.find({
        _id: { $ne: studentId },
        gender: student.gender,
        profileCompleted: true,
        roomPreferenceCompleted: true,
        finalLockCompleted: false,
    });

    if (candidates.length === 0) return [];

    // 3. Bulk-fetch room preferences for candidates
    const candidateIds = candidates.map((c) => c._id);
    const candidatePrefs = await RoomPreference.find({
        studentId: { $in: candidateIds },
    });

    const prefMap = {};
    candidatePrefs.forEach((p) => {
        prefMap[p.studentId.toString()] = p;
    });

    // 4. Filter by compatible room preferences and score
    const suggestions = [];

    for (const candidate of candidates) {
        const cPref = prefMap[candidate._id.toString()];
        if (!cPref) continue;

        // Must match on acType, roomPosition, and capacity
        if (
            cPref.acType !== roomPref.acType ||
            cPref.roomPosition !== roomPref.roomPosition ||
            cPref.capacity !== roomPref.capacity
        ) {
            continue;
        }

        const rawScore = calculateRawScore(student, candidate);
        const visibleScore = toVisibleScore(rawScore);

        suggestions.push({
            studentId: candidate._id,
            fullName: `${candidate.firstName} ${candidate.lastName}`,
            gender: candidate.gender,
            age: candidate.age,
            compatibilityScore: visibleScore,
            sleepSchedule: candidate.sleepSchedule,
            cleanliness: candidate.cleanliness,
            socialHabits: candidate.socialHabits,
            studyHabits: candidate.studyHabits,
            roomPreference: {
                block: cPref.block,
                floor: cPref.floor,
                acType: cPref.acType,
                roomPosition: cPref.roomPosition,
                capacity: cPref.capacity,
            },
            // WhatsApp is intentionally NOT included
        });
    }

    // 5. Sort descending by score
    suggestions.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return suggestions;
}

/**
 * Validate that two students are eligible to be matched and have compatible
 * room preferences. Uses the SAME business rules as getSuggestions.
 *
 * Returns { compatible: true, sender, receiver, senderPref, receiverPref, visibleScore }
 * or throws an ApiError with a clear message describing the mismatch.
 */
async function validateCompatibility(senderId, receiverId) {
    const ApiError = require('../utils/apiError');

    // Load both profiles
    const sender = await StudentProfile.findById(senderId);
    if (!sender) throw new ApiError(404, 'Sender profile not found');

    const receiver = await StudentProfile.findById(receiverId);
    if (!receiver) throw new ApiError(404, 'Receiver student not found');

    // Both must have completed profiles
    if (!sender.profileCompleted) {
        throw new ApiError(400, 'Complete your profile before sending a request');
    }
    if (!receiver.profileCompleted) {
        throw new ApiError(400, 'Receiver has not completed their profile');
    }

    // Both must have completed room preferences
    if (!sender.roomPreferenceCompleted) {
        throw new ApiError(400, 'Set your room preference before sending a request');
    }
    if (!receiver.roomPreferenceCompleted) {
        throw new ApiError(400, 'Receiver has not completed their room preference');
    }

    // Neither can be locked
    if (sender.finalLockCompleted) {
        throw new ApiError(400, 'You already have a locked roommate');
    }
    if (receiver.finalLockCompleted) {
        throw new ApiError(400, 'Receiver already has a locked roommate');
    }

    // Load both room preferences
    const senderPref = await RoomPreference.findOne({ studentId: senderId });
    if (!senderPref) {
        throw new ApiError(400, 'Your room preference record is missing');
    }

    const receiverPref = await RoomPreference.findOne({ studentId: receiverId });
    if (!receiverPref) {
        throw new ApiError(400, 'Receiver room preference record is missing');
    }

    // Same gender check
    if (sender.gender !== receiver.gender) {
        throw new ApiError(400, 'Cannot send request: gender mismatch');
    }

    // Room preference compatibility (same rules as suggestion filtering)
    if (senderPref.acType !== receiverPref.acType) {
        throw new ApiError(400, 'Cannot send request: AC type preference mismatch');
    }
    if (senderPref.roomPosition !== receiverPref.roomPosition) {
        throw new ApiError(400, 'Cannot send request: room position preference mismatch');
    }
    if (senderPref.capacity !== receiverPref.capacity) {
        throw new ApiError(400, 'Cannot send request: room capacity preference mismatch');
    }

    // Calculate compatibility score
    const rawScore = calculateRawScore(sender, receiver);
    const visibleScore = toVisibleScore(rawScore);

    return { compatible: true, sender, receiver, senderPref, receiverPref, visibleScore };
}

module.exports = { getSuggestions, validateCompatibility };
