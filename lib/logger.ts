/**
 * Production-safe logger utility
 * Logs only in development, sends errors to Sentry in production
 */

// Check if we're in production
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

interface LogContext {
  [key: string]: any;
}

export const logger = {
  /**
   * Log general information (development only)
   */
  log: (message: string, context?: LogContext) => {
    if (isDevelopment) {
      if (context) {
        console.log(`[LOG] ${message}`, context);
      } else {
        console.log(`[LOG] ${message}`);
      }
    }
  },

  /**
   * Log informational messages (development only)
   */
  info: (message: string, context?: LogContext) => {
    if (isDevelopment) {
      if (context) {
        console.info(`[INFO] ${message}`, context);
      } else {
        console.info(`[INFO] ${message}`);
      }
    }
  },

  /**
   * Log warnings (always logged, sanitized in production)
   */
  warn: (message: string, context?: LogContext) => {
    if (isProduction) {
      // In production, log warnings but sanitize sensitive data
      console.warn(`[WARN] ${message}`);
      // Could also send to monitoring service
    } else {
      if (context) {
        console.warn(`[WARN] ${message}`, context);
      } else {
        console.warn(`[WARN] ${message}`);
      }
    }
  },

  /**
   * Log errors (always logged, sent to Sentry in production)
   */
  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    if (isProduction) {
      // In production, log errors and send to Sentry
      console.error(`[ERROR] ${message}`);
      
      // If Sentry is available, capture the error
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error || new Error(message), {
          extra: context
        });
      }
    } else {
      // In development, log full error details
      console.error(`[ERROR] ${message}`);
      if (error) {
        console.error(error);
      }
      if (context) {
        console.error('Context:', context);
      }
    }
  },

  /**
   * Log debug information (development only)
   */
  debug: (message: string, context?: LogContext) => {
    if (isDevelopment) {
      if (context) {
        console.debug(`[DEBUG] ${message}`, context);
      } else {
        console.debug(`[DEBUG] ${message}`);
      }
    }
  },

  /**
   * Log successful operations (development only)
   */
  success: (message: string, context?: LogContext) => {
    if (isDevelopment) {
      if (context) {
        console.log(`✅ [SUCCESS] ${message}`, context);
      } else {
        console.log(`✅ [SUCCESS] ${message}`);
      }
    }
  }
};

// Export a server-side version that can be used in API routes
export const serverLogger = {
  ...logger,
  
  /**
   * Log API requests (sanitized in production)
   */
  apiRequest: (method: string, path: string, context?: LogContext) => {
    if (isDevelopment) {
      logger.info(`API ${method} ${path}`, context);
    }
  },

  /**
   * Log API responses (sanitized in production)
   */
  apiResponse: (method: string, path: string, status: number, duration?: number) => {
    if (isDevelopment) {
      logger.info(`API ${method} ${path} -> ${status}${duration ? ` (${duration}ms)` : ''}`);
    }
  }
};
