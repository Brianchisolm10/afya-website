import { prisma } from './db';

/**
 * Audit log action types
 */
export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGIN_RATE_LIMITED'
  | 'LOGOUT'
  | 'PASSWORD_CHANGED'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'PASSWORD_RESET_RATE_LIMITED'
  | 'ACCOUNT_CREATED'
  | 'ACCOUNT_CREATION_RATE_LIMITED'
  | 'ACCOUNT_SETUP_COMPLETED'
  | 'ROLE_CHANGED'
  | 'ACCOUNT_SUSPENDED'
  | 'ACCOUNT_REACTIVATED'
  | 'ACCOUNT_DEACTIVATED'
  | 'PROFILE_UPDATED'
  | 'AUTHORIZATION_FAILED'
  | 'AUTHENTICATION_FAILED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_TOKEN'
  | 'EXPIRED_TOKEN'
  | 'AUTH_REQUIRED_FAILED'
  | 'AUTH_INACTIVE_USER'
  | 'CLIENT_ACCESS_GRANTED'
  | 'CLIENT_ACCESS_DENIED'
  | 'PACKET_ACCESS_GRANTED'
  | 'PACKET_ACCESS_DENIED'
  | 'NOTIFICATION_PREFERENCES_UPDATED'
  | 'ACTIVITY_LOGGED'
  | 'UNAUTHORIZED_ACTIVITY_LOG_ATTEMPT';

/**
 * Log an audit event to the database
 * @param action - The action being logged
 * @param userId - Optional user ID associated with the action
 * @param details - Optional additional details (will be stored as JSON string)
 * @param ipAddress - Optional IP address of the request
 * @returns Promise resolving to the created audit log entry
 */
export async function logAuditEvent(
  action: AuditAction,
  userId?: string | null,
  details?: Record<string, any>,
  ipAddress?: string | null
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        userId: userId || null,
        details: details ? JSON.stringify(details) : null,
        ipAddress: ipAddress || null,
      },
    });
  } catch (error) {
    // Log to console if database logging fails, but don't throw
    // to prevent audit logging from breaking the main application flow
    console.error('Failed to log audit event:', error);
  }
}

/**
 * Get audit logs for a specific user
 * @param userId - User ID to get logs for
 * @param limit - Maximum number of logs to return (default: 50)
 * @returns Promise resolving to array of audit logs
 */
export async function getUserAuditLogs(userId: string, limit: number = 50) {
  return prisma.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      action: true,
      details: true,
      ipAddress: true,
      createdAt: true,
    },
  });
}

/**
 * Get recent audit logs (admin function)
 * @param limit - Maximum number of logs to return (default: 100)
 * @param action - Optional filter by action type
 * @returns Promise resolving to array of audit logs
 */
export async function getRecentAuditLogs(
  limit: number = 100,
  action?: AuditAction
) {
  return prisma.auditLog.findMany({
    where: action ? { action } : undefined,
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      action: true,
      userId: true,
      details: true,
      ipAddress: true,
      createdAt: true,
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });
}

/**
 * Log authentication failure with IP address
 * @param email - Email address used in failed login attempt
 * @param reason - Reason for failure (invalid credentials, suspended account, etc.)
 * @param ipAddress - IP address of the request
 */
export async function logAuthenticationFailure(
  email: string,
  reason: string,
  ipAddress?: string | null
): Promise<void> {
  await logAuditEvent(
    'AUTHENTICATION_FAILED',
    null,
    { email, reason },
    ipAddress
  );
}

/**
 * Log authorization failure with IP address
 * @param userId - User ID who attempted unauthorized action
 * @param resource - Resource or endpoint that was accessed
 * @param requiredRole - Role required for the action
 * @param ipAddress - IP address of the request
 */
export async function logAuthorizationFailure(
  userId: string,
  resource: string,
  requiredRole: string,
  ipAddress?: string | null
): Promise<void> {
  await logAuditEvent(
    'AUTHORIZATION_FAILED',
    userId,
    { resource, requiredRole },
    ipAddress
  );
}

/**
 * Log rate limit violation
 * @param identifier - Identifier for rate limit (email, userId, IP, etc.)
 * @param limitType - Type of rate limit (login, password_reset, account_creation)
 * @param ipAddress - IP address of the request
 */
export async function logRateLimitViolation(
  identifier: string,
  limitType: string,
  ipAddress?: string | null
): Promise<void> {
  await logAuditEvent(
    'RATE_LIMIT_EXCEEDED',
    null,
    { identifier, limitType },
    ipAddress
  );
}
