/**
 * Logger utility for server-side logging
 * Provides structured logging with different log levels
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const LOG_LEVEL_NAMES = {
  0: "ERROR",
  1: "WARN",
  2: "INFO",
  3: "DEBUG",
};

// Get log level from environment or default to INFO
const getLogLevel = () => {
  const envLevel = process.env.LOG_LEVEL?.toUpperCase();
  return LOG_LEVELS[envLevel] !== undefined ? LOG_LEVELS[envLevel] : LOG_LEVELS.INFO;
};

const currentLogLevel = getLogLevel();

/**
 * Format log message with timestamp and log level
 */
const formatLogMessage = (level, message, metadata = {}) => {
  const timestamp = new Date().toISOString();
  const levelName = LOG_LEVEL_NAMES[level];
  const metadataStr = Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : "";
  
  return `[${timestamp}] [${levelName}] ${message}${metadataStr ? ` ${metadataStr}` : ""}`;
};

/**
 * Log error message
 */
const error = (message, error = null, metadata = {}) => {
  if (currentLogLevel >= LOG_LEVELS.ERROR) {
    const errorMetadata = {
      ...metadata,
      ...(error && {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      }),
    };
    console.error(formatLogMessage(LOG_LEVELS.ERROR, message, errorMetadata));
  }
};

/**
 * Log warning message
 */
const warn = (message, metadata = {}) => {
  if (currentLogLevel >= LOG_LEVELS.WARN) {
    console.warn(formatLogMessage(LOG_LEVELS.WARN, message, metadata));
  }
};

/**
 * Log info message
 */
const info = (message, metadata = {}) => {
  if (currentLogLevel >= LOG_LEVELS.INFO) {
    console.log(formatLogMessage(LOG_LEVELS.INFO, message, metadata));
  }
};

/**
 * Log debug message
 */
const debug = (message, metadata = {}) => {
  if (currentLogLevel >= LOG_LEVELS.DEBUG) {
    console.debug(formatLogMessage(LOG_LEVELS.DEBUG, message, metadata));
  }
};

/**
 * Log HTTP request
 */
const logRequest = (req, metadata = {}) => {
  const requestMetadata = {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("user-agent"),
    ...metadata,
  };
  info(`${req.method} ${req.path}`, requestMetadata);
};

/**
 * Log HTTP response
 */
const logResponse = (req, res, metadata = {}) => {
  const responseMetadata = {
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    ...metadata,
  };
  info(`${req.method} ${req.path} ${res.statusCode}`, responseMetadata);
};

/**
 * Log error with request context
 */
const logError = (message, error, req = null, metadata = {}) => {
  const errorMetadata = {
    ...metadata,
    ...(req && {
      request: {
        method: req.method,
        path: req.path,
        query: req.query,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
      },
    }),
    ...(error && {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
    }),
  };
  error(message, error, errorMetadata);
};

/**
 * Express middleware for request logging
 */
const requestLogger = (req, res, next) => {
  // Log request
  logRequest(req);

  // Log response when finished
  res.on("finish", () => {
    logResponse(req, res);
  });

  next();
};

/**
 * Express middleware for error logging
 */
const errorLogger = (err, req, res, next) => {
  logError("Request error", err, req);
  next(err);
};

export {
  error,
  warn,
  info,
  debug,
  logRequest,
  logResponse,
  logError,
  requestLogger,
  errorLogger,
  LOG_LEVELS,
};

