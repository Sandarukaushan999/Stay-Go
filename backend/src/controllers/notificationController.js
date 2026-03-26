const Notification = require('../models/Notification');

async function listMyNotifications(req, res) {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(200);

  return res.json({ notifications });
}

async function markNotificationRead(req, res) {
  const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  notification.isRead = true;
  await notification.save();

  return res.json({ notification });
}

module.exports = {
  listMyNotifications,
  markNotificationRead,
};
