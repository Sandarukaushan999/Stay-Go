const Room = require('../models/Room');
const { AVAILABILITY_STATUS } = require('../constants/enums');

/**
 * Recalculate and persist the availability status of a room
 * based on its current occupancy vs capacity.
 */
async function updateRoomAvailability(roomId) {
    const room = await Room.findById(roomId);
    if (!room) return null;

    room.occupancyCount = room.assignedStudents.length;

    if (room.occupancyCount === 0) {
        room.availabilityStatus = AVAILABILITY_STATUS.AVAILABLE;
    } else if (room.occupancyCount < room.capacity) {
        room.availabilityStatus = AVAILABILITY_STATUS.PARTIALLY_FILLED;
    } else {
        room.availabilityStatus = AVAILABILITY_STATUS.FULL;
    }

    await room.save();
    return room;
}

module.exports = { updateRoomAvailability };
