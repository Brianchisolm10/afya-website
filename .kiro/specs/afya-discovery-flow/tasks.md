# Implementation Plan: AFYA Discovery Flow & Client Portal Restructure

## Overview

This implementation plan breaks down the transformation of AFYA's client journey into discrete, manageable tasks. The plan follows a phased approach to minimize risk and allow for iterative feedback.

---

## Phase 1: Discovery Flow Foundation

### 1. Create Discovery Form

- [ ] 1.1 Create discovery form page at `/start`
  - Create `app/(public)/start/page.tsx`
  - Design mobile-responsive form layout
  - Implement form with 6 fields (name, email, phone, goal dropdown, optional description, timeframe)
  - Add client-side validation with Zod schema
  - _Requirements: 1, 2_

- [ ] 1.2 Implement discovery form API
  - Create `app/api/discovery/submit/route.ts`
  - Validate form data server-side
  - Create lead record in database
  - Send confirmation email to user
  - Send notification email to admin
  - _Requirements: 2_

- [ ] 1.3 Create database schema for leads
  - Add `leads` table migration
  - Add `lead_notes` table migration
  - Create Prisma schema definitions
  - Run migrations
  - _Requirements: 2, 12_

- [ ] 1.4 Build confirmation page
  - Create success page after form submission
  - Display next steps message
  - Show calendar booking CTA
  - _Requirements: 2_

---

### 2. Calendar Integration

- [ ] 2.1 Set up Calendly integration
  - Create Calendly account and configure availability
  - Create booking page with custom questions
  - Configure webhook endpoint URL
  - Test booking flow
  - _Requirements: 3_

- [ ] 2.2 Create calendar booking page
  - Create `app/(public)/book-call/page.tsx`
  - Embed Calendly iframe with prefilled data
  - Pass discovery form data to Calendly
  - Style to match AFYA branding
  - _Requirements: 3_

- [ ] 2.3 Implement Calendly webhook handler
  - Create `app/api/webhooks/calendly/route.ts`
  - Verify webhook signature
  - Update lead status to "call_scheduled"
  - Store scheduled call time
  - Send confirmation to client and coach
  - _Requirements: 3_

---

### 3. Lead Management System

- [ ] 3.1 Create admin leads dashboard
  - Create `app/(protected)/admin/leads/page.tsx`
  - Display leads in table/kanban view
  - Implement status filters
  - Add search functionality
  - Show key metrics (conversion rate, pending calls)
  - _Requirements: 12_

- [ ] 3.2 Build lead detail view
  - Create lead detail modal/page
  - Display all form responses
  - Show call scheduling info
  - Display activity timeline
  - Add quick action buttons
  - _Requirements: 12_

- [ ] 3.3 Implement lead status management
  - Create API for updating lead status
  - Add note-taking functionality
  - Implement follow-up date setting
  - Add lead assignment to coaches
  - _Requirements: 12_

- [ ] 3.4 Build lead conversion flow
  - Create "Convert to Client" button
  - Build client account creation modal
  - Implement program assignment interface
  - Generate account setup email
  - Update lead status to "converted"
  - _Requirements: 4, 5_

---

## Phase 2: Client Portal Foundation

### 4. Portal Authentication & Setup

- [ ] 4.1 Create account setup flow
  - Create `app/(auth)/setup/[token]/page.tsx`
  - Validate setup token
  - Build password creation form
  - Implement password strength requirements
  - Create user session after setup
  - _Requirements: 5_

- [ ] 4.2 Update database schema for portal
  - Add `assigned_coach_id` to users table
  - Add `setup_token` and `setup_token_expiry` fields
  - Add `last_portal_login_at` field
  - Add `onboarding_completed` field
  - Create `client_programs` table
  - _Requirements: 5, 10_

- [ ] 4.3 Build account setup API
  - Create `app/api/auth/setup/[token]/route.ts`
  - Validate token and expiry
  - Hash and store password
  - Create user session
  - Mark setup as complete
  - _Requirements: 5_

- [ ] 4.4 Implement setup email template
  - Design welcome email template
  - Include setup link with token
  - Add coach introduction
  - Explain next steps
  - _Requirements: 5_

---

### 5. Client Portal Dashboard

- [ ] 5.1 Create portal layout
  - Create `app/(protected)/portal/layout.tsx`
  - Build navigation sidebar/header
  - Add user profile dropdown
  - Implement mobile-responsive menu
  - Add logout functionality
  - _Requirements: 16_

- [ ] 5.2 Build dashboard page
  - Create `app/(protected)/portal/dashboard/page.tsx`
  - Display personalized welcome message
  - Show assigned coach information
  - List next steps/action items
  - Display recent activity timeline
  - _Requirements: 5, 15_

- [ ] 5.3 Implement coach assignment display
  - Fetch assigned coach data
  - Display coach photo, name, and bio
  - Add "Message Coach" button
  - Show coach availability/response time
  - _Requirements: 15_

- [ ] 5.4 Create quick actions section
  - Add buttons for common actions
  - Link to assessments
  - Link to packets
  - Link to health tools
  - Link to messaging
  - _Requirements: 5_

---

### 6. Portal-Based Assessments

- [ ] 6.1 Create assessments page
  - Create `app/(protected)/portal/assessments/page.tsx`
  - List assigned assessments
  - Show completion status
  - Display progress indicators
  - Add "Start Assessment" buttons
  - _Requirements: 6_

- [ ] 6.2 Migrate intake system to portal
  - Move intake form components to portal routes
  - Update authentication checks
  - Modify routing to use portal paths
  - Preserve all existing question logic
  - _Requirements: 6, 13_

- [ ] 6.3 Implement assessment progress tracking
  - Create progress tracking component
  - Save responses to database incrementally
  - Allow pause and resume
  - Show estimated time remaining
  - Display section navigation
  - _Requirements: 6_

- [ ] 6.4 Build assessment completion flow
  - Trigger packet generation on completion
  - Display success message
  - Show estimated packet delivery time
  - Send notification email
  - Update assessment status
  - _Requirements: 6_

- [ ] 6.5 Create assessment database schema
  - Add `portal_assessments` table
  - Link to client and program
  - Store status and timestamps
  - Link to generated packet
  - _Requirements: 6_

---

### 7. Additional Assessment Requests

- [ ] 7.1 Build assessment request interface
  - Create "Request Assessment" button
  - Build request modal with assessment selection
  - Add optional note field
  - Implement submission
  - _Requirements: 7_

- [ ] 7.2 Create assessment request API
  - Create `app/api/portal/assessments/request/route.ts`
  - Validate client authentication
  - Create request record
  - Notify assigned coach
  - _Requirements: 7_

- [ ] 7.3 Build coach approval interface
  - Create admin view for pending requests
  - Add approve/deny buttons
  - Implement review note field
  - Send notification to client on decision
  - _Requirements: 7_

- [ ] 7.4 Implement assessment unlocking
  - Unlock assessment in portal on approval
  - Add to client's assessment list
  - Send email notification
  - _Requirements: 7_

- [ ] 7.5 Create assessment requests database schema
  - Add `assessment_requests` table
  - Link to client and requested assessment
  - Store status and review data
  - _Requirements: 7_

---

## Phase 3: Packet & Tool Management

### 8. Packet Management

- [ ] 8.1 Create packets page
  - Create `app/(protected)/portal/packets/page.tsx`
  - List all client packets
  - Display packet type and generation date
  - Show status (generating/ready/error)
  - Add download buttons
  - _Requirements: 11_

- [ ] 8.2 Implement packet viewing
  - Create packet detail page
  - Embed PDF viewer
  - Track view timestamp
  - Add download button
  - Show packet metadata
  - _Requirements: 11_

- [ ] 8.3 Add packet download tracking
  - Track download count
  - Store last downloaded timestamp
  - Update database on each download
  - Display download history to coaches
  - _Requirements: 11_

- [ ] 8.4 Build "New" packet indicators
  - Add badge for unviewed packets
  - Remove badge after first view
  - Show count in navigation
  - _Requirements: 11_

- [ ] 8.5 Update packet database schema
  - Add `viewed_at` field to packets table
  - Add `download_count` field
  - Add `last_downloaded_at` field
  - _Requirements: 11_

---

### 9. Portal Health Tools

- [ ] 9.1 Create portal tools page
  - Create `app/(protected)/portal/tools/page.tsx`
  - Reuse tool card components from public site
  - Add usage tracking wrapper
  - Display tool usage history
  - _Requirements: 8_

- [ ] 9.2 Implement tool usage tracking
  - Create tracking HOC for tool components
  - Log usage on tool submission
  - Store inputs and results
  - Track timestamp
  - _Requirements: 8_

- [ ] 9.3 Build tool usage history
  - Create usage history component
  - Display past tool uses with results
  - Add filtering by tool type
  - Show usage frequency stats
  - _Requirements: 8_

- [ ] 9.4 Create coach view of tool usage
  - Add tool usage section to client profile
  - Display usage summary
  - Show recent tool uses
  - Highlight patterns or concerns
  - _Requirements: 8_

- [ ] 9.5 Create tool usage database schema
  - Add `tool_usage` table
  - Link to client and tool
  - Store inputs and results as JSONB
  - Track timestamp
  - _Requirements: 8_

---

## Phase 4: Communication Features

### 10. Coach-Client Messaging

- [ ] 10.1 Create messaging page
  - Create `app/(protected)/portal/messages/page.tsx`
  - Build conversation list view
  - Display message thread
  - Add message composition form
  - _Requirements: 15_

- [ ] 10.2 Implement messaging API
  - Create `app/api/portal/messages/route.ts`
  - Handle message sending
  - Fetch conversation history
  - Mark messages as read
  - _Requirements: 15_

- [ ] 10.3 Build real-time updates
  - Implement polling or WebSocket
  - Update UI on new messages
  - Show typing indicators
  - Display read receipts
  - _Requirements: 15_

- [ ] 10.4 Add email notifications
  - Send email on new message
  - Include message preview
  - Add link to portal
  - Respect notification preferences
  - _Requirements: 15_

- [ ] 10.5 Create messaging database schema
  - Add `messages` table
  - Add `conversations` table
  - Link to client and coach
  - Store read status
  - _Requirements: 15_

---

## Phase 5: Public Site Updates

### 11. Simplify Programs Page

- [ ] 11.1 Update programs page content
  - Simplify to 3 main programs (General, Nutrition, Training)
  - Remove specialized programs from public view
  - Add "How It Works" section
  - Update all CTAs to "Start Your Journey"
  - _Requirements: 9_

- [ ] 11.2 Create program detail sections
  - Add description for each program
  - Include "Who it's for" section
  - Add sample outcomes
  - Include testimonial
  - _Requirements: 9_

- [ ] 11.3 Remove public intake forms
  - Remove `/intake` route or redirect to `/start`
  - Remove intake form components from public pages
  - Update all program CTAs
  - _Requirements: 13_

---

### 12. Update Navigation & CTAs

- [ ] 12.1 Update site navigation
  - Add "Start Your Journey" to main nav
  - Update footer links
  - Remove "Get Started" if it pointed to old intake
  - Ensure consistent CTA placement
  - _Requirements: 1, 13_

- [ ] 12.2 Update homepage CTAs
  - Change primary CTA to "Start Your Journey"
  - Update hero section
  - Modify feature sections
  - Update testimonial CTAs
  - _Requirements: 1_

- [ ] 12.3 Update all program CTAs
  - Replace intake form links with discovery form
  - Update button text consistently
  - Ensure mobile responsiveness
  - _Requirements: 9, 13_

---

## Phase 6: Data Migration & Testing

### 13. Migrate Existing Clients

- [ ] 13.1 Create migration script
  - Write script to create portal accounts for existing clients
  - Generate setup tokens
  - Assign coaches based on existing data
  - Preserve all intake responses and packets
  - _Requirements: 17_

- [ ] 13.2 Send migration emails
  - Create migration email template
  - Explain new portal
  - Include setup link
  - Provide support contact
  - _Requirements: 17_

- [ ] 13.3 Verify data integrity
  - Check all clients migrated successfully
  - Verify packet associations
  - Confirm assessment data preserved
  - Test portal access for migrated clients
  - _Requirements: 17_

---

### 14. Testing & QA

- [ ] 14.1 Write unit tests
  - Test discovery form validation
  - Test lead management logic
  - Test assessment progress tracking
  - Test packet generation triggers
  - Test tool usage tracking
  - _Requirements: All_

- [ ] 14.2 Write integration tests
  - Test discovery to portal flow
  - Test assessment request flow
  - Test packet generation flow
  - Test messaging flow
  - _Requirements: All_

- [ ] 14.3 Conduct E2E testing
  - Test complete user journey
  - Test admin workflows
  - Test coach workflows
  - Test error scenarios
  - _Requirements: All_

- [ ] 14.4 Perform accessibility testing
  - Run automated accessibility scans
  - Test keyboard navigation
  - Test screen reader compatibility
  - Verify WCAG 2.1 AA compliance
  - _Requirements: 16, 20_

- [ ] 14.5 Conduct performance testing
  - Test page load times
  - Test API response times
  - Test packet generation performance
  - Test under load
  - _Requirements: 20_

---

## Phase 7: Documentation & Training

### 15. Create Documentation

- [ ] 15.1 Write user documentation
  - Create client portal user guide
  - Document discovery process
  - Explain assessment completion
  - Document tool usage
  - _Requirements: All_

- [ ] 15.2 Write admin documentation
  - Document lead management process
  - Explain client conversion workflow
  - Document coach assignment
  - Explain assessment approval process
  - _Requirements: 4, 12_

- [ ] 15.3 Write technical documentation
  - Document API endpoints
  - Explain database schema
  - Document deployment process
  - Create troubleshooting guide
  - _Requirements: All_

---

### 16. Staff Training

- [ ] 16.1 Train on discovery call process
  - Explain new lead flow
  - Practice call scenarios
  - Review program recommendations
  - Discuss conversion process
  - _Requirements: 4_

- [ ] 16.2 Train on portal administration
  - Demonstrate lead management
  - Show client conversion process
  - Explain assessment approval
  - Review messaging features
  - _Requirements: 12, 15_

- [ ] 16.3 Create training materials
  - Record video tutorials
  - Create quick reference guides
  - Build FAQ document
  - _Requirements: All_

---

## Phase 8: Launch & Monitoring

### 17. Soft Launch

- [ ] 17.1 Deploy to production
  - Run final pre-launch checks
  - Deploy code to production
  - Run database migrations
  - Verify all services running
  - _Requirements: All_

- [ ] 17.2 Monitor initial usage
  - Watch error logs
  - Track conversion metrics
  - Monitor performance
  - Gather user feedback
  - _Requirements: 18_

- [ ] 17.3 Address issues quickly
  - Fix critical bugs immediately
  - Document known issues
  - Communicate with users
  - _Requirements: All_

---

### 18. Full Launch

- [ ] 18.1 Announce new experience
  - Send email to existing clients
  - Post on social media
  - Update website announcement
  - _Requirements: All_

- [ ] 18.2 Implement analytics
  - Set up conversion tracking
  - Track portal engagement
  - Monitor tool usage
  - Track messaging activity
  - _Requirements: 18_

- [ ] 18.3 Establish monitoring
  - Set up error alerting
  - Configure performance monitoring
  - Create admin dashboards
  - Schedule regular reviews
  - _Requirements: 18_

---

## Success Criteria

### Conversion Metrics
- Discovery form submission rate > 5% of site visitors
- Call scheduling rate > 80% of form submissions
- Client conversion rate > 50% of completed calls

### Portal Engagement
- Client login within 48 hours of setup > 90%
- Assessment completion within 7 days > 75%
- Tool usage at least once per month > 60%
- Message response rate < 24 hours > 85%

### System Performance
- Page load time < 2 seconds
- API response time < 500ms
- Packet generation time < 5 minutes
- Zero critical security vulnerabilities

---

## Timeline Estimate

- **Phase 1**: 2 weeks (Discovery Flow Foundation)
- **Phase 2**: 2 weeks (Client Portal Foundation)
- **Phase 3**: 1.5 weeks (Packet & Tool Management)
- **Phase 4**: 1.5 weeks (Communication Features)
- **Phase 5**: 1 week (Public Site Updates)
- **Phase 6**: 1 week (Data Migration & Testing)
- **Phase 7**: 1 week (Documentation & Training)
- **Phase 8**: 1 week (Launch & Monitoring)

**Total**: ~11 weeks (2.5-3 months)

---

## Risk Mitigation

### Technical Risks
- **Risk**: Data migration failures
- **Mitigation**: Extensive testing, rollback plan, backup before migration

### User Experience Risks
- **Risk**: Existing clients confused by changes
- **Mitigation**: Clear communication, migration guide, support availability

### Business Risks
- **Risk**: Conversion rate drops during transition
- **Mitigation**: Soft launch, A/B testing, quick iteration

---

This implementation plan provides a structured approach to transforming AFYA's client journey while minimizing risk and ensuring quality at each phase.
