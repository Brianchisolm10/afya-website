# Requirements Document

## Introduction

The AFYA Website V1 is a production-ready web application that serves as both a marketing site and client portal. The system enables new visitors to learn about AFYA's mission and services, submit intake forms to become clients, and provides existing clients with authenticated access to their personalized health and fitness packets (Intro, Nutrition, and Workout). The system integrates with existing Google-based automation through webhooks and provides administrators with oversight capabilities for managing clients and packet delivery status.

## Glossary

- **AFYA_System**: The complete web application including public pages, client portal, and admin interface
- **User**: An authenticated account in the system with a role (CLIENT, COACH, or ADMIN)
- **Client**: A person who has submitted an intake form and has associated profile data and packets
- **Packet**: A generated document (Intro, Nutrition, or Workout) delivered to a client via Google Drive integration
- **Intake_Form**: The web form that collects initial client information to begin the onboarding process
- **Google_Script**: External Google Apps Script automation that generates packets and notifies the system
- **Dashboard**: The authenticated client portal showing packet status and access links
- **Admin_Panel**: The administrative interface for viewing all clients and their packet statuses

## Requirements

### Requirement 1

**User Story:** As a new visitor, I want to learn about AFYA's mission and services, so that I can understand what AFYA offers before signing up

#### Acceptance Criteria

1. THE AFYA_System SHALL display a home page with hero section containing AFYA mission statement and "movement for everyone" messaging
2. THE AFYA_System SHALL provide a services page that describes Intro Packet, Nutrition Packet, and Workout Packet offerings
3. THE AFYA_System SHALL display a "Start Your Journey" call-to-action button on the home page that links to the intake form
4. THE AFYA_System SHALL show future educational packets as "coming soon" on the services page

### Requirement 2

**User Story:** As a new visitor, I want to submit an intake form with my basic information, so that I can become a client and receive personalized packets

#### Acceptance Criteria

1. WHEN a visitor navigates to the get-started page, THE AFYA_System SHALL display an intake form requesting full name, email, and goal selection
2. WHEN a visitor submits the intake form with valid data, THE AFYA_System SHALL create a User record and Client record in the database
3. WHEN a visitor submits the intake form, THE AFYA_System SHALL create Packet records with status "PENDING" for required packet types
4. WHEN the intake form submission completes successfully, THE AFYA_System SHALL display a confirmation screen instructing the client to check email and that packets will appear in their dashboard when ready
5. THE AFYA_System SHALL validate that email addresses are in valid format before accepting intake form submissions

### Requirement 3

**User Story:** As a new client, I want to log in using my email, so that I can access my personalized dashboard

#### Acceptance Criteria

1. THE AFYA_System SHALL provide a login page that accepts email-based authentication
2. WHEN a user successfully authenticates, THE AFYA_System SHALL redirect the user to the dashboard page
3. THE AFYA_System SHALL restrict access to the dashboard page to authenticated users only
4. WHEN an unauthenticated user attempts to access the dashboard, THE AFYA_System SHALL redirect the user to the login page

### Requirement 4

**User Story:** As an authenticated client, I want to view my packet status and access completed packets, so that I can download and use my personalized health documents

#### Acceptance Criteria

1. WHEN a client accesses the dashboard, THE AFYA_System SHALL display a welcome message with the client's name
2. WHEN a client accesses the dashboard, THE AFYA_System SHALL display all packets associated with the client showing type, status, and access link
3. WHEN a packet has status "READY", THE AFYA_System SHALL display a "View Packet" link with the document URL
4. WHEN a packet has status "PENDING", THE AFYA_System SHALL display a status badge indicating the packet is being prepared
5. WHEN a packet has status "FAILED", THE AFYA_System SHALL display a status badge indicating an error occurred
6. THE AFYA_System SHALL display a persistent link to the Weekly Progress Form on the client dashboard
7. THE AFYA_System SHALL display guidance text in a "Next Steps" section explaining how to use documents and check-in frequency

### Requirement 5

**User Story:** As the Google Apps Script automation, I want to notify the system when a packet is generated, so that clients can access their completed documents

#### Acceptance Criteria

1. THE AFYA_System SHALL provide a webhook endpoint at POST /api/packets/update that accepts packet status updates
2. WHEN the webhook receives a request with valid shared secret header, THE AFYA_System SHALL authenticate the request
3. WHEN the webhook receives a request without valid shared secret header, THE AFYA_System SHALL reject the request with unauthorized status
4. WHEN the webhook receives valid packet update data, THE AFYA_System SHALL locate the client by email or clientId
5. WHEN the webhook locates the matching client and packet, THE AFYA_System SHALL update the packet status to "READY" or "FAILED" as specified
6. WHEN the webhook receives a packet update with status "READY", THE AFYA_System SHALL store the provided document URL in the packet record
7. WHEN the webhook receives a packet update with status "FAILED", THE AFYA_System SHALL store the error message in the lastError field

### Requirement 6

**User Story:** As an administrator, I want to view all clients and their packet statuses, so that I can monitor the system and assist clients when needed

#### Acceptance Criteria

1. WHERE a user has role "ADMIN" or "COACH", THE AFYA_System SHALL grant access to the admin panel at /admin
2. WHEN a user with role "CLIENT" attempts to access the admin panel, THE AFYA_System SHALL deny access and redirect to the dashboard
3. WHEN an administrator accesses the admin panel, THE AFYA_System SHALL display a table of all clients showing name, email, creation date, and packet count
4. WHEN an administrator selects a client from the table, THE AFYA_System SHALL display the client's packets with type, status, and document URL
5. THE AFYA_System SHALL restrict admin panel access to users with ADMIN or COACH roles only

### Requirement 7

**User Story:** As a client, I want the system to retrieve my profile and packet information securely, so that only I can see my personal health data

#### Acceptance Criteria

1. THE AFYA_System SHALL provide an authenticated API endpoint at GET /api/me/client that returns client data
2. WHEN an authenticated user requests their client data, THE AFYA_System SHALL return the client profile fields associated with the user's userId
3. WHEN an authenticated user requests their client data, THE AFYA_System SHALL return all packets associated with the client including type, status, and document URL
4. THE AFYA_System SHALL restrict the /api/me/client endpoint to authenticated users only
5. WHEN a user requests client data, THE AFYA_System SHALL return only the client record linked to that user's userId

### Requirement 8

**User Story:** As a system administrator, I want the application to store client and packet data reliably, so that no client information is lost

#### Acceptance Criteria

1. THE AFYA_System SHALL persist User records with id, name, email, and role fields in the database
2. THE AFYA_System SHALL persist Client records with id, userId, fullName, email, createdAt, and updatedAt fields in the database
3. THE AFYA_System SHALL persist Packet records with id, clientId, type, status, docUrl, createdAt, updatedAt, and lastError fields in the database
4. THE AFYA_System SHALL enforce foreign key relationship between Client.userId and User.id
5. THE AFYA_System SHALL enforce foreign key relationship between Packet.clientId and Client.id
6. THE AFYA_System SHALL support packet types of "INTRO", "NUTRITION", and "WORKOUT"
7. THE AFYA_System SHALL support packet statuses of "PENDING", "READY", and "FAILED"
8. THE AFYA_System SHALL support user roles of "CLIENT", "COACH", and "ADMIN"

### Requirement 9

**User Story:** As a developer, I want the application to be deployable to production, so that clients can access the system reliably

#### Acceptance Criteria

1. THE AFYA_System SHALL be built using Next.js with App Router and TypeScript
2. THE AFYA_System SHALL use Tailwind CSS for styling
3. THE AFYA_System SHALL support deployment to Vercel with environment variables for database and authentication configuration
4. THE AFYA_System SHALL use Postgres database with Prisma ORM or Supabase for data persistence
5. THE AFYA_System SHALL implement email-based authentication using Clerk, Auth.js, or NextAuth
