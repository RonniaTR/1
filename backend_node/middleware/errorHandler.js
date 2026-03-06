/**
 * ================================================
 * ERROR HANDLER MIDDLEWARE
 * ================================================
 * 
 * Centralized error handling for all routes
 * - Catches and formats errors consistently
 * - Sanitizes error messages in production
 * - Classifies errors (validation, auth, server)
 * - Logs detailed error information
 * - Prevents sensitive data leaks (stack traces, DB info)
 */

const errorHandler = (err, req, res, next) => {
  // Extract error properties
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || {};
  let endpoint = err.endpoint || req.path;

  // Validate status is a number in valid HTTP range
  if (typeof status !== 'number' || status < 100 || status > 599) {
    status = 500;
  }

  // Classify error type for better handling
  let errorType = 'InternalServerError';
  if (status >= 400 && status < 500) {
    errorType = 'ClientError';
  }
  if (status === 400) {
    errorType = 'ValidationError';
  }
  if (status === 401 || status === 403) {
    errorType = 'AuthenticationError';
  }
  if (status === 404) {
    errorType = 'NotFoundError';
  }

  // Sanitize error message in production (don't expose internal details)
  if (process.env.NODE_ENV === 'production') {
    if (status >= 500) {
      message = 'An internal server error occurred. Please try again later.';
      details = {}; // Remove details in production
    }
    // Don't expose stack trace in production
    if (err.stack) {
      delete err.stack;
    }
  }

  // Log error with full details for debugging
  const errorLog = {
    status,
    errorType,
    message,
    path: endpoint,
    method: req.method,
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details,
      originalError: err
    })
  };

  // Use appropriate log level
  if (status >= 500) {
    console.error('\n🔴 SERVER ERROR:', errorLog);
  } else if (status >= 400) {
    console.warn('\n🟡 CLIENT ERROR:', errorLog);
  }

  // Build response object
  const errorResponse = {
    error: {
      status,
      type: errorType,
      message,
      timestamp: new Date().toISOString(),
      endpoint
    }
  };

  // Include details only in development or for validation errors
  if ((process.env.NODE_ENV === 'development' || status === 400) && Object.keys(details).length > 0) {
    errorResponse.error.details = details;
  }

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    errorResponse.error.stack = err.stack;
  }

  // Send error response
  res.status(status).json(errorResponse);
};

/**
 * Custom APIError class for consistent error handling
 * Usage: throw new APIError('Message', 400, { field: 'description' })
 */
class APIError extends Error {
  constructor(message, status = 500, details = {}) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = errorHandler;
module.exports.APIError = APIError;
