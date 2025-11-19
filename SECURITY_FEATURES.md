# Security Features Documentation

This document provides comprehensive information about the security features implemented in the AFYA Account Management System.

## Table of Contents

1. [Password Requirements](#password-requirements)
2. [Rate Limiting](#rate-limiting)
3. [Audit Logging](#audit-logging)
4. [Session Management](#session-management)

---

## Password Requirements

### Password Strength Rules

All passwords in the AFYA system must meet the following minimum requirements:

- **Minimum Length**: 8 characters
- **Uppercase Letter**: At least one uppercase letter (A-Z)
- **Lowercase Letter**: At least one lowercase letter (a-z)
- **Number**: At least one numeric digit (0-9)

### Password Strength Indicator

The system provides real-time password strength feedback with three levels:

- **Weak** (Red): Password does not meet all requirements
- **Medium** (Yellow): Password meets minimum requirements but could be stronger
- **Strong** (Green): Password meets all requirements and is considered secure

### Password Hashing

- **Algorithm**: bcrypt with cost factor 12
- **Storage**: Passwords are never stored in plain text
- **Verification**: Password comparison uses constant-time comparison to prevent timing attacks

### Password Security Best Practices

1. **Never Reuse Passwords**: Use unique passwords for different accounts
2. **Use Passphrases**: Consider using memorable phrases instead of complex strings
3. **Avoid Personal Information**: Don't use names, birthdays, or other easily guessable information
4. **Regular Updates**: Change passwords periodically, especially after security incidents

### Implementation Details

Password validation is implemented in `lib/validation.ts`:

```typescript
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
}
```

Password hashing is handled in `lib/password.ts`:

```typescript
// Hash password with bcrypt (cost factor 12)
export async function hashPassword(password: string): Promise<string>

// Verify password against hash
export async function comparePassword(password: string, hash: string): Promise<boolean>
```

---

## Rate Limiting

Rate limiting protects the system from brute force attacks and abuse by limiting the number of requests from a single source.

### Rate Limit Policies

#### Login Attempts
- **Limit**: 5 failed attempts per email address
- **Window**: 15 minutes
- **Scope**: Per email address
- **Response**: HTTP 429 (Too Many Requests)
- **Retry-After**: Included in response headers

#### Password Reset Requests
- **Limit**: 3 requests per email address
- **Window**: 1 hour
- **Scope**: Per email address
- **Response**: HTTP 429 (Too Many Requests)

#### Account Creation (Admin)
- **Limit**: 10 new accounts per administrator
- **Window**: 1 hour
- **Scope**: Per admin user ID
- **Response**: HTTP 429 (Too Many Requests)

### Rate Limit Response Format

When a rate limit is exceeded, the API returns:

```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 900,
  "limit": 5,
  "remaining": 0
}
```

### Implementation Details

Rate limiting is implemented in `lib/ratelimit.ts`:

```typescript
// Check if action is rate limited
export async function checkRateLimit(
  identifier: string,
  action: 'login' | 'password-reset' | 'account-creation'
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}>
```

### Development vs Production

- **Development**: Uses in-memory storage (resets on server restart)
- **Production**: Should use Redis or similar persistent storage for distributed systems

### Bypassing Rate Limits

Rate limits cannot be bypassed. If you encounter legitimate rate limit issues:

1. Wait for the time window to expire
2. Contact your system administrator
3. Check for automated scripts that may be triggering limits

---

## Audit Logging

The system maintains comprehensive audit logs of security-relevant actions to support security monitoring, compliance, and incident investigation.

### Logged Actions

The following actions are automatically logged:

#### Authentication Events
- `LOGIN_SUCCESS`: Successful user login
- `LOGIN_FAILED`: Failed login attempt
- `LOGOUT`: User logout
- `SESSION_EXPIRED`: Automatic session expiration

#### Account Management
- `ACCOUNT_CREATED`: New user account created
- `ACCOUNT_SETUP_COMPLETED`: User completed account setup
- `PASSWORD_CHANGED`: User changed their password
- `PASSWORD_RESET_REQUESTED`: User requested password reset
- `PASSWORD_RESET_COMPLETED`: User completed password reset

#### Role and Status Changes
- `ROLE_CHANGED`: User role was modified
- `ACCOUNT_SUSPENDED`: Account was suspended
- `ACCOUNT_REACTIVATED`: Suspended account was reactivated
- `ACCOUNT_DEACTIVATED`: Account was deactivated

#### Authorization Failures
- `UNAUTHORIZED_ACCESS`: Attempt to access protected resource without authentication
- `FORBIDDEN_ACCESS`: Attempt to access resource without sufficient permissions

### Audit Log Data Structure

Each audit log entry contains:

```typescript
{
  id: string;              // Unique log entry ID
  userId: string | null;   // User who performed the action (null for system actions)
  action: string;          // Action type (see above)
  details: string | null;  // JSON string with additional context
  ipAddress: string | null; // IP address of the request
  createdAt: Date;         // Timestamp of the action
}
```

### Audit Log Details

The `details` field contains action-specific information in JSON format:

```json
// Role change example
{
  "targetUserId": "user_123",
  "oldRole": "COACH",
  "newRole": "ADMIN",
  "reason": "Promotion"
}

// Login failure example
{
  "email": "user@example.com",
  "reason": "Invalid password"
}
```

### Accessing Audit Logs

Audit logs are stored in the `AuditLog` database table and can be queried:

```typescript
// Get audit logs for a specific user
const logs = await prisma.auditLog.findMany({
  where: { userId: 'user_123' },
  orderBy: { createdAt: 'desc' },
  take: 100
});

// Get all failed login attempts
const failedLogins = await prisma.auditLog.findMany({
  where: { action: 'LOGIN_FAILED' },
  orderBy: { createdAt: 'desc' }
});
```

### Audit Log Retention

- **Retention Period**: Minimum 90 days (recommended 1 year for compliance)
- **Archival**: Implement automated archival for older logs
- **Compliance**: Ensure retention meets regulatory requirements (HIPAA, GDPR, etc.)

### Implementation Details

Audit logging is implemented in `lib/audit.ts`:

```typescript
// Log an audit event
export async function logAuditEvent(
  action: string,
  userId?: string,
  details?: Record<string, any>,
  ipAddress?: string
): Promise<void>
```

### Security Monitoring

Regularly monitor audit logs for:

- Multiple failed login attempts from the same IP
- Unusual patterns of role changes
- Access attempts outside business hours
- Rapid account creation patterns
- Unauthorized access attempts

---

## Session Management

The system uses secure session management to maintain user authentication state across requests.

### Session Configuration

#### Session Duration
- **Active Session**: 7 days from last activity
- **Absolute Maximum**: 30 days (requires re-authentication after)
- **Idle Timeout**: Session expires after 7 days of inactivity

#### Session Storage
- **Provider**: NextAuth.js with database adapter
- **Storage**: PostgreSQL database (Session table)
- **Adapter**: Prisma adapter for NextAuth

### Session Security Features

#### Cookie Security
All session cookies are configured with secure flags:

- **httpOnly**: `true` - Prevents JavaScript access to cookies
- **secure**: `true` - Cookies only sent over HTTPS (production)
- **sameSite**: `lax` - Protects against CSRF attacks
- **path**: `/` - Cookie available across entire application

#### CSRF Protection
- NextAuth.js provides built-in CSRF protection
- CSRF tokens are automatically validated on all state-changing requests
- Tokens are unique per session and expire with the session

### Session Data Structure

Each session contains:

```typescript
{
  sessionToken: string;    // Unique session identifier
  userId: string;          // Associated user ID
  expires: Date;           // Session expiration timestamp
  user: {
    id: string;
    email: string;
    name: string | null;
    role: 'CLIENT' | 'COACH' | 'ADMIN';
    status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  }
}
```

### Session Invalidation

Sessions are automatically invalidated in the following scenarios:

#### Automatic Invalidation
1. **Password Change**: All sessions invalidated when user changes password
2. **Role Change**: All sessions invalidated when admin changes user role
3. **Account Suspension**: All sessions invalidated when account is suspended
4. **Password Reset**: All sessions invalidated after password reset completion

#### Manual Invalidation
Users can manually log out to invalidate their current session.

### Implementation Details

Session invalidation is implemented in `lib/sessions.ts`:

```typescript
// Invalidate all sessions for a user
export async function invalidateUserSessions(userId: string): Promise<void>

// Invalidate specific session
export async function invalidateSession(sessionToken: string): Promise<void>
```

### Multi-Device Support

- Users can be logged in on multiple devices simultaneously
- Each device has its own session
- Invalidating sessions (e.g., password change) affects all devices
- Users can see active sessions in their profile (future enhancement)

### Session Monitoring

Monitor sessions for:

- Unusual session creation patterns
- Sessions from unexpected geographic locations
- Multiple concurrent sessions from different IPs
- Long-lived sessions that may indicate compromised credentials

### Best Practices for Users

1. **Log Out on Shared Devices**: Always log out when using public or shared computers
2. **Regular Password Changes**: Change passwords periodically to invalidate old sessions
3. **Monitor Account Activity**: Report suspicious activity immediately
4. **Use Secure Networks**: Avoid logging in over public Wi-Fi without VPN

### Best Practices for Administrators

1. **Monitor Active Sessions**: Regularly review active sessions for anomalies
2. **Investigate Suspicious Activity**: Follow up on unusual session patterns
3. **Enforce Session Limits**: Consider implementing maximum concurrent session limits
4. **Session Cleanup**: Implement automated cleanup of expired sessions

---

## Security Incident Response

### Suspected Account Compromise

If you suspect an account has been compromised:

1. **Immediate Actions**:
   - Suspend the account immediately
   - Invalidate all active sessions
   - Reset the password
   - Review audit logs for suspicious activity

2. **Investigation**:
   - Check audit logs for unauthorized access
   - Review recent role or status changes
   - Identify affected data or resources
   - Document findings

3. **Recovery**:
   - Contact the legitimate user
   - Verify identity before reactivating
   - Require password reset
   - Enable additional monitoring

### Reporting Security Issues

To report security vulnerabilities or incidents:

1. Contact your system administrator immediately
2. Do not disclose vulnerabilities publicly
3. Provide detailed information about the issue
4. Include steps to reproduce if applicable

---

## Compliance and Regulations

### HIPAA Compliance

The security features support HIPAA compliance requirements:

- **Access Controls**: Role-based access control (RBAC)
- **Audit Logging**: Comprehensive logging of access and changes
- **Authentication**: Strong password requirements and secure sessions
- **Encryption**: Passwords hashed with bcrypt, sessions encrypted

### GDPR Compliance

The system supports GDPR requirements:

- **Data Access**: Users can view their profile data
- **Data Portability**: Export functionality available
- **Right to Erasure**: Account deactivation and data deletion capabilities
- **Audit Trail**: Complete logging of data access and modifications

---

## Additional Resources

### Related Documentation

- [Error Handling Guide](./ERROR_HANDLING_GUIDE.md)
- [Security Implementation Details](./lib/SECURITY.md)
- [Admin Setup Guide](./ADMIN_SETUP_GUIDE.md)
- [API Documentation](./README.md)

### Security Libraries Used

- **bcryptjs**: Password hashing (v2.4.3+)
- **NextAuth.js**: Authentication framework (v4.x)
- **Prisma**: Database ORM with parameterized queries
- **crypto**: Node.js built-in for secure token generation

### Security Updates

Keep the following dependencies updated for security patches:

```bash
npm update bcryptjs
npm update next-auth
npm update @prisma/client
npm update next
```

### Contact Information

For security-related questions or concerns:

- **System Administrator**: Contact your organization's admin
- **Technical Support**: Refer to your organization's support channels
- **Security Incidents**: Follow your organization's incident response procedures

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-18 | Initial security features documentation |

