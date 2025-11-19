# Implementation Plan

- [x] 1. Initialize Next.js project with TypeScript and Tailwind CSS
  - Create new Next.js 14+ project using create-next-app with App Router, TypeScript, and Tailwind CSS
  - Configure TypeScript with strict mode enabled
  - Set up Tailwind CSS configuration with custom theme colors for AFYA branding
  - Create basic directory structure: app/(public), app/(auth), app/(protected), components, lib, types
  - _Requirements: 9.1, 9.2_

- [x] 2. Set up database and Prisma ORM
  - Install Prisma and initialize with PostgreSQL
  - Create Prisma schema with User, Client, and Packet models including enums for Role, PacketType, and PacketStatus
  - Define relationships: User ↔ Client (one-to-one), Client ↔ Packet (one-to-many)
  - Add indexes for clientId and email fields for query optimization
  - Generate Prisma Client and create initial migration
  - Create lib/db.ts with singleton Prisma client instance
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 9.4_

- [x] 3. Configure NextAuth.js for email authentication
  - Install NextAuth.js v5 and email provider dependencies
  - Create lib/auth.ts with NextAuth configuration using Email provider
  - Set up API route at app/api/auth/[...nextauth]/route.ts
  - Configure Prisma adapter for NextAuth to store sessions and verification tokens
  - Add required environment variables: NEXTAUTH_URL, NEXTAUTH_SECRET, EMAIL_FROM
  - Create middleware.ts to protect routes based on authentication status
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 9.5_

- [x] 4. Build public marketing pages
  - [x] 4.1 Create home page with hero section
    - Build app/(public)/page.tsx with hero section displaying AFYA mission and "A Happier, Healthier You. Your way." messaging
    - Add "Start Your Journey" CTA button linking to /get-started
    - Style with Tailwind CSS for responsive design
    - _Requirements: 1.1, 1.3_
  
  - [x] 4.2 Create services page
    - Build app/(public)/services/page.tsx describing Intro, Nutrition, and Workout packets
    - Add "coming soon" badges for future educational packets
    - Include high-level overview of packet generation and delivery process
    - _Requirements: 1.2, 1.4_
  
  - [x] 4.3 Create shared public layout
    - Build app/(public)/layout.tsx with navigation header and footer
    - Add navigation links to home, services, and get-started pages
    - Implement responsive mobile menu
    - _Requirements: 1.1, 1.2_

- [x] 5. Implement intake form and submission
  - [x] 5.1 Create intake form component
    - Build components/forms/IntakeForm.tsx with fields for fullName, email, and goal selection
    - Implement client-side validation for email format and required fields
    - Add form state management with React hooks
    - Style form with Tailwind CSS including error states
    - _Requirements: 2.1, 2.5_
  
  - [x] 5.2 Create intake submission API endpoint
    - Build app/api/intake/submit/route.ts to handle POST requests
    - Implement server-side validation for email format and required fields
    - Create User record with role CLIENT and Client record in database using Prisma
    - Create Packet records with status PENDING for INTRO packet type
    - Return client data and packet status in response
    - Add error handling for duplicate email addresses
    - _Requirements: 2.2, 2.3, 8.1, 8.2, 8.3_
  
  - [x] 5.3 Create get-started page with form and confirmation
    - Build app/(public)/get-started/page.tsx integrating IntakeForm component
    - Implement form submission handler calling POST /api/intake/submit
    - Show confirmation screen after successful submission with instructions to check email
    - Display error messages for failed submissions
    - _Requirements: 2.1, 2.4_

- [x] 6. Build authentication pages
  - Create app/(auth)/login/page.tsx with email input form for magic link authentication
  - Integrate with NextAuth signIn function
  - Add loading states and error handling for authentication failures
  - Implement redirect to dashboard after successful login
  - Style login page with Tailwind CSS
  - _Requirements: 3.1, 3.2_

- [x] 7. Implement client data API endpoint
  - Build app/api/me/client/route.ts to handle GET requests
  - Add authentication check using NextAuth getServerSession
  - Query database for Client record matching authenticated user's userId
  - Include related Packet records with type, status, docUrl fields
  - Return client profile and packets array in response
  - Add error handling for missing client record
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 8. Build client dashboard
  - [x] 8.1 Create packet card component
    - Build components/dashboard/PacketCard.tsx accepting packet props
    - Display packet type label and status badge with color coding (PENDING: gray, READY: green, FAILED: red)
    - Show "View Packet" link button when status is READY and docUrl exists
    - Style with Tailwind CSS for consistent card layout
    - _Requirements: 4.2, 4.3, 4.4, 4.5_
  
  - [x] 8.2 Create dashboard page
    - Build app/(protected)/dashboard/page.tsx with authentication check
    - Fetch client data from GET /api/me/client endpoint
    - Display welcome message with client name
    - Render PacketCard components for each packet in grid layout
    - Add "Weekly Check-Ins" section with persistent link to progress form
    - Add "Next Steps" section with guidance text on document usage
    - Implement loading and error states
    - _Requirements: 4.1, 4.2, 4.6, 4.7_
  
  - [x] 8.3 Create protected layout with navigation
    - Build app/(protected)/layout.tsx with authentication middleware
    - Add navigation header with logout button
    - Redirect unauthenticated users to login page
    - _Requirements: 3.3, 3.4_

- [x] 9. Implement webhook endpoint for packet updates
  - Build app/api/packets/update/route.ts to handle POST requests from Google Apps Script
  - Verify X-Webhook-Secret header matches WEBHOOK_SECRET environment variable
  - Return 401 Unauthorized for invalid or missing secret
  - Parse request body for clientEmail or clientId, packetType, status, docUrl, and error fields
  - Query database to find Client by email or id
  - Find matching Packet record by clientId and type
  - Update Packet with new status (READY or FAILED), docUrl, and lastError fields
  - Return success response with updated packet data
  - Add comprehensive error handling and logging for debugging
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 10. Build admin panel
  - [x] 10.1 Create client table component
    - Build components/admin/ClientTable.tsx displaying all clients
    - Show columns for name, email, createdAt, and packet count
    - Implement click handler to view client details
    - Add sorting functionality for columns
    - Style with Tailwind CSS for table layout
    - _Requirements: 6.3_
  
  - [x] 10.2 Create client detail view component
    - Build components/admin/ClientDetail.tsx showing selected client's packets
    - Display packet type, status badge, docUrl, and lastError for failed packets
    - Style with Tailwind CSS for detail layout
    - _Requirements: 6.4_
  
  - [x] 10.3 Create admin page with role-based access
    - Build app/(protected)/admin/page.tsx with role check for ADMIN or COACH
    - Fetch all clients with packet counts from database
    - Integrate ClientTable and ClientDetail components
    - Redirect CLIENT role users to dashboard with 403 error
    - Add loading and error states
    - _Requirements: 6.1, 6.2, 6.5_

- [x] 11. Add environment configuration and deployment setup
  - Create .env.example file documenting all required environment variables
  - Add environment variable validation in lib/env.ts
  - Configure next.config.js for production optimizations
  - Create vercel.json with build configuration
  - Document deployment steps in README.md including Prisma migration commands
  - Add build script to run Prisma generate and migrations
  - _Requirements: 9.3, 9.4, 9.5_

- [x] 12. Implement error handling and validation
  - Create lib/utils.ts with validation helper functions for email format
  - Add error boundary components for graceful error display
  - Implement toast notification system for user feedback
  - Add comprehensive error logging in API routes
  - Create custom error types for different failure scenarios
  - Add retry logic for transient failures in API calls
  - _Requirements: 2.5, 5.2, 5.3_

- [x] 13. Add TypeScript types and interfaces
  - Create types/index.ts with interfaces for User, Client, Packet entities
  - Define API request and response types for all endpoints
  - Add form data types for intake and login forms
  - Export Prisma-generated types for use in components
  - Add utility types for role-based access control
  - _Requirements: 9.1_

- [x] 14. Style and polish UI components
  - Create components/ui directory with reusable UI components (Button, Card, Badge, Input)
  - Implement consistent color scheme and typography using Tailwind config
  - Add loading spinners and skeleton screens for async operations
  - Ensure responsive design works on mobile, tablet, and desktop
  - Add hover states and transitions for interactive elements
  - Implement accessibility features (ARIA labels, keyboard navigation)
  - _Requirements: 9.2_
