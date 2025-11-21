# Requirements Document: AFYA Discovery Flow & Client Portal Restructure

## Introduction

This specification defines a fundamental restructuring of the AFYA client journey to create a relationship-first, human-centered experience that differentiates AFYA from generic fitness program websites. The system will separate public discovery from authenticated client services, reducing overwhelm while maintaining the sophisticated intake and packet generation capabilities already built.

## Glossary

- **Discovery Flow**: The public-facing process where prospective clients express interest and schedule a consultation call
- **Discovery Form**: A simple, non-intimidating form that captures basic information and intent
- **Discovery Call**: A human-to-human consultation where AFYA staff assess needs and recommend programs
- **Client Portal**: The authenticated dashboard where clients access assessments, packets, tools, and coaching
- **Intake Assessment**: Detailed questionnaires completed within the client portal after enrollment
- **Packet**: Personalized PDF document generated from intake assessment responses
- **Health Tools**: Educational calculators and resources available both publicly and within the portal
- **Program Assignment**: The process of assigning specific coaching programs to clients based on discovery call outcomes

---

## Requirements

### Requirement 1: Simplified Public Entry Point

**User Story**: As a prospective client visiting the AFYA website, I want a clear and simple way to express interest without feeling overwhelmed by complex forms, so that I can easily take the first step toward wellness coaching.

#### Acceptance Criteria

1. WHEN a user visits the public website, THE System SHALL display a primary call-to-action button labeled "Start Your Journey"
2. WHEN a user clicks "Start Your Journey", THE System SHALL present a Discovery Form with no more than 6 fields
3. WHEN a user views the Programs page, THE System SHALL display high-level program descriptions without detailed intake forms
4. WHEN a user navigates the public site, THE System SHALL NOT require authentication to view educational content or health tools
5. WHEN a user completes the Discovery Form, THE System SHALL redirect them to a calendar scheduling page

---

### Requirement 2: Discovery Form Simplicity

**User Story**: As a prospective client, I want to share my basic information and goals quickly, so that I can schedule a conversation without spending 20 minutes on forms.

#### Acceptance Criteria

1. THE Discovery Form SHALL collect exactly these fields: full name, email address, phone number, primary goal (dropdown), open-text goal description (optional), and preferred start timeframe
2. WHEN a user submits the Discovery Form, THE System SHALL validate that required fields (name, email, phone, primary goal) are completed
3. WHEN form validation passes, THE System SHALL create a lead record in the database with status "pending_call"
4. WHEN the form is submitted successfully, THE System SHALL send a confirmation email to the user
5. WHEN the form is submitted successfully, THE System SHALL notify AFYA staff via email or admin notification

---

### Requirement 3: Calendar Integration for Discovery Calls

**User Story**: As a prospective client, I want to immediately schedule my discovery call after expressing interest, so that I can secure a time that works for my schedule.

#### Acceptance Criteria

1. WHEN a user successfully submits the Discovery Form, THE System SHALL redirect them to a "Book Your Call" page
2. THE "Book Your Call" page SHALL display an embedded calendar scheduling interface
3. WHEN a user selects a time slot, THE System SHALL create a calendar event for both the client and AFYA staff
4. WHEN a calendar event is created, THE System SHALL send confirmation emails with call details to both parties
5. THE System SHALL update the lead record status to "call_scheduled" when a time is booked

---

### Requirement 4: Discovery Call Workflow for Staff

**User Story**: As an AFYA coach or admin, I want to review prospective client information before our call and document the outcome afterward, so that I can provide personalized recommendations and properly onboard clients.

#### Acceptance Criteria

1. WHEN a discovery call is scheduled, THE System SHALL display the lead in the admin dashboard with status "call_scheduled"
2. THE admin dashboard SHALL display the prospective client's Discovery Form responses
3. WHEN a staff member completes a discovery call, THE System SHALL provide options to: create client account, schedule follow-up, or mark as not interested
4. WHEN staff selects "create client account", THE System SHALL generate an account setup invitation email
5. WHEN a client account is created, THE System SHALL allow staff to assign one or more programs to the client

---

### Requirement 5: Client Portal Access and Onboarding

**User Story**: As a new client who completed a discovery call, I want to receive a secure invitation to access my personalized portal, so that I can begin my wellness journey with AFYA.

#### Acceptance Criteria

1. WHEN staff creates a client account, THE System SHALL generate a unique, time-limited setup token
2. THE System SHALL send an account setup email containing the setup link to the client
3. WHEN a client clicks the setup link, THE System SHALL present a password creation form
4. WHEN a client completes account setup, THE System SHALL redirect them to the client portal dashboard
5. THE client portal dashboard SHALL display a personalized welcome message and next steps

---

### Requirement 6: Portal-Based Intake Assessments

**User Story**: As a new client in the portal, I want to complete a comprehensive assessment tailored to my assigned program, so that AFYA can create my personalized wellness packet.

#### Acceptance Criteria

1. WHEN a client first logs into the portal, THE System SHALL display an "Assessments" section with their assigned intake assessment
2. THE intake assessment SHALL be specific to the client's assigned program (nutrition, training, youth, athlete, recovery, or general)
3. WHEN a client completes an intake assessment, THE System SHALL save responses and trigger packet generation
4. THE System SHALL display assessment completion status and estimated packet delivery time
5. WHEN a packet is generated, THE System SHALL notify the client via email and in-portal notification

---

### Requirement 7: Multiple Assessment Support

**User Story**: As an existing client whose needs have evolved, I want to request additional assessments without leaving the portal, so that I can expand my program without starting over.

#### Acceptance Criteria

1. THE client portal SHALL provide a "Request Additional Assessment" feature
2. WHEN a client requests an additional assessment, THE System SHALL notify their assigned coach for approval
3. WHEN a coach approves an additional assessment, THE System SHALL unlock that assessment in the client's portal
4. WHEN a client completes an additional assessment, THE System SHALL generate a new packet without affecting existing packets
5. THE System SHALL maintain a history of all completed assessments and generated packets

---

### Requirement 8: Portal-Integrated Health Tools

**User Story**: As a client, I want access to all health tools within my portal with my usage tracked, so that my coach can see my engagement and I don't need to visit the public site.

#### Acceptance Criteria

1. THE client portal SHALL include all health tools available on the public site
2. WHEN a client uses a health tool in the portal, THE System SHALL log the usage with timestamp and inputs
3. THE System SHALL display a usage history for each tool in the client's portal
4. WHEN a coach views a client's profile, THE System SHALL display the client's tool usage summary
5. THE health tools in the portal SHALL function identically to the public versions

---

### Requirement 9: Simplified Public Programs Page

**User Story**: As a prospective client browsing programs, I want to understand what AFYA offers without being pressured to fill out detailed forms, so that I can make an informed decision before committing.

#### Acceptance Criteria

1. THE public Programs page SHALL display only three program categories: General Wellness, Nutrition Coaching, and Training Programs
2. EACH program category SHALL include: description, who it's for, sample outcomes, testimonial, and "Start Your Journey" CTA
3. THE Programs page SHALL NOT display specialized programs (Athlete, Youth, Recovery) publicly
4. WHEN a user clicks any program CTA, THE System SHALL direct them to the Discovery Form
5. THE Programs page SHALL include a section explaining "How It Works" with the discovery call process

---

### Requirement 10: Portal Program Visibility

**User Story**: As a client in the portal, I want to see all available programs including specialized options, so that I can discuss expanding my program with my coach.

#### Acceptance Criteria

1. THE client portal SHALL display all program options including specialized programs (Athlete, Youth, Recovery)
2. WHEN a client views a program they're not enrolled in, THE System SHALL display a "Request Program" button
3. WHEN a client requests a program, THE System SHALL notify their assigned coach
4. THE System SHALL indicate which programs the client is currently enrolled in
5. THE System SHALL allow coaches to assign or remove programs from the admin interface

---

### Requirement 11: Packet Management in Portal

**User Story**: As a client, I want to view, download, and track all my personalized packets in one place, so that I can easily access my wellness plans.

#### Acceptance Criteria

1. THE client portal SHALL display a "My Packets" section listing all generated packets
2. EACH packet listing SHALL show: packet type, generation date, status, and download button
3. WHEN a client clicks download, THE System SHALL serve the PDF packet file
4. THE System SHALL track packet downloads with timestamp
5. WHEN a new packet is generated, THE System SHALL display a "New" badge until the client views it

---

### Requirement 12: Admin Lead Management

**User Story**: As an AFYA admin, I want to manage all discovery form submissions and track them through the conversion funnel, so that no prospective clients fall through the cracks.

#### Acceptance Criteria

1. THE admin dashboard SHALL display a "Leads" section with all Discovery Form submissions
2. THE System SHALL categorize leads by status: pending_call, call_scheduled, call_completed, converted, not_interested
3. WHEN an admin views a lead, THE System SHALL display: contact info, form responses, call notes, and action history
4. THE System SHALL allow admins to add notes, schedule follow-ups, and change lead status
5. THE System SHALL provide lead conversion metrics and reporting

---

### Requirement 13: Removal of Public Intake Forms

**User Story**: As a site visitor, I want a clean, focused experience without being confronted by multiple complex intake forms, so that I feel welcomed rather than overwhelmed.

#### Acceptance Criteria

1. THE System SHALL remove all detailed intake forms from public pages
2. THE public /intake route SHALL redirect to the Discovery Form
3. THE System SHALL preserve all intake form logic and question blocks for portal use
4. THE System SHALL migrate existing intake paths to portal-only access
5. THE System SHALL update all public CTAs to point to the Discovery Form

---

### Requirement 14: Progressive Disclosure of Complexity

**User Story**: As a new client, I want to be introduced to AFYA's capabilities gradually, so that I'm not overwhelmed but can discover more as I'm ready.

#### Acceptance Criteria

1. THE client portal first-login experience SHALL display only: welcome message, next steps, and primary assessment
2. WHEN a client completes their first assessment, THE System SHALL unlock additional portal features progressively
3. THE System SHALL provide tooltips and guided tours for new portal features
4. THE System SHALL allow clients to dismiss or skip guided tours
5. THE System SHALL remember which features a client has explored to avoid repetitive guidance

---

### Requirement 15: Coach Assignment and Communication

**User Story**: As a client, I want to know who my coach is and be able to communicate with them through the portal, so that I have a clear point of contact for my wellness journey.

#### Acceptance Criteria

1. WHEN a client account is created, THE System SHALL assign a primary coach
2. THE client portal SHALL display the assigned coach's name, photo, and bio
3. THE System SHALL provide an in-portal messaging feature for client-coach communication
4. WHEN a client sends a message, THE System SHALL notify the coach via email and in-portal notification
5. THE System SHALL maintain a message history accessible to both client and coach

---

### Requirement 16: Mobile-Responsive Portal

**User Story**: As a client who primarily uses mobile devices, I want the portal to work seamlessly on my phone, so that I can access my wellness resources anywhere.

#### Acceptance Criteria

1. THE client portal SHALL be fully functional on screens as small as 320px wide
2. THE portal navigation SHALL adapt to mobile with a hamburger menu
3. THE intake assessments SHALL be mobile-optimized with appropriate input types
4. THE packet viewer SHALL support mobile PDF viewing
5. THE health tools SHALL maintain full functionality on mobile devices

---

### Requirement 17: Data Migration and Preservation

**User Story**: As an existing AFYA client with completed intakes, I want my data preserved and accessible in the new portal, so that I don't lose my progress or history.

#### Acceptance Criteria

1. THE System SHALL migrate all existing client intake responses to the new portal structure
2. THE System SHALL preserve all existing generated packets and make them accessible in the portal
3. THE System SHALL maintain referential integrity between clients, assessments, and packets
4. THE System SHALL provide a migration report showing successful data transfers
5. THE System SHALL create portal accounts for all existing clients with email notifications

---

### Requirement 18: Analytics and Insights

**User Story**: As an AFYA administrator, I want to track conversion rates and client engagement, so that I can optimize the discovery process and portal experience.

#### Acceptance Criteria

1. THE System SHALL track: discovery form submissions, call scheduling rate, call completion rate, and client conversion rate
2. THE System SHALL track portal engagement: login frequency, assessment completion rate, tool usage, and packet downloads
3. THE admin dashboard SHALL display key metrics with visual charts
4. THE System SHALL allow exporting analytics data for external analysis
5. THE System SHALL provide cohort analysis comparing different client acquisition sources

---

### Requirement 19: Security and Privacy

**User Story**: As a client, I want my health information and personal data protected with industry-standard security, so that I can trust AFYA with sensitive information.

#### Acceptance Criteria

1. THE System SHALL encrypt all client data at rest and in transit
2. THE System SHALL implement role-based access control (RBAC) for portal features
3. THE System SHALL log all access to sensitive client data for audit purposes
4. THE System SHALL comply with HIPAA privacy requirements for health information
5. THE System SHALL provide clients with data export and deletion capabilities per GDPR

---

### Requirement 20: Graceful Degradation

**User Story**: As a user with an older browser or slower connection, I want the site to remain functional even if some features don't work perfectly, so that I'm not excluded from AFYA's services.

#### Acceptance Criteria

1. THE System SHALL function on browsers released within the last 3 years
2. WHEN JavaScript is disabled, THE System SHALL display a message explaining required features
3. THE System SHALL optimize images and assets for slow connections
4. THE System SHALL provide loading indicators for operations taking longer than 2 seconds
5. THE System SHALL implement progressive enhancement for advanced features
