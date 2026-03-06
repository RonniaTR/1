/**
 * ================================================
 * REQUEST LOGGER MIDDLEWARE
 * ================================================
 * 
 * Logs all incoming HTTP requests with response details
 * Uses res.on('finish') for proper Express 4.x compatibility
 * Prevents memory leaks from wrapping response methods
 * 
 * Logs: timestamp, method, path, status code, duration, IP, user agent
 */

const logger = (req, res, next) => {
  const startTime = Date.now();

  // Use res.on('finish') for memory-safe logging (Express 4.x best practice)
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    // Build log message
    const logMessage = {
      timestamp,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    };

    // Color coding for different HTTP status codes
    let color = '';
    if (res.statusCode >= 200 && res.statusCode < 300) {
      color = '\x1b[32m'; // Green (success)
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      color = '\x1b[36m'; // Cyan (redirect)
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      color = '\x1b[33m'; // Yellow (client error)
    } else if (res.statusCode >= 500) {
      color = '\x1b[31m'; // Red (server error)
    }

    const reset = '\x1b[0m';

    console.log(
      `${color}[${logMessage.timestamp}] ${logMessage.method} ${logMessage.path} - ${logMessage.status} ${logMessage.duration}${reset}`
    );
  });

  next();
};

module.exports = logger;
