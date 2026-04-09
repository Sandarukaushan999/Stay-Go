/**
 * Send a consistent success JSON response.
 */
const sendSuccess = (res, message, data = null, statusCode = 200) => {
    const payload = { success: true, message };
    if (data !== null) payload.data = data;
    return res.status(statusCode).json(payload);
};

module.exports = { sendSuccess };
