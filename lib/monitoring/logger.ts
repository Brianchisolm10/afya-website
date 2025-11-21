/**
 * Structured Logger
 * 
 * Provides structured logging with context management and integration
 * with error tracking services like Sentry.
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  userId?: string;
  clientId?: string;
  packetId?: string;
  operation?: string;
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: LogContext;
  data?: any;
}

class Logger {
  private context: LogContext = {};

  /**
   * Set context that will be included in all subsequent logs
   */
  setContext(context: LogContext) {
    this.context = { ...this.context, ...context };
  }

  /**
   * Clear all context
   */
  clearContext() {
    this.context = {};
  }

  /**
   * Get current context
   */
  getContext(): LogContext {
    return { ...this.context };
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, data?: any) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.context,
      data,
    };

    // Console output (structured JSON in production, pretty in development)
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(logEntry));
    } else {
      const consoleMethod = level === LogLevel.ERROR ? 'error' : 
                           level === LogLevel.WARN ? 'warn' : 'log';
      console[consoleMethod](
        `[${level.toUpperCase()}] ${message}`,
        this.context,
        data || ''
      );
    }

    // TODO: Send to external logging service (Sentry, Logtail, etc.)
    // This can be implemented when monitoring services are configured
    // Example:
    // if (process.env.SENTRY_DSN) {
    //   Sentry.addBreadcrumb({
    //     category: 'log',
    //     message,
    //     level: level as any,
    //     data: { ...this.context, ...data },
    //   });
    // }
  }

  /**
   * Log debug message (only in development)
   */
  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, data);
    }
  }

  /**
   * Log info message
   */
  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | unknown, data?: any) {
    const errorData = {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...data,
    };
    
    this.log(LogLevel.ERROR, message, errorData);
  }

  /**
   * Create a child logger with additional context
   */
  child(context: LogContext): Logger {
    const childLogger = new Logger();
    childLogger.setContext({ ...this.context, ...context });
    return childLogger;
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for creating child loggers
export { Logger };
