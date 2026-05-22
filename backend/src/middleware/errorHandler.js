/**
 * Centralized Error Handler Middleware
 * 
 * Catches all errors passed via next(error) from controllers.
 * Returns a consistent JSON error response with appropriate HTTP status codes.
 * Logs errors to the console for debugging during development.
 */

const errorHandler = (err, req, res, _next) => {
  console.error('[ERROR]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Default to 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
