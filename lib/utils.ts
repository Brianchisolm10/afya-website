/**
 * Utility Functions
 * 
 * This module provides validation helpers, error handling utilities,
 * and common functions used throughout the application.
 */

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates email format using RFC 5322 compliant regex
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates that a string is not empty after trimming
 */
export function isNonEmptyString(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates that a value is a positive number
 */
export function isPositiveNumber(value: any): boolean {
  const num = Number(value);
  return !isNaN(num) && num > 0;
}

/**
 * Validates that a value is within a range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validates URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 1000); // Limit length
}

// ============================================================================
// Error Types
// ============================================================================

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code: string = 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(
    message: string = 'Authentication required',
    public code: string = 'AUTHENTICATION_ERROR'
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(
    message: string = 'Insufficient permissions',
    public code: string = 'AUTHORIZATION_ERROR'
  ) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  constructor(
    message: string = 'Resource not found',
    public resource?: string,
    public code: string = 'NOT_FOUND'
  ) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  constructor(
    message: string = 'Resource already exists',
    public field?: string,
    public code: string = 'CONFLICT'
  ) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class DatabaseError extends Error {
  constructor(
    message: string = 'Database operation failed',
    public originalError?: any,
    public code: string = 'DATABASE_ERROR'
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ExternalServiceError extends Error {
  constructor(
    message: string = 'External service error',
    public service?: string,
    public code: string = 'EXTERNAL_SERVICE_ERROR'
  ) {
    super(message);
    this.name = 'ExternalServiceError';
  }
}

// ============================================================================
// Error Handling Utilities
// ============================================================================

/**
 * Standard error response format for API endpoints
 */
export interface ErrorResponse {
  error: string;
  code?: string;
  field?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

/**
 * Formats error for API response with standardized structure
 */
export function formatErrorResponse(error: Error): ErrorResponse {
  const timestamp = new Date().toISOString();

  if (error instanceof ValidationError) {
    return {
      error: error.message,
      code: error.code,
      field: error.field,
      timestamp,
    };
  }

  if (error instanceof AuthenticationError) {
    return {
      error: error.message,
      code: error.code,
      timestamp,
    };
  }

  if (error instanceof AuthorizationError) {
    return {
      error: error.message,
      code: error.code,
      timestamp,
    };
  }

  if (error instanceof NotFoundError) {
    return {
      error: error.message,
      code: error.code,
      timestamp,
    };
  }

  if (error instanceof ConflictError) {
    return {
      error: error.message,
      code: error.code,
      field: error.field,
      timestamp,
    };
  }

  // Generic error - don't expose internal details
  return {
    error: 'An unexpected error occurred. Please try again.',
    code: 'INTERNAL_ERROR',
    timestamp,
  };
}

/**
 * Gets appropriate HTTP status code for error type
 */
export function getErrorStatusCode(error: Error): number {
  if (error instanceof ValidationError) return 400;
  if (error instanceof AuthenticationError) return 401;
  if (error instanceof AuthorizationError) return 403;
  if (error instanceof NotFoundError) return 404;
  if (error instanceof ConflictError) return 409;
  if (error instanceof DatabaseError) return 500;
  if (error instanceof ExternalServiceError) return 502;
  return 500;
}

/**
 * Error severity levels
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Determines error severity based on error type
 */
export function getErrorSeverity(error: Error): ErrorSeverity {
  if (error instanceof AuthenticationError) return 'high';
  if (error instanceof AuthorizationError) return 'high';
  if (error instanceof DatabaseError) return 'critical';
  if (error instanceof ExternalServiceError) return 'medium';
  if (error instanceof ValidationError) return 'low';
  if (error instanceof NotFoundError) return 'low';
  if (error instanceof ConflictError) return 'medium';
  return 'medium';
}

/**
 * Logs error with appropriate level and context
 */
export function logError(
  error: Error,
  context?: Record<string, any>
): void {
  const timestamp = new Date().toISOString();
  const severity = getErrorSeverity(error);
  
  const errorInfo = {
    timestamp,
    severity,
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    ...context,
  };

  // In production, this would send to a logging service like Sentry
  if (process.env.NODE_ENV === 'production') {
    console.error('[ERROR]', JSON.stringify(errorInfo));
  } else {
    console.error('[ERROR]', errorInfo);
  }
}

/**
 * Handles Prisma errors and converts them to custom error types
 */
export function handlePrismaError(error: any): Error {
  // Unique constraint violation
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'field';
    return new ConflictError(
      `A record with this ${field} already exists`,
      field,
      'DUPLICATE_ENTRY'
    );
  }

  // Record not found
  if (error.code === 'P2025') {
    return new NotFoundError('Record not found', undefined, 'RECORD_NOT_FOUND');
  }

  // Foreign key constraint violation
  if (error.code === 'P2003') {
    return new ValidationError(
      'Invalid reference to related record',
      undefined,
      'INVALID_REFERENCE'
    );
  }

  // Generic database error
  return new DatabaseError('Database operation failed', error);
}

/**
 * Centralized error handler for API routes
 * Logs the error, formats the response, and returns appropriate status code
 */
export function handleApiError(
  error: unknown,
  context?: Record<string, any>
): { response: ErrorResponse; statusCode: number } {
  // Convert unknown error to Error instance
  const err = error instanceof Error ? error : new Error(String(error));
  
  // Handle Prisma errors
  const handledError = err.name === 'PrismaClientKnownRequestError' 
    ? handlePrismaError(err) 
    : err;
  
  // Log the error with context
  logError(handledError, context);
  
  // Format error response
  const response = formatErrorResponse(handledError);
  const statusCode = getErrorStatusCode(handledError);
  
  return { response, statusCode };
}

// ============================================================================
// Retry Logic
// ============================================================================

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: Error) => boolean;
}

/**
 * Retries an async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    shouldRetry = (error) => {
      // Retry on network errors and 5xx errors
      return (
        error instanceof ExternalServiceError ||
        error instanceof DatabaseError ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('ETIMEDOUT')
      );
    },
  } = options;

  let lastError: Error;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Don't retry if this is the last attempt or if error is not retryable
      if (attempt === maxAttempts || !shouldRetry(lastError)) {
        throw lastError;
      }

      // Log retry attempt
      logError(lastError, {
        attempt,
        maxAttempts,
        nextRetryIn: currentDelay,
      });

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, currentDelay));

      // Increase delay for next attempt (exponential backoff)
      currentDelay *= backoffMultiplier;
    }
  }

  throw lastError!;
}

// ============================================================================
// Data Formatting Utilities
// ============================================================================

/**
 * Formats a date to ISO string or returns null
 */
export function formatDate(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  try {
    return new Date(date).toISOString();
  } catch {
    return null;
  }
}

/**
 * Safely parses JSON with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Truncates text to specified length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
