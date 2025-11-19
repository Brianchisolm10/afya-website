# Requirements Document

## Introduction

The Account Management System extends the AFYA platform to provide comprehensive user account creation, management, and role-based access control. The system enables administrators to create and manage team member accounts (coaches and admins), allows clients to manage their own account settings, and provides secure authentication flows for all user types. This system ensures proper access control, account lifecycle management, and user profile customization across the platform.

## Glossary

- **Account_System**: The complete account management functionality including registration, authentication, profile management, and role administration
- **User_Account**: An authenticated account in the system with associated profile data, credentials, and role assignment
- **Admin_User**: A user with ADMIN role who has full system access and can manage all accounts
- **Coach_User**: A user with COACH role who can view client data and access the admin panel but cannot manage other team accounts
- **Client_User**: A user with CLIENT role who can access their personal dashboard and manage their own profile
- **Account_Profile**: User-specific information including name, email, contact details, and preferences
- **Role_Assignment**: The process of assigning or changing a user's role (CLIENT, COACH, ADMIN)
- **Team_Member**: A user with COACH or ADMIN role who is part of the AFYA staff
- **Account_Status**: The current state of an account (ACTIVE, SUSPENDED, DEACTIVATED)
- **Password_Reset**: The secure process for users to reset their authentication credentials
- **Profile_Settings**: User-configurable preferences and personal information

## Requirements

### Requirement 1

**User Story:** As an administrator, I want to create team member accounts for coaches and admins, so that my staff can access the system with appropriate permissions

#### Acceptance Criteria

1. WHERE a user has role "ADMIN", THE Account_System SHALL provide an interface to create new user accounts
2. WHEN an administrator creates a team member account, THE Account_System SHALL require email address, full name, and role selection (COACH or ADMIN)
3. WHEN an administrator creates a team member account, THE Account_System SHALL send an invitation email with account setup instructions
4. WHEN an administrator creates a team member account, THE Account_System SHALL generate a secure setup token valid for 72 hours
5. THE Account_System SHALL prevent duplicate accounts by validating email uniqueness before account creation
6. WHEN a team member receives an invitation, THE Account_System SHALL provide a setup page where the user can set their password and complete their profile

### Requirement 2

**User Story:** As an administrator, I want to view and manage all user accounts, so that I can maintain proper access control and account status

#### Acceptance Criteria

1. WHERE a user has role "ADMIN", THE Account_System SHALL display a user management interface listing all accounts
2. WHEN an administrator views the user list, THE Account_System SHALL display email, name, role, account status, and creation date for each user
3. WHERE a user has role "ADMIN", THE Account_System SHALL provide the ability to change a user's role
4. WHERE a user has role "ADMIN", THE Account_System SHALL provide the ability to suspend or deactivate user accounts
5. WHERE a user has role "ADMIN", THE Account_System SHALL provide the ability to reactivate suspended accounts
6. THE Account_System SHALL prevent administrators from deleting their own admin account
7. THE Account_System SHALL require confirmation before performing destructive actions on user accounts

### Requirement 3

**User Story:** As a team member, I want to set up my account using an invitation link, so that I can securely access the system

#### Acceptance Criteria

1. WHEN a team member clicks an invitation link, THE Account_System SHALL validate the setup token
2. WHEN a setup token is expired or invalid, THE Account_System SHALL display an error message and provide contact information
3. WHEN a team member accesses a valid setup page, THE Account_System SHALL display a form requesting password creation and profile completion
4. WHEN a team member submits the setup form, THE Account_System SHALL validate password strength requirements (minimum 8 characters, one uppercase, one number)
5. WHEN a team member completes account setup, THE Account_System SHALL activate the account and redirect to the login page
6. THE Account_System SHALL invalidate the setup token after successful account activation

### Requirement 4

**User Story:** As any user, I want to log in with my email and password, so that I can access my account securely

#### Acceptance Criteria

1. THE Account_System SHALL provide a login page accepting email and password credentials
2. WHEN a user submits valid credentials, THE Account_System SHALL create an authenticated session
3. WHEN a user submits invalid credentials, THE Account_System SHALL display a generic error message without revealing which field is incorrect
4. WHEN a user with CLIENT role logs in successfully, THE Account_System SHALL redirect to the client dashboard
5. WHEN a user with COACH or ADMIN role logs in successfully, THE Account_System SHALL redirect to the admin panel
6. THE Account_System SHALL implement rate limiting to prevent brute force attacks (maximum 5 failed attempts per 15 minutes per email)
7. WHEN an account is suspended, THE Account_System SHALL prevent login and display an appropriate message

### Requirement 5

**User Story:** As any user, I want to reset my password if I forget it, so that I can regain access to my account

#### Acceptance Criteria

1. THE Account_System SHALL provide a "Forgot Password" link on the login page
2. WHEN a user requests a password reset, THE Account_System SHALL send a reset email with a secure token valid for 1 hour
3. WHEN a user clicks a password reset link, THE Account_System SHALL validate the reset token
4. WHEN a reset token is valid, THE Account_System SHALL display a form to enter a new password
5. WHEN a user submits a new password, THE Account_System SHALL validate password strength requirements
6. WHEN a password reset is completed, THE Account_System SHALL invalidate all existing sessions for that user
7. THE Account_System SHALL invalidate the reset token after successful password change
8. THE Account_System SHALL send a confirmation email after password change for security notification

### Requirement 6

**User Story:** As any authenticated user, I want to view and edit my profile information, so that I can keep my account details current

#### Acceptance Criteria

1. THE Account_System SHALL provide a profile settings page accessible to all authenticated users
2. WHEN a user accesses their profile settings, THE Account_System SHALL display current name, email, and role (read-only)
3. THE Account_System SHALL allow users to update their name and contact information
4. THE Account_System SHALL allow users to change their password by providing current password and new password
5. WHEN a user updates their profile, THE Account_System SHALL validate all input fields
6. WHEN a user changes their email address, THE Account_System SHALL send a verification email to the new address
7. THE Account_System SHALL require email verification before updating the email address in the system
8. WHEN a user updates their profile successfully, THE Account_System SHALL display a confirmation message

### Requirement 7

**User Story:** As a client, I want to create my own account during the intake process, so that I can access my personalized dashboard

#### Acceptance Criteria

1. WHEN a visitor submits the intake form, THE Account_System SHALL create a User account with CLIENT role
2. WHEN creating a client account, THE Account_System SHALL generate a temporary password or send a setup email
3. WHEN a client account is created, THE Account_System SHALL send a welcome email with login instructions
4. THE Account_System SHALL allow clients to set their password on first login
5. WHEN a client completes their first login, THE Account_System SHALL mark the account as fully activated
6. THE Account_System SHALL link the User account to the Client profile through the userId relationship

### Requirement 8

**User Story:** As an administrator, I want to assign or change user roles, so that I can grant appropriate access levels to team members

#### Acceptance Criteria

1. WHERE a user has role "ADMIN", THE Account_System SHALL provide an interface to modify user roles
2. WHEN an administrator changes a user's role, THE Account_System SHALL update the role immediately
3. WHEN a user's role is changed, THE Account_System SHALL invalidate their current session
4. WHEN a user logs in after a role change, THE Account_System SHALL redirect them to the appropriate interface for their new role
5. THE Account_System SHALL log all role changes with timestamp and administrator who made the change
6. THE Account_System SHALL prevent changing the role of the last remaining ADMIN user
7. WHEN a user's role is changed from CLIENT to COACH or ADMIN, THE Account_System SHALL send a notification email

### Requirement 9

**User Story:** As an administrator, I want to suspend or deactivate accounts, so that I can manage access for users who should no longer have system access

#### Acceptance Criteria

1. WHERE a user has role "ADMIN", THE Account_System SHALL provide the ability to suspend user accounts
2. WHEN an account is suspended, THE Account_System SHALL immediately invalidate all active sessions for that user
3. WHEN a suspended user attempts to log in, THE Account_System SHALL display a message indicating the account is suspended
4. WHERE a user has role "ADMIN", THE Account_System SHALL provide the ability to reactivate suspended accounts
5. WHEN an account is reactivated, THE Account_System SHALL send a notification email to the user
6. THE Account_System SHALL maintain an audit log of all account status changes
7. THE Account_System SHALL prevent administrators from suspending their own account

### Requirement 10

**User Story:** As a system administrator, I want user account data to be stored securely, so that sensitive information is protected

#### Acceptance Criteria

1. THE Account_System SHALL hash all passwords using bcrypt with a minimum cost factor of 10
2. THE Account_System SHALL never store passwords in plain text
3. THE Account_System SHALL store setup tokens and reset tokens as hashed values
4. THE Account_System SHALL set secure, httpOnly, and sameSite flags on all authentication cookies
5. THE Account_System SHALL implement CSRF protection on all account management forms
6. THE Account_System SHALL log all authentication attempts with timestamp and IP address
7. THE Account_System SHALL automatically expire sessions after 7 days of inactivity
8. THE Account_System SHALL support secure session management across multiple devices

### Requirement 11

**User Story:** As any user, I want to log out of my account, so that I can end my session securely

#### Acceptance Criteria

1. THE Account_System SHALL provide a logout button accessible from all authenticated pages
2. WHEN a user clicks logout, THE Account_System SHALL invalidate the current session
3. WHEN a user logs out, THE Account_System SHALL clear all authentication cookies
4. WHEN a user logs out, THE Account_System SHALL redirect to the login page
5. THE Account_System SHALL display a confirmation message after successful logout

### Requirement 12

**User Story:** As an administrator, I want to search and filter user accounts, so that I can quickly find specific users

#### Acceptance Criteria

1. WHERE a user has role "ADMIN", THE Account_System SHALL provide a search field in the user management interface
2. WHEN an administrator enters a search query, THE Account_System SHALL filter users by name or email
3. WHERE a user has role "ADMIN", THE Account_System SHALL provide filters for role type (CLIENT, COACH, ADMIN)
4. WHERE a user has role "ADMIN", THE Account_System SHALL provide filters for account status (ACTIVE, SUSPENDED, DEACTIVATED)
5. THE Account_System SHALL display search results in real-time as the administrator types
6. THE Account_System SHALL highlight matching text in search results
