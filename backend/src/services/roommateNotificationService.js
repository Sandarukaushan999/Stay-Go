const Notification = require('../models/RoommateNotification');

/**
 * Create and persist a notification for a student.
 */
async function createNotification(studentId, type, title, message, relatedEntityId = null) {
    const notification = await Notification.create({
        studentId,
        type,
        title,
        message,
        relatedEntityId,
    });
    return notification;
}

module.exports = { createNotification };
