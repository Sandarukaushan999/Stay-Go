function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    message,
    details: error.details || null,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
