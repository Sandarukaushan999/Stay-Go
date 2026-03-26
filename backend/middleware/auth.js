const jwt = require('jsonwebtoken');

// This middleware checks if the user is logged in
// It reads the JWT token from the request header
// If token is valid, user info is added to req.user so other routes can use it
const auth = (req, res, next) => {
  try {
    // Get the token from Authorization header (format: "Bearer <token>")
    const authHeader = req.header('Authorization');

    // If no token provided, block the request
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided. Please login first.' });
    }

    // Remove "Bearer " part and get only the token string
    const token = authHeader.replace('Bearer ', '');

    // Verify the token using our secret key
    // If valid, decoded will contain user data (id, role, name)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request so controllers can use it
    req.user = decoded;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // If token is invalid or expired, block the request
    res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }
};

// This middleware checks if the user has the correct role
// For example, only admin can assign technicians, only student can submit tickets
// Usage: roleCheck('admin') or roleCheck('student', 'admin') for multiple roles
const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user info exists (auth middleware should run before this)
    if (!req.user) {
      return res.status(401).json({ message: 'Please login first.' });
    }

    // Check if the user's role is in the allowed roles list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to do this action.'
      });
    }

    // User has the correct role, continue to route handler
    next();
  };
};

module.exports = { auth, roleCheck };
