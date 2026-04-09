function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Route not found', path: req.originalUrl });
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
    errors: error.errors || null,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
