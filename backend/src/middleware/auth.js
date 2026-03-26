const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing bearer token' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'User is blocked by admin' });
    }

    req.user = user;
    req.auth = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireRole(roles) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return function roleMiddleware(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden for this role' });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};
