# Implementation Plan

- [x] 1. Update database schema and create migrations
  - Add password, status, and lastLoginAt fields to User model
  - Create InviteToken model with token, type, expiresAt, and usedAt fields
  - Create AuditLog model with action, details, ipAddress fields
  - Create AccountStatus enum (ACTIVE, SUSPENDED, DEACTIVATED)
  - Create TokenType enum (ACCOUNT_SETUP, PASSWORD_RESET)
  - Add indexes for email, status, token fields
  - Run Prisma migration to apply schema changes
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 2. Create utility functions for security and validation
  - [x] 2.1 Implement password hashing utilities
    - Create hashPassword function using bcryptjs with cost factor 12
    - Create comparePassword function for verification
    - _Requirements: 10.1_
  
  - [x] 2.2 Implement token generation and validation utilities
    - Create generateToken function using crypto.randomBytes
    - Create hashToken function using SHA-256
    - Create validateToken function to check expiration and usage
    - _Requirements: 10.3_
  
  - [x] 2.3 Implement password strength validation
    - Create validatePasswordStrength function checking minimum 8 chars, uppercase, lowercase, number
    - Return strength score and validation messages
    - _Requirements: 3.4, 5.5_
  
  - [x] 2.4 Implement audit logging utility
    - Create logAuditEvent function to record actions with userId, action, details, ipAddress
    - _Requirements: 8.5, 9.6_

- [x] 3. Extend NextAuth configuration for credentials provider
  - [x] 3.1 Add Credentials provider to NextAuth config
    - Configure credentials provider with email and password fields
    - Implement authorize function with password verification
    - Check account status before allowing login
    - Log successful and failed login attempts
    - _Requirements: 4.1, 4.2, 4.3, 4.7_
  
  - [x] 3.2 Update session callback to include status
    - Add status field to session user object
    - _Requirements: 4.5, 4.6_
  
  - [x] 3.3 Configure custom pages for auth flows
    - Set custom signIn page path
    - Set custom error page path
    - _Requirements: 4.1_


- [x] 4. Create admin user management API endpoints
  - [x] 4.1 Implement POST /api/admin/users/create endpoint
    - Verify ADMIN role authorization
    - Validate email uniqueness
    - Create User record with no password
    - Generate invite token with 72-hour expiration
    - Send invitation email with setup link
    - Return user data and invite URL
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 4.2 Implement GET /api/admin/users endpoint
    - Verify ADMIN role authorization
    - Support search query parameter for name/email filtering
    - Support role filter parameter
    - Support status filter parameter
    - Return list of users with relevant fields
    - _Requirements: 2.1, 2.2, 12.1, 12.2, 12.3, 12.4_
  
  - [x] 4.3 Implement PUT /api/admin/users/[id]/role endpoint
    - Verify ADMIN role authorization
    - Validate new role value
    - Check not changing last ADMIN user
    - Update user role in database
    - Invalidate user's sessions
    - Create audit log entry
    - Send notification email
    - _Requirements: 2.3, 8.1, 8.2, 8.3, 8.5, 8.6, 8.7_
  
  - [x] 4.4 Implement PUT /api/admin/users/[id]/status endpoint
    - Verify ADMIN role authorization
    - Validate new status value
    - Prevent admin from suspending own account
    - Update user status in database
    - Invalidate user's sessions if suspended
    - Create audit log entry
    - Send notification email if suspended or reactivated
    - _Requirements: 2.4, 2.5, 9.1, 9.2, 9.4, 9.6, 9.7_

- [x] 5. Create account setup and password reset API endpoints
  - [x] 5.1 Implement POST /api/auth/setup endpoint
    - Validate setup token from request
    - Check token not expired and not used
    - Validate password strength
    - Hash password with bcrypt
    - Update user record with password
    - Mark token as used
    - Set account status to ACTIVE
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6_
  
  - [x] 5.2 Implement POST /api/auth/reset-password/request endpoint
    - Find user by email
    - Generate password reset token with 1-hour expiration
    - Send reset email with token link
    - Return success message (even if email not found for security)
    - _Requirements: 5.1, 5.2_
  
  - [x] 5.3 Implement POST /api/auth/reset-password/confirm endpoint
    - Validate reset token from request
    - Check token not expired and not used
    - Validate new password strength
    - Hash new password with bcrypt
    - Update user password
    - Invalidate all user sessions
    - Mark token as used
    - Send confirmation email
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_


- [x] 6. Create user profile management API endpoints
  - [x] 6.1 Implement GET /api/me/profile endpoint
    - Verify user authentication
    - Fetch user data by session userId
    - Return user profile fields (id, email, name, role, status, createdAt)
    - _Requirements: 6.2_
  
  - [x] 6.2 Implement PUT /api/me/profile endpoint
    - Verify user authentication
    - Support name update
    - Support password change (require current password verification)
    - Validate new password strength if changing password
    - Hash new password if provided
    - Update user record
    - Return updated user data
    - _Requirements: 6.3, 6.4, 6.5, 6.8_

- [x] 7. Create email service functions
  - [x] 7.1 Create team member invitation email template and sender
    - Design HTML email template with setup link
    - Create sendInvitationEmail function
    - Include role and expiration information
    - _Requirements: 1.3_
  
  - [x] 7.2 Create password reset email template and sender
    - Design HTML email template with reset link
    - Create sendPasswordResetEmail function
    - Include expiration information (1 hour)
    - _Requirements: 5.2_
  
  - [x] 7.3 Create password changed confirmation email template and sender
    - Design HTML email template for security notification
    - Create sendPasswordChangedEmail function
    - _Requirements: 5.8_
  
  - [x] 7.4 Create role changed notification email template and sender
    - Design HTML email template with new role information
    - Create sendRoleChangedEmail function
    - _Requirements: 8.7_
  
  - [x] 7.5 Create account status notification email template and sender
    - Design HTML email templates for suspended and reactivated states
    - Create sendAccountStatusEmail function
    - _Requirements: 9.5_

- [x] 8. Build admin user management UI components
  - [x] 8.1 Create UserManagementTable component
    - Display users in table format with name, email, role, status, created date
    - Implement search input with real-time filtering
    - Add role filter chips (CLIENT, COACH, ADMIN)
    - Add status filter chips (ACTIVE, SUSPENDED, DEACTIVATED)
    - Add action menu for each user (edit role, change status)
    - Implement role badge styling with colors
    - Implement status indicator dots
    - _Requirements: 2.1, 2.2, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_
  
  - [x] 8.2 Create CreateUserModal component
    - Build modal form with email, name, and role inputs
    - Validate email format
    - Add role selection dropdown (COACH, ADMIN only)
    - Call POST /api/admin/users/create on submit
    - Display success message with invite link
    - Show copy-to-clipboard button for invite URL
    - _Requirements: 1.1, 1.2_
  
  - [x] 8.3 Create RoleChangeDialog component
    - Build confirmation dialog for role changes
    - Display current and new role
    - Show warning about session invalidation
    - Call PUT /api/admin/users/[id]/role on confirm
    - _Requirements: 2.3, 8.1_
  
  - [x] 8.4 Create StatusChangeDialog component
    - Build confirmation dialog for status changes
    - Display current and new status
    - Show warning for destructive actions
    - Call PUT /api/admin/users/[id]/status on confirm
    - _Requirements: 2.4, 2.5, 2.7, 9.1_


- [x] 9. Build authentication UI components
  - [x] 9.1 Update LoginForm component for credentials
    - Add password input field to existing login form
    - Add "Forgot password?" link below password field
    - Update form submission to use credentials provider
    - Handle rate limit errors with clear messaging
    - Handle suspended account errors
    - Display generic error for invalid credentials
    - _Requirements: 4.1, 4.2, 4.3, 4.6, 4.7_
  
  - [x] 9.2 Create AccountSetupForm component
    - Build form with token validation on mount
    - Add password input with strength indicator
    - Add confirm password input
    - Add name input (pre-filled, editable)
    - Validate password strength in real-time
    - Call POST /api/auth/setup on submit
    - Redirect to login on success
    - Handle expired token errors
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 9.3 Create PasswordResetRequestForm component
    - Build form with email input
    - Call POST /api/auth/reset-password/request on submit
    - Display success message (always, for security)
    - Add back to login link
    - _Requirements: 5.1, 5.2_
  
  - [x] 9.4 Create PasswordResetConfirmForm component
    - Build form with token validation on mount
    - Add new password input with strength indicator
    - Add confirm password input
    - Validate password strength in real-time
    - Call POST /api/auth/reset-password/confirm on submit
    - Redirect to login on success
    - Handle expired token errors
    - _Requirements: 5.3, 5.4, 5.5, 5.6_

- [x] 10. Build user profile management UI components
  - [x] 10.1 Create ProfileSettingsForm component
    - Fetch user data from GET /api/me/profile on mount
    - Display name input (editable)
    - Display email (read-only)
    - Display role badge (read-only)
    - Add "Change Password" section with current and new password inputs
    - Validate password strength for new password
    - Call PUT /api/me/profile on save
    - Display success toast on update
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.8_
  
  - [x] 10.2 Create PasswordStrengthIndicator component
    - Display visual strength bar (red, yellow, green)
    - Show strength label (Weak, Medium, Strong)
    - List requirement checkmarks (length, uppercase, lowercase, number)
    - Update in real-time as user types
    - _Requirements: 3.4, 5.5_

- [x] 11. Create admin user management page
  - [x] 11.1 Build /admin/users page
    - Add "User Management" to admin navigation
    - Render UserManagementTable component
    - Add "Create User" button that opens CreateUserModal
    - Verify ADMIN role authorization
    - _Requirements: 1.1, 2.1_


- [x] 12. Create authentication flow pages
  - [x] 12.1 Create /setup/[token] page
    - Extract token from URL params
    - Render AccountSetupForm component
    - Handle token validation errors
    - _Requirements: 3.1, 3.2_
  
  - [x] 12.2 Create /reset-password page
    - Render PasswordResetRequestForm component
    - _Requirements: 5.1_
  
  - [x] 12.3 Create /reset-password/[token] page
    - Extract token from URL params
    - Render PasswordResetConfirmForm component
    - Handle token validation errors
    - _Requirements: 5.3_

- [x] 13. Create user profile settings page
  - [x] 13.1 Build /settings/profile page
    - Render ProfileSettingsForm component
    - Verify user authentication
    - Add navigation back to dashboard
    - _Requirements: 6.1, 6.2_

- [x] 14. Add logout functionality
  - [x] 14.1 Add logout button to navigation
    - Add logout button to header/navigation for all authenticated pages
    - Call NextAuth signOut function on click
    - Redirect to login page after logout
    - Display confirmation message
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 15. Implement rate limiting
  - [x] 15.1 Create rate limiting utility
    - Implement in-memory rate limiter for development
    - Track failed login attempts by email
    - Track password reset requests by email
    - Track account creation by admin userId
    - Return rate limit status and retry time
    - _Requirements: 4.6_
  
  - [x] 15.2 Apply rate limiting to login endpoint
    - Check rate limit before processing credentials
    - Return 429 error when limit exceeded
    - Include retry-after information
    - _Requirements: 4.6_
  
  - [x] 15.3 Apply rate limiting to password reset endpoint
    - Check rate limit before sending reset email
    - Return 429 error when limit exceeded
    - _Requirements: 5.2_

- [x] 16. Update client intake flow to create accounts
  - [x] 16.1 Modify intake form submission to create user account
    - Update POST /api/intake/submit to create User with CLIENT role
    - Generate temporary password or setup token
    - Send welcome email with login instructions
    - Link User to Client via userId
    - _Requirements: 7.1, 7.2, 7.3, 7.6_


- [x] 17. Add authorization middleware and guards
  - [x] 17.1 Create role-based authorization utility
    - Create requireRole function to check user role
    - Create requireAuth function to verify authentication
    - Return 401 for unauthenticated requests
    - Return 403 for insufficient permissions
    - _Requirements: 2.1, 2.3, 2.4_
  
  - [x] 17.2 Apply authorization to admin endpoints
    - Protect all /api/admin/* endpoints with ADMIN role check
    - _Requirements: 1.1, 2.1_
  
  - [x] 17.3 Apply authorization to profile endpoints
    - Protect /api/me/* endpoints with authentication check
    - _Requirements: 6.1_

- [x] 18. Implement session invalidation
  - [x] 18.1 Create session invalidation utility
    - Create invalidateUserSessions function to delete all sessions for a user
    - _Requirements: 5.6, 8.3, 9.2_
  
  - [x] 18.2 Invalidate sessions on password change
    - Call invalidateUserSessions after password update
    - _Requirements: 5.6_
  
  - [x] 18.3 Invalidate sessions on role change
    - Call invalidateUserSessions after role update
    - _Requirements: 8.3_
  
  - [x] 18.4 Invalidate sessions on account suspension
    - Call invalidateUserSessions when status changed to SUSPENDED
    - _Requirements: 9.2_

- [x] 19. Add security validations and protections
  - [x] 19.1 Implement last admin protection
    - Create isLastAdmin function to check if user is the only ADMIN
    - Prevent role change of last ADMIN user
    - Prevent status change of last ADMIN user
    - Return 409 error with clear message
    - _Requirements: 2.6, 8.6_
  
  - [x] 19.2 Implement self-action protection
    - Prevent admin from suspending own account
    - Prevent admin from deleting own account
    - Return 409 error with clear message
    - _Requirements: 9.7_
  
  - [x] 19.3 Add CSRF protection verification
    - Verify NextAuth CSRF tokens are enabled
    - Test CSRF protection on all forms
    - _Requirements: 10.5_

- [x] 20. Add comprehensive error handling
  - [x] 20.1 Create error response utilities
    - Create standardized error response format
    - Create error handler for common scenarios (validation, auth, not found)
    - _Requirements: 4.3_
  
  - [x] 20.2 Add error logging
    - Log all authentication failures with IP address
    - Log all authorization failures
    - Log all rate limit violations
    - _Requirements: 10.6_


- [x] 21. Create initial admin account setup
  - [x] 21.1 Create database seed script for first admin
    - Create seed script to insert initial admin user
    - Generate secure password hash
    - Set role to ADMIN and status to ACTIVE
    - Document how to run seed script
    - _Requirements: 1.1_

- [x] 22. Add documentation
  - [x] 22.1 Document account management features
    - Create README section for account management
    - Document how to create team member accounts
    - Document password reset process
    - Document role management
    - _Requirements: 1.1, 2.1, 5.1, 8.1_
  
  - [x] 22.2 Document security features
    - Document password requirements
    - Document rate limiting
    - Document audit logging
    - Document session management
    - _Requirements: 10.1, 10.6, 10.7_
