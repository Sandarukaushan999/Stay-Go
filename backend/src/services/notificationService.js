const Notification = require('../models/Notification');
const User = require('../models/User');
const { ROLES } = require('../constants/roles');
const { getSocket } = require('../config/socket');

async function createNotification({ userId, title, message, type = 'system', payload = {} }) {
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    payload,
  });

  const io = getSocket();
  if (io) {
    io.to(`user:${userId}`).emit('notification:new', notification);
  }

  return notification;
}

async function notifyAdmins({ title, message, type = 'admin', payload = {} }) {
  const admins = await User.find({ role: ROLES.ADMIN, isBlocked: false }).select('_id');
  const tasks = admins.map((admin) =>
    createNotification({
      userId: admin._id,
      title,
      message,
      type,
      payload,
    })
  );

  await Promise.all(tasks);
}

module.exports = {
  createNotification,
  notifyAdmins,
};
