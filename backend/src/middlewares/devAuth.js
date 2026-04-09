const ApiError = require('../utils/apiError');
const { ROLES } = require('../constants/enums');

/**
 * Development-only auth simulation.
 *
 * Reads identity from request headers:
 *   x-student-id  – the ObjectId of the acting student
 *   x-role        – "student" or "admin"
 *
 * Falls back to env defaults so you can set a "current user" in .env
 * and skip headers during quick manual testing.
 *
 * Replace this middleware with real JWT verification when auth is ready.
 */
const devAuth = (req, _res, next) => {
    const studentId =
        req.headers['x-student-id'] || process.env.DEV_CURRENT_STUDENT_ID || '';
    const role =
        req.headers['x-role'] || process.env.DEV_CURRENT_ROLE || ROLES.STUDENT;

    if (!studentId) {
        return next(
            new ApiError(401, 'Missing x-student-id header (dev auth)')
        );
    }

    req.studentId = studentId;
    req.role = role;
    next();
};

/**
 * Restrict a route to admin role only.
 */
const adminOnly = (req, _res, next) => {
    if (req.role !== ROLES.ADMIN) {
        return next(new ApiError(403, 'Admin access required'));
    }
    next();
};

module.exports = { devAuth, adminOnly };
