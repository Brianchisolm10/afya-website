# Security Implementation Documentation

## CSRF Protection

### NextAuth CSRF Protection
NextAuth.js provides built-in CSRF protection for all authentication-related operations:
- Login (signIn)
- Logout (signOut)
- Session management

CSRF tokens are automatically generated and validated by NextAuth for these operations.

### Custom API Routes
Custom API routes in `/app/api/` are protected through:
1. **Authentication checks**: All protected routes require valid session tokens
2. **Authorization checks**: Role-based access control via `requireRole()` and `requireAuth()`
3. **Same-origin policy**: Next.js enforces same-origin by default

### Forms Using CSRF Protection
All forms that interact with authentication use NextAuth's built-in CSRF protection:
- Login form (`/login`) - uses `signIn()` from next-auth/react
- Logout functionality - uses `signOut()` from next-auth/react

### Custom Forms
Forms that call custom API endpoints (e.g., account setup, password reset) are protected by:
- Session-based authentication for authenticated endpoints
- Token-based validation for public endpoints (setup tokens, reset tokens)
- Rate limiting to prevent abuse

## Last Admin Protection

The system prevents modification of the last active ADMIN user to ensure system access is maintained.

### Implementation
- `isLastAdmin(userId)` function in `lib/authorization.ts`
- Checks if user is the only ADMIN with ACTIVE status
- Returns 409 Conflict error when attempting to:
  - Change role of last ADMIN
  - Suspend or deactivate last ADMIN

### Protected Endpoints
- `PUT /api/admin/users/[id]/role` - Prevents role change of last ADMIN
- `PUT /api/admin/users/[id]/status` - Prevents status change of last ADMIN

## Self-Action Protection

Administrators cannot perform destructive actions on their own accounts.

### Implementation
- `isSelfAction(sessionUserId, targetUserId)` function in `lib/authorization.ts`
- Compares session user ID with target user ID
- Returns 409 Conflict error when attempting self-actions

### Protected Endpoints
- `PUT /api/admin/users/[id]/status` - Prevents admin from suspending own account

## Security Best Practices

1. **Password Security**
   - Passwords hashed with bcrypt (cost factor 12)
   - Minimum 8 characters, uppercase, lowercase, number required
   - Never logged or displayed

2. **Token Security**
   - Cryptographically secure random tokens (crypto.randomBytes)
   - Tokens stored as SHA-256 hashes
   - Single-use tokens with expiration
   - Setup tokens: 72 hours
   - Reset tokens: 1 hour

3. **Rate Limiting**
   - Login attempts: 5 per 15 minutes per email
   - Password reset: 3 per hour per email
   - Account creation: 10 per hour per admin

4. **Session Security**
   - httpOnly cookies
   - secure flag (HTTPS only in production)
   - sameSite: lax
   - 7-day expiration
   - Database-backed sessions for cross-device invalidation

5. **Audit Logging**
   - All authentication attempts logged
   - All authorization failures logged
   - All account modifications logged
   - IP addresses tracked for security events
