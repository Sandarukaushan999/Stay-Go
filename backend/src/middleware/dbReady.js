const mongoose = require('mongoose');

function requireDbConnection(req, res, next) {
  if (req.path === '/health') {
    return next();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is currently unavailable. Please retry once MongoDB connection is restored.',
    });
  }

  return next();
}

module.exports = {
  requireDbConnection,
};

