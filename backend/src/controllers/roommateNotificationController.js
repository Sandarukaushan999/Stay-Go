const Notification = require('../models/RoommateNotification');
const ApiError = require('../utils/apiError');
const { sendSuccess } = require('../utils/apiResponse');

// GET /api/notifications/me
exports.getMyNotifications = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
        const skip = (page - 1) * limit;

        const [notifications, total] = await Promise.all([
            Notification.find({ studentId: req.studentId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Notification.countDocuments({ studentId: req.studentId }),
        ]);

        const unreadCount = await Notification.countDocuments({
            studentId: req.studentId,
            isRead: false,
        });

        sendSuccess(res, 'Notifications retrieved', {
            notifications,
            unreadCount,
            page,
            totalPages: Math.ceil(total / limit),
            total,
        });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/notifications/:id/read
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, studentId: req.studentId },
            { isRead: true },
            { new: true }
        );
        if (!notification) throw new ApiError(404, 'Notification not found');
        sendSuccess(res, 'Notification marked as read', notification);
    } catch (err) {
        next(err);
    }
};

// PATCH /api/notifications/read-all
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { studentId: req.studentId, isRead: false },
            { isRead: true }
        );
        sendSuccess(res, 'All notifications marked as read');
    } catch (err) {
        next(err);
    }
};
