const jwt = require('jsonwebtoken');
const env = require('../config/env');

function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: String(user._id),
      role: user.role,
      email: user.email,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtTtl,
    }
  );
}

module.exports = {
  generateAccessToken,
};
