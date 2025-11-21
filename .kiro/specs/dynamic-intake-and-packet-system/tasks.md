# Implementation Plan

- [x] 1. Database Schema and Models Setup
  - Update Prisma schema with new models: IntakeProgress, QuestionBlock, IntakePath, PacketTemplate, IntakeAnalytics
  - Add new enums: ClientType, expanded PacketType
  - Enhance Client model with intake response fields and JSON storage
  - Enhance Packet model with content, versioning, and generation metadata
  - Run database migration to apply schema changes
  - _Requirements: 1.3, 9.3, 11.2, 11.4_

- [x] 2. Question Block Library System
  - [x] 2.1 Create question block data structure and types
    - Define TypeScript interfaces for Question, QuestionBlock, ValidationRule, ConditionalRule
    - Create question type definitions: text, number, select, multiselect, radio, checkbox, textarea, date, range
    - Implement validation rule types and logic
    - _Requirements: 9.1, 9.2, 22.1, 22.2_
  
  - [x] 2.2 Seed initial question blocks for all intake paths
    - Create nutrition-focused question blocks (demographics, diet, allergies, preferences, lifestyle)
    - Create workout-focused question blocks (training goals, experience, equipment, schedule, limitations)
    - Create athlete-specific question blocks (performance metrics, sport details, periodization)
    - Create youth-specific question blocks (grade, sports, safety, parent info)
    - Create wellness question blocks (general health, activity, barriers)
    - Create situation based question blocks (injury, pain, limitations, recovery)
    - Store question blocks in database via seed script
    - _Requirements: 2.2, 3.2, 5.2, 6.2, 7.2, 8.2_

- [x] 3. Intake Path Configuration
  - [x] 3.1 Create intake path definitions for each client type
    - Define path for NUTRITION_ONLY with appropriate question blocks
    - Define path for WORKOUT_ONLY with appropriate question blocks
    - Define path for FULL_PROGRAM combining nutrition and workout blocks
    - Define path for ATHLETE_PERFORMANCE with NSCA-CSCS aligned blocks
    - Define path for YOUTH with age-appropriate blocks
    - Define path for GENERAL_WELLNESS with simplified blocks
    - Define path for SITUATION_BASED with condition-focused blocks
    - _Requirements: 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1_
  
  - [x] 3.2 Implement branching logic rules for each path
    - Create conditional display rules for follow-up questions
    - Implement skip logic for irrelevant sections
    - Define required vs optional question blocks per path
    - Store branching rules in IntakePath configuration
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 4. Frontend: Path Selection Screen
  - [x] 4.1 Create PathSelectionScreen component
    - Design UI with 7 path option cards
    - Add icons and descriptions for each path
    - Include estimated completion time for each path
    - Implement path selection handler
    - Add responsive design for mobile/desktop
    - _Requirements: 1.1, 1.2, 1.4_
  
  - [x] 4.2 Add path selection routing and state management
    - Store selected path in component state
    - Navigate to intake form on path selection
    - Allow back navigation to change path selection
    - _Requirements: 1.3, 1.5_

- [x] 5. Frontend: Dynamic Intake Form Components
  - [x] 5.1 Create QuestionRenderer component
    - Implement text input renderer
    - Implement number input renderer
    - Implement select/dropdown renderer
    - Implement multi-select renderer
    - Implement radio button renderer
    - Implement checkbox renderer
    - Implement textarea renderer
    - Implement date picker renderer
    - Implement range slider renderer
    - Add validation error display
    - Add help text tooltips
    - _Requirements: 22.3, 22.4_
  
  - [x] 5.2 Create DynamicIntakeForm component
    - Fetch intake path configuration based on selected client type
    - Load question blocks for the path
    - Render questions dynamically using QuestionRenderer
    - Implement form state management
    - Handle user input and update state
    - Evaluate branching logic on answer changes
    - Show/hide question blocks based on conditions
    - _Requirements: 10.1, 10.2, 10.3, 10.5_
  
  - [x] 5.3 Implement form validation
    - Validate required fields before progression
    - Validate data types and formats
    - Display validation errors inline
    - Prevent submission of invalid data
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_
  
  - [x] 5.4 Create ProgressTracker component
    - Display progress bar showing percentage complete
    - Show section names and completion status
    - Allow navigation to completed sections
    - Update progress as user completes questions
    - _Requirements: 21.1, 21.4_
  
  - [x] 5.5 Implement auto-save functionality
    - Save form responses to database periodically
    - Save on field blur events
    - Store progress in IntakeProgress model
    - Show save status indicator
    - _Requirements: 21.2, 21.3_

- [x] 6. Backend: Intake Submission API
  - [x] 6.1 Create intake submission endpoint
    - Implement POST /api/intake/submit route
    - Validate authentication and authorization
    - Validate intake completion and required fields
    - Parse and sanitize intake responses
    - _Requirements: 22.1, 22.2, 22.5_
  
  - [x] 6.2 Implement client profile generation
    - Create IntakeService.generateClientProfile method
    - Map intake responses to Client model fields
    - Store structured responses in intakeResponses JSON field
    - Set clientType based on selected path
    - Save client profile to database
    - Mark intake as complete
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [x] 6.3 Implement packet routing logic
    - Create PacketRoutingService.determineRequiredPackets method
    - Determine packet types based on clientType
    - Create packet records with PENDING status
    - Queue packets for generation
    - Return packet IDs to client
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8_

- [x] 7. Backend: Progress Save and Retrieval API
  - [x] 7.1 Create POST /api/intake/progress endpoint
    - Validate authentication
    - Update or create IntakeProgress record
    - Store partial responses and current step
    - Return success confirmation
    - _Requirements: 21.2, 21.3, 21.4_
  
  - [x] 7.2 Create GET /api/intake/progress endpoint
    - Validate authentication
    - Fetch IntakeProgress for authenticated user
    - Return saved responses and current step
    - Handle case where no progress exists
    - _Requirements: 21.4_

- [x] 9. Packet Template System
  - [x] 9.1 Create packet template data structure
    - Define TypeScript interfaces for PacketTemplate, Section, ContentBlock
    - Implement template placeholder system
    - Create template rendering utilities
    - _Requirements: 24.1, 24.2_
  
  - [x] 9.2 Create default templates for each packet type
    - Create Nutrition Packet template with sections: overview, macros, meal plan, shopping list, tips
    - Create Workout Packet template with sections: overview, schedule, exercises, progression, tips
    - Create Performance Packet template with sections: periodization, power, strength, conditioning, recovery
    - Create Youth Packet template with sections: safety, basics, progression, parent guide
    - Create Recovery Packet template with sections: limitations, safe movements, progression, pain management
    - Store templates in database via seed script
    - _Requirements: 13.2, 14.2, 15.2, 16.2, 17.2_
  
  - [x] 9.3 Implement template population logic
    - Create method to replace placeholders with client data
    - Handle conditional sections based on client profile
    - Calculate derived values (e.g., calorie targets, macro splits)
    - Format data for display
    - _Requirements: 13.3, 14.3, 15.3, 17.3_

- [x] 10. Packet Generation Service
  - [x] 10.1 Create background job queue system
    - Set up job queue infrastructure (e.g., BullMQ, pg-boss)
    - Create packet generation job processor
    - Implement job retry logic
    - Add job monitoring and logging
    - _Requirements: 25.2_
  
  - [x] 10.2 Implement PacketGenerationService
    - Create generatePacket method that orchestrates generation
    - Fetch client data and packet template
    - Populate template with client data
    - Generate custom content sections
    - Format final packet content
    - Store packet content in database
    - Update packet status to READY
    - _Requirements: 13.1, 14.1, 15.1, 16.1, 17.1_
  
  - [x] 10.3 Implement nutrition packet generation logic
    - Calculate daily calorie targets based on goals and activity level
    - Calculate macronutrient breakdown
    - Generate meal timing recommendations
    - Create sample meal plans incorporating preferences and restrictions
    - Generate shopping lists
    - Add practical adherence tips
    - _Requirements: 13.2, 13.3, 13.4_
  
  - [x] 10.4 Implement workout packet generation logic
    - Create training schedule based on frequency and availability
    - Select exercises based on equipment, experience, and goals
    - Assign sets, reps, and rest periods
    - Create progression plan
    - Add exercise instructions and safety notes
    - _Requirements: 14.2, 14.3, 14.4_
  
  - [x] 10.5 Implement performance packet generation logic
    - Create periodized training blocks based on season phase
    - Design power development protocols
    - Design speed and agility work
    - Create strength programming with appropriate loading
    - Design conditioning protocols specific to sport demands
    - Include recovery and regeneration strategies
    - Align with NSCA-CSCS principles
    - _Requirements: 15.2, 15.3, 15.4_
  
  - [x] 10.6 Implement youth packet generation logic
    - Use age-appropriate language and instructions
    - Emphasize safety and proper form
    - Create progressive development plans
    - Include parent/guardian guidance sections
    - Avoid advanced metrics and complex programming
    - _Requirements: 16.2, 16.3, 16.4_
  
  - [x] 10.7 Implement recovery packet generation logic
    - Identify safe movement patterns based on injury/condition
    - List exercises and positions to avoid
    - Create progressive loading strategies
    - Include pain management guidance
    - Provide return-to-activity protocols
    - Add clear safety warnings
    - _Requirements: 17.2, 17.3, 17.4_

- [x] 11. PDF Export Service
  - Implement PDF generation from packet content
  - Create PDF templates with proper formatting
  - Add branding and styling
  - Store PDF files in designated storage
  - Update packet record with PDF URL
  - _Requirements: 13.5, 14.5, 15.5, 16.5, 17.5, 20.2_

- [x] 12. Client Dashboard: Packet Display
  - [x] 12.1 Create PacketList component
    - Fetch packets for authenticated client
    - Display packet cards with type, status, and date
    - Show loading state for PENDING packets
    - Show error state for FAILED packets
    - Provide view/download buttons for READY packets
    - _Requirements: 19.1, 19.2, 19.3, 19.4_
  
  - [x] 12.2 Create PacketViewer component
    - Fetch packet content by ID
    - Render packet sections in readable format
    - Style content appropriately (headings, lists, tables)
    - Add download PDF button
    - Add print button
    - Ensure responsive design
    - _Requirements: 19.3, 20.2_
  
  - [x] 12.3 Implement packet access API
    - Create GET /api/packets/:id endpoint
    - Validate authentication and authorization
    - Ensure client can only access their own packets
    - Return packet content
    - _Requirements: 19.3, 20.3_

- [x] 13. Admin Interface: Packet Management
  - [x] 13.1 Enhance AdminPanel with packet management
    - Display client list with packet counts
    - Show packet generation status for each client
    - Add filters for packet status (PENDING, READY, FAILED)
    - _Requirements: 18.1, 18.2_
  
  - [x] 13.2 Create AdminPacketManager component
    - Display all packets for selected client
    - Show packet type, status, generation date
    - Provide view packet button
    - Provide edit packet button
    - Provide regenerate packet button
    - Provide delete packet button
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_
  
  - [x] 13.3 Implement admin packet edit functionality
    - Create packet editor interface
    - Allow editing of packet content sections
    - Save edited content to database
    - Update packet version number
    - Store previous version reference
    - _Requirements: 18.3, 20.4_
  
  - [x] 13.4 Implement packet regeneration
    - Create POST /api/admin/packets/:id/regenerate endpoint
    - Validate admin authorization
    - Queue packet for regeneration
    - Increment version number
    - Return updated packet status
    - _Requirements: 18.4_

- [x] 14. Admin Interface: Template Management
  - [x] 14.1 Create TemplateManager component
    - Display list of all packet templates
    - Show template name, type, and client type
    - Provide create new template button
    - Provide edit template button
    - Provide delete template button
    - Provide preview template button
    - _Requirements: 24.1, 24.2, 24.4_
  
  - [x] 14.2 Create TemplateEditor component
    - Allow editing template sections
    - Allow editing content blocks
    - Support placeholder syntax
    - Provide template preview with sample data
    - Save template to database
    - _Requirements: 24.2, 24.4_
  
  - [x] 14.3 Implement template management API
    - Create GET /api/admin/templates endpoint
    - Create POST /api/admin/templates endpoint
    - Create PUT /api/admin/templates/:id endpoint
    - Create DELETE /api/admin/templates/:id endpoint
    - Validate admin authorization for all endpoints
    - _Requirements: 24.1, 24.2, 24.5_

- [x] 15. Error Handling and Retry Logic
  - [x] 15.1 Implement packet generation error handling
    - Catch and log generation errors
    - Update packet status to FAILED
    - Store error message in lastError field
    - Increment retryCount
    - _Requirements: 13.5, 14.5, 15.5, 16.5, 17.5_
  
  - [x] 15.2 Implement automatic retry logic
    - Check if packet should be retried (retryCount < 3)
    - Re-queue failed packets for retry
    - Implement exponential backoff for retries
    - _Requirements: 25.2_
  
  - [x] 15.3 Implement admin notification for failures
    - Send email/notification to admins when packet fails after max retries
    - Include client info, packet type, and error details
    - Provide link to admin panel for manual intervention

- [x] 16. Analytics and Reporting
  - [x] 16.1 Implement intake analytics tracking
    - Track intake start time
    - Track intake completion time
    - Track abandonment and drop-off points
    - Store analytics in IntakeAnalytics model
    - _Requirements: 23.1, 23.2, 23.3_
  
  - [x] 16.2 Create analytics dashboard for admins
    - Display completion rates by client type
    - Show average completion times
    - Identify high-abandonment questions
    - Show demographic and goal distributions
    - Provide data export functionality
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

- [x] 17. Notifications System
  - Implement email notification when packets are ready
  - Send notification to client dashboard
  - Add notification preferences to user settings
  - _Requirements: 19.5_

- [x] 18. Security and Access Control
  - [x] 18.1 Implement authentication checks on all API routes
    - Verify user session on intake endpoints
    - Verify user session on packet endpoints
    - Verify admin role on admin endpoints
    - _Requirements: 20.3_
  
  - [x] 18.2 Implement authorization checks
    - Ensure clients can only access their own data
    - Ensure coaches can only access assigned clients
    - Ensure admins have full access with audit logging
    - _Requirements: 20.3_
  
  - [x] 18.3 Implement input sanitization
    - Sanitize all user inputs to prevent XSS
    - Validate data types and formats
    - Escape special characters in stored content
    - _Requirements: 22.2_

- [x] 19. Performance Optimization
  - [x] 19.1 Implement caching for question blocks and paths
    - Cache question blocks in memory or Redis
    - Cache intake path configurations
    - Set appropriate cache expiration
    - _Requirements: 25.1_
  
  - [x] 19.2 Optimize database queries
    - Add indexes to frequently queried fields
    - Use select to limit returned fields
    - Implement pagination for large lists
    - _Requirements: 25.4_
  
  - [x] 19.3 Implement async packet generation
    - Ensure packet generation runs in background
    - Don't block intake submission on generation
    - Provide status updates to client
    - _Requirements: 25.2, 25.3_

- [x] 20. Testing
  - [x] 20.1 Write unit tests for core logic
    - Test branching logic evaluation
    - Test validation rules
    - Test template population
    - Test packet routing logic
    - _Requirements: All_
  
  - [x] 20.2 Write integration tests
    - Test intake submission flow
    - Test packet generation pipeline
    - Test API endpoints
    - _Requirements: All_
  
  - [x] 20.3 Write end-to-end tests
    - Test complete intake flow for each path
    - Test packet generation and delivery
    - Test admin management workflows
    - _Requirements: All_

- [x] 21. Documentation
  - [x] 21.1 Create user documentation
    - Write guide for completing intake
    - Write guide for viewing packets
    - Create FAQ section
  
  - [x] 21.2 Create admin documentation
    - Write guide for managing clients
    - Write guide for editing packets
    - Write guide for managing templates
    - Write guide for interpreting analytics
  
  - [x] 21.3 Create developer documentation
    - Document API endpoints
    - Document data models
    - Document branching logic syntax
    - Document template syntax

- [x] 22. Deployment and Monitoring
  - [x] 22.1 Set up production environment
    - Configure environment variables
    - Set up database
    - Set up job queue infrastructure
    - Configure file storage
  
  - [x] 22.2 Implement monitoring and logging
    - Set up error tracking (e.g., Sentry)
    - Set up performance monitoring
    - Set up job queue monitoring
    - Configure log aggregation
  
  - [x] 22.3 Deploy application
    - Deploy to production environment
    - Run database migrations
    - Seed initial data (question blocks, paths, templates)
    - Verify all services are running

- [x] 23. Remaining Implementation Tasks
  - [x] 23.1 Add seed scripts to package.json and run seeding
    - Add `seed:paths` script: `"seed:paths": "tsx prisma/seed-intake-paths.ts"`
    - Add `seed:templates` script: `"seed:templates": "tsx prisma/seed-packet-templates.ts"`
    - Add `seed:all` script to run all seeds in order
    - Run `npm run seed:questions` to seed question blocks
    - Run `npm run seed:paths` to seed intake paths
    - Run `npm run seed:templates` to seed packet templates
    - Verify all data is seeded correctly in database
    - _Requirements: 2.2, 3.1, 9.2, 24.1_
  
  - [x] 23.2 Verify and test packet download functionality
    - Test GET /api/packets/[id]/download endpoint
    - Verify PDF files are served with correct headers
    - Test download button in PacketViewer component
    - Test download functionality for all packet types
    - _Requirements: 19.3, 20.2_
  
  - [x] 23.3 Implement complete analytics tracking
    - [x] 23.3.1 Add intake start tracking
      - Create IntakeAnalytics record when intake form is first loaded
      - Store clientType and startedAt timestamp
      - Add to DynamicIntakeForm component's useEffect
      - _Requirements: 23.1_
    
    - [x] 23.3.2 Add intake completion tracking
      - Update IntakeAnalytics record when intake is submitted
      - Calculate and store completionTime (in seconds)
      - Set completedAt timestamp
      - Add to submit-dynamic API endpoint
      - _Requirements: 23.2_
    
    - [x] 23.3.3 Enhance abandonment tracking
      - Track abandonment when user navigates away without completing
      - Use existing POST /api/intake/analytics endpoint
      - Add beforeunload event listener to DynamicIntakeForm
      - Store current step as dropOffStep
      - _Requirements: 23.3_
