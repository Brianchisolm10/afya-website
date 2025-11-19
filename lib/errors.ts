/**
 * Error Handling Module
 * 
 * Provides standardized error handling utilities for common scenarios
 * including validation, authentication, and authorization errors.
 */

import { NextResponse } from 'next/server';
import { 
  formatErrorResponse, 
  getErrorStatusCode, 
  logError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  handleApiError,
  type ErrorResponse
} from './utils';
import { 
  logAuthenticationFailure, 
  logAuthorizationFailure,
  logRateLimitViolation 
} from './audit';

// ============================================================================
// Common Error Response Builders
// ============================================================================

/**
 * Creates a standardized validation error response
 */
export function validationError(
  message: string,
  field?: string
): NextResponse<ErrorResponse> {
  const error = new ValidationError(message, field);
  const response = formatErrorResponse(error);
  return NextResponse.json(response, { status: 400 });
}

/**
 * Creates a standardized authentication error response
 */
export function authenticationError(
  message: string = 'Authentication required'
): NextResponse<ErrorResponse> {
  const error = new AuthenticationError(message);
  const response = formatErrorResponse(error);
  return NextResponse.json(response, { status: 401 });
}

/**
 * Creates a standardized authorization error response
 */
export function authorizationError(
  message: string = 'Insufficient permissions'
): NextResponse<ErrorResponse> {
  const error = new AuthorizationError(message);
  const response = formatErrorResponse(error);
  return NextResponse.json(response, { status: 403 });
}

/**
 * Creates a standardized not found error response
 */
export function notFoundError(
  message: string = 'Resource not found',
  resource?: string
): NextResponse<ErrorResponse> {
  const error = new NotFoundError(message, resource);
  const response = formatErrorResponse(error);
  return NextResponse.json(response, { status: 404 });
}

/**
 * Creates a standardized conflict error response
 */
export function conflictError(
  message: string,
  field?: string
): NextResponse<ErrorResponse> {
  const error = new ConflictError(message, field);
  const response = formatErrorResponse(error);
  return NextResponse.json(response, { status: 409 });
}

/**
 * Creates a standardized rate limit error response
 */
export function rateLimitError(
  retryAfter: number,
  message?: string
): NextResponse<ErrorResponse> {
  const response: ErrorResponse = {
    error: message || 'Too many requests. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
    timestamp: new Date().toISOString(),
    details: { retryAfter },
  };
  
  return NextResponse.json(response, {
    status: 429,
    headers: {
      'Retry-After': retryAfter.toString(),
    },
  });
}

/**
 * Creates a standardized internal server error response
 */
export function internalServerError(
  message: string = 'Internal server error'
): NextResponse<ErrorResponse> {
  const response: ErrorResponse = {
    error: message,
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
  };
  
  return NextResponse.json(response, { status: 500 });
}

// ============================================================================
// Error Handler with Logging
// ============================================================================

/**
 * Handles API errors with logging and standardized response
 * Use this as a catch-all in API route try-catch blocks
 */
export function handleError(
  error: unknown,
  context?: Record<string, any>
): NextResponse<ErrorResponse> {
  const { response, statusCode } = handleApiError(error, context);
  return NextResponse.json(response, { status: statusCode });
}

// ============================================================================
// Specialized Error Handlers with Audit Logging
// ============================================================================

/**
 * Handles authentication failure with audit logging
 */
export async function handleAuthenticationFailure(
  email: string,
  reason: string,
  ipAddress?: string | null
): Promise<NextResponse<ErrorResponse>> {
  await logAuthenticationFailure(email, reason, ipAddress);
  return authenticationError('Invalid credentials');
}

/**
 * Handles authorization failure with audit logging
 */
export async function handleAuthorizationFailure(
  userId: string,
  resource: string,
  requiredRole: string,
  ipAddress?: string | null
): Promise<NextResponse<ErrorResponse>> {
  await logAuthorizationFailure(userId, resource, requiredRole, ipAddress);
  return authorizationError('You do not have permission to access this resource');
}

/**
 * Handles rate limit violation with audit logging
 */
export async function handleRateLimitViolation(
  identifier: string,
  limitType: string,
  retryAfter: number,
  ipAddress?: string | null
): Promise<NextResponse<ErrorResponse>> {
  await logRateLimitViolation(identifier, limitType, ipAddress);
  
  const message = limitType === 'login'
    ? 'Too many login attempts. Please try again later.'
    : limitType === 'password_reset'
    ? 'Too many password reset requests. Please try again later.'
    : limitType === 'account_creation'
    ? 'Too many account creation requests. Please try again later.'
    : 'Too many requests. Please try again later.';
  
  return rateLimitError(retryAfter, message);
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates required fields and returns error response if missing
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): NextResponse<ErrorResponse> | null {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return validationError(
      `Missing required fields: ${missingFields.join(', ')}`,
      missingFields[0]
    );
  }
  
  return null;
}

/**
 * Validates email format and returns error response if invalid
 */
export function validateEmail(email: string): NextResponse<ErrorResponse> | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return validationError('Invalid email format', 'email');
  }
  
  return null;
}

/**
 * Validates that a value is one of the allowed values
 */
export function validateEnum<T extends string>(
  value: string,
  allowedValues: T[],
  fieldName: string
): NextResponse<ErrorResponse> | null {
  if (!allowedValues.includes(value as T)) {
    return validationError(
      `Invalid ${fieldName}. Must be one of: ${allowedValues.join(', ')}`,
      fieldName
    );
  }
  
  return null;
}
