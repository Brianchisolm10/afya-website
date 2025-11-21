# Design Document: AFYA Discovery Flow & Client Portal Restructure

## Overview

This design transforms AFYA from a form-heavy program website into a relationship-driven wellness platform. The architecture separates public discovery (simple, welcoming) from authenticated services (comprehensive, personalized), creating a progressive engagement model that reduces overwhelm while maintaining sophisticated capabilities.

### Core Design Principles

1. **Human-First**: Discovery calls before program assignment
2. **Progressive Disclosure**: Complexity revealed gradually as clients are ready
3. **Centralized Portal**: One authenticated home for all client services
4. **Educational Public Site**: Free tools and content build trust before commitment
5. **Preserved Technology**: Existing intake system moves to portal, not discarded

---

## Architecture

### High-Level System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      PUBLIC WEBSITE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Home      │  │   Programs   │  │  Health Tools│     │
│  │              │  │              │  │   (Public)   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘     │
│         │                  │                                 │
│         └──────────┬───────┘                                │
│                    ▼                                         │
│         ┌──────────────────────┐                           │
│         │  Discovery Form      │                           │
│         │  (Simple, 6 fields)  │                           │
│         └──────────┬───────────┘                           │
│                    ▼                                         │
│         ┌──────────────────────┐                           │
│         │  Book Your Call      │                           │
│         │  (Calendar)          │                           │
│         └──────────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   DISCOVERY CALL                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Coach reviews form → Conducts call → Recommends     │  │
│  │  program → Creates account → Assigns program         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT PORTAL                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │ Assessments  │  │  My Packets  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Health Tools │  │   Progress   │  │  Messages    │     │
│  │  (Tracked)   │  │   Tracking   │  │  (Coach)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### 1. Discovery Form Component

**Location**: `app/(public)/start/page.tsx`

**Purpose**: Capture basic information and intent without overwhelming prospective clients

**Interface**:
```typescript
interface DiscoveryFormData {
  fullName: string;
  email: string;
  phone: string;
  primaryGoal: 'nutrition' | 'training' | 'youth' | 'general' | 'other';
  goalDescription?: string;
  startTimeframe: 'asap' | 'within_month' | '1_3_months' | 'exploring';
  referralSource?: string;
}

interface DiscoveryFormSubmission {
  formData: DiscoveryFormData;
  submittedAt: Date;
  ipAddress: string;
  userAgent: string;
}
```

**Key Features**:
- Minimal fields (6 total, 4 required)
- Friendly, conversational labels
- Dropdown for primary goal (not free text)
- Optional goal description for context
- Mobile-optimized inputs
- Real-time validation
- Clear privacy statement

**API Endpoint**: `POST /api/discovery/submit`

---

### 2. Calendar Scheduling Integration

**Location**: `app/(public)/book-call/page.tsx`

**Purpose**: Allow immediate scheduling after discovery form submission

**Integration Options**:
1. **Calendly** (Recommended for MVP)
   - Embed iframe
   - Webhook for booking confirmations
   - Automatic email notifications

2. **Cal.com** (Open-source alternative)
   - Self-hosted option
   - More customization
   - API integration

3. **Custom Solution** (Future enhancement)
   - Full control
   - Integrated with portal
   - More development effort

**Implementation** (Calendly):
```typescript
interface CalendlyConfig {
  url: string; // AFYA's Calendly scheduling link
  prefill: {
    name: string;
    email: string;
    customAnswers: {
      a1: string; // Primary goal
      a2: string; // Phone number
    };
  };
}

// Webhook payload from Calendly
interface CalendlyWebhook {
  event: 'invitee.created' | 'invitee.canceled';
  payload: {
    event_type: string;
    invitee: {
      name: string;
      email: string;
      created_at: string;
    };
    scheduled_event: {
      start_time: string;
      end_time: string;
    };
  };
}
```

**API Endpoints**:
- `GET /api/discovery/calendar-config` - Returns Calendly config with prefilled data
- `POST /api/webhooks/calendly` - Receives booking confirmations

---

### 3. Lead Management System

**Location**: `app/(protected)/admin/leads/*`

**Purpose**: Track and manage prospective clients through the conversion funnel

**Data Model**:
```typescript
interface Lead {
  id: string;
  status: 'pending_call' | 'call_scheduled' | 'call_completed' | 'converted' | 'not_interested';
  formData: DiscoveryFormData;
  submittedAt: Date;
  scheduledCallAt?: Date;
  callCompletedAt?: Date;
  callNotes?: string;
  assignedCoach?: string;
  convertedToClientId?: string;
  followUpDate?: Date;
  tags: string[];
  source: string; // UTM tracking
}

interface LeadNote {
  id: string;
  leadId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}
```

**Admin Interface Features**:
- Kanban board view (by status)
- List view with filters
- Lead detail modal
- Quick actions (schedule call, add note, convert)
- Conversion funnel metrics
- Search and filtering

**API Endpoints**:
- `GET /api/admin/leads` - List all leads with filters
- `GET /api/admin/leads/[id]` - Get lead details
- `PATCH /api/admin/leads/[id]` - Update lead status/notes
- `POST /api/admin/leads/[id]/convert` - Convert to client account

---

### 4. Client Account Creation Flow

**Purpose**: Seamlessly onboard clients after discovery call

**Process**:
1. Admin clicks "Convert to Client" on lead
2. System generates account with:
   - Email from lead
   - Temporary password (sent via email)
   - Assigned coach
   - Assigned program(s)
   - Setup token (24-hour expiry)
3. Email sent with setup link
4. Client clicks link, sets password
5. Redirected to portal dashboard

**Data Model**:
```typescript
interface ClientAccount {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  status: 'pending_setup' | 'active' | 'inactive';
  assignedCoachId: string;
  assignedPrograms: ProgramType[];
  createdAt: Date;
  setupToken?: string;
  setupTokenExpiry?: Date;
  lastLoginAt?: Date;
}

type ProgramType = 'general' | 'nutrition' | 'training' | 'athlete' | 'youth' | 'recovery';
```

**API Endpoints**:
- `POST /api/admin/clients/create` - Create client from lead
- `POST /api/auth/setup/[token]` - Complete account setup
- `GET /api/auth/setup/[token]/validate` - Validate setup token

---

### 5. Client Portal Dashboard

**Location**: `app/(protected)/dashboard/page.tsx`

**Purpose**: Central hub for all client activities and resources

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: AFYA Logo | Navigation | Profile | Logout      │
├─────────────────────────────────────────────────────────┤
│  Welcome Back, [Name]!                                   │
│  Your coach: [Coach Name + Photo]                       │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │  Next Steps      │  │  Quick Actions   │            │
│  │  • Complete      │  │  • View Packet   │            │
│  │    Assessment    │  │  • Message Coach │            │
│  │  • Review Packet │  │  • Use Tools     │            │
│  └──────────────────┘  └──────────────────┘            │
├─────────────────────────────────────────────────────────┤
│  Recent Activity                                         │
│  • Packet generated (2 days ago)                        │
│  • Assessment completed (5 days ago)                    │
│  • Used Heart Rate Zone tool (1 week ago)              │
└─────────────────────────────────────────────────────────┘
```

**Key Features**:
- Personalized welcome
- Coach information prominently displayed
- Clear next steps
- Quick access to common actions
- Activity timeline
- Progress indicators

---

### 6. Portal-Based Intake Assessments

**Location**: `app/(protected)/assessments/*`

**Purpose**: Comprehensive assessments tailored to assigned programs

**Architecture**:
```typescript
interface PortalAssessment {
  id: string;
  clientId: string;
  assessmentType: ProgramType;
  status: 'not_started' | 'in_progress' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  responses: Record<string, any>;
  packetId?: string; // Generated packet
}

interface AssessmentProgress {
  totalQuestions: number;
  answeredQuestions: number;
  currentSection: string;
  percentComplete: number;
  estimatedTimeRemaining: number; // minutes
}
```

**Key Differences from Public Intake**:
- Triggered by program assignment, not user selection
- More comprehensive questions
- Progress saved automatically
- Can pause and resume
- Coach can view progress
- Generates packet upon completion

**Reuse Existing System**:
- Use existing question blocks from `lib/intake/question-blocks.ts`
- Use existing intake paths from `lib/intake/intake-paths.ts`
- Use existing packet generation from `lib/intake/packet-generation-service.ts`
- Wrap in portal authentication and UI

---

### 7. Additional Assessment Requests

**Location**: `app/(protected)/assessments/request`

**Purpose**: Allow clients to expand their program without coach initiation

**Flow**:
1. Client clicks "Request Additional Assessment"
2. Modal shows available assessments not yet completed
3. Client selects assessment and adds optional note
4. Request sent to assigned coach
5. Coach reviews and approves/denies
6. If approved, assessment unlocked in client portal
7. Client completes assessment
8. New packet generated

**Data Model**:
```typescript
interface AssessmentRequest {
  id: string;
  clientId: string;
  requestedAssessment: ProgramType;
  requestNote?: string;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNote?: string;
}
```

**API Endpoints**:
- `POST /api/portal/assessments/request` - Submit request
- `GET /api/admin/assessment-requests` - List pending requests
- `PATCH /api/admin/assessment-requests/[id]` - Approve/deny

---

### 8. Packet Management

**Location**: `app/(protected)/packets/*`

**Purpose**: Centralized access to all generated wellness packets

**Interface**:
```typescript
interface ClientPacket {
  id: string;
  clientId: string;
  packetType: ProgramType;
  generatedAt: Date;
  pdfUrl: string;
  status: 'generating' | 'ready' | 'error';
  viewedAt?: Date;
  downloadCount: number;
  lastDownloadedAt?: Date;
}

interface PacketListView {
  packets: ClientPacket[];
  hasUnviewed: boolean;
  totalPackets: number;
}
```

**Features**:
- List view with thumbnails
- Filter by type
- Sort by date
- Download button
- View in browser
- "New" badge for unviewed
- Regeneration option (with coach approval)

---

### 9. Portal Health Tools

**Location**: `app/(protected)/tools/*`

**Purpose**: Same tools as public site, but with usage tracking

**Implementation**:
- Reuse components from `components/tools/*`
- Wrap with tracking HOC
- Store usage in database
- Display history to client
- Show to coach in client profile

**Data Model**:
```typescript
interface ToolUsage {
  id: string;
  clientId: string;
  toolId: string;
  usedAt: Date;
  inputs: Record<string, any>;
  results: Record<string, any>;
}

interface ToolUsageSummary {
  toolId: string;
  toolName: string;
  usageCount: number;
  lastUsedAt: Date;
  averageFrequency: string; // "2x per week"
}
```

---

### 10. Coach-Client Messaging

**Location**: `app/(protected)/messages/*`

**Purpose**: Direct communication channel between client and coach

**Data Model**:
```typescript
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'client' | 'coach';
  content: string;
  sentAt: Date;
  readAt?: Date;
  attachments?: MessageAttachment[];
}

interface Conversation {
  id: string;
  clientId: string;
  coachId: string;
  lastMessageAt: Date;
  unreadCount: number; // For current user
  status: 'active' | 'archived';
}
```

**Features**:
- Real-time updates (WebSocket or polling)
- Email notifications for new messages
- File attachments
- Message history
- Read receipts
- Typing indicators

---

## Data Models

### Database Schema Updates

**New Tables**:

```sql
-- Discovery leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  primary_goal VARCHAR(50) NOT NULL,
  goal_description TEXT,
  start_timeframe VARCHAR(50) NOT NULL,
  referral_source VARCHAR(255),
  submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  scheduled_call_at TIMESTAMP,
  call_completed_at TIMESTAMP,
  call_notes TEXT,
  assigned_coach_id UUID REFERENCES users(id),
  converted_to_client_id UUID REFERENCES users(id),
  follow_up_date DATE,
  source_utm JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Lead notes
CREATE TABLE lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Client program assignments
CREATE TABLE client_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_type VARCHAR(50) NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  UNIQUE(client_id, program_type)
);

-- Assessment requests
CREATE TABLE assessment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requested_assessment VARCHAR(50) NOT NULL,
  request_note TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  review_note TEXT
);

-- Tool usage tracking
CREATE TABLE tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_id VARCHAR(100) NOT NULL,
  used_at TIMESTAMP NOT NULL DEFAULT NOW(),
  inputs JSONB,
  results JSONB
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES users(id),
  sender_type VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
  read_at TIMESTAMP,
  attachments JSONB
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES users(id),
  last_message_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(client_id, coach_id)
);
```

**Modified Tables**:

```sql
-- Add portal-specific fields to users table
ALTER TABLE users ADD COLUMN assigned_coach_id UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN setup_token VARCHAR(255);
ALTER TABLE users ADD COLUMN setup_token_expiry TIMESTAMP;
ALTER TABLE users ADD COLUMN last_portal_login_at TIMESTAMP;
ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add portal flag to packets
ALTER TABLE packets ADD COLUMN viewed_at TIMESTAMP;
ALTER TABLE packets ADD COLUMN download_count INTEGER DEFAULT 0;
ALTER TABLE packets ADD COLUMN last_downloaded_at TIMESTAMP;
```

---

## Error Handling

### Discovery Form Errors

**Validation Errors**:
- Display inline below each field
- Friendly, specific messages
- Don't clear form on error
- Highlight invalid fields

**Submission Errors**:
- Network failure: "Connection issue. Please try again."
- Server error: "Something went wrong. We've been notified."
- Duplicate email: "This email is already registered. [Login instead?]"

### Calendar Booking Errors

**No Available Slots**:
- Display message: "All slots are currently booked. We'll contact you within 24 hours to schedule."
- Create lead anyway
- Notify admin to manually schedule

**Booking Failure**:
- Retry automatically (3 attempts)
- Fall back to manual scheduling
- Send confirmation email with next steps

### Portal Access Errors

**Expired Setup Token**:
- Display: "This link has expired. Request a new one?"
- Provide button to resend
- Log security event

**Authentication Failures**:
- Clear error messages
- Password reset link
- Support contact info

---

## Testing Strategy

### Unit Tests

**Discovery Form**:
- Validation logic
- Form submission
- Error handling
- Data transformation

**Lead Management**:
- Status transitions
- Note creation
- Conversion logic
- Filtering and search

**Portal Components**:
- Assessment progress tracking
- Packet listing and filtering
- Tool usage logging
- Message sending/receiving

### Integration Tests

**Discovery to Portal Flow**:
1. Submit discovery form
2. Schedule call
3. Convert to client
4. Complete account setup
5. Access portal
6. Complete assessment
7. View generated packet

**Assessment Request Flow**:
1. Client requests additional assessment
2. Coach receives notification
3. Coach approves request
4. Assessment unlocked
5. Client completes assessment
6. New packet generated

### E2E Tests

**Happy Path**:
- Prospective client journey from discovery to first packet
- Existing client requesting additional assessment
- Coach managing leads and clients

**Error Scenarios**:
- Form validation failures
- Network interruptions
- Expired tokens
- Permission denials

---

## Performance Considerations

### Public Site

**Optimization**:
- Static generation for marketing pages
- CDN for assets
- Lazy loading for below-fold content
- Optimized images (WebP, responsive)

**Metrics**:
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

### Client Portal

**Optimization**:
- Server-side rendering for initial load
- Client-side navigation after hydration
- Prefetch likely next pages
- Virtualized lists for long data sets
- Debounced search and filters

**Caching Strategy**:
- Assessment responses: Cache in localStorage during completion
- Packet list: Cache with 5-minute TTL
- Tool usage history: Cache with 1-hour TTL
- Messages: Real-time, no cache

---

## Security Considerations

### Authentication

**Public Site**:
- No authentication required
- Rate limiting on form submissions (5 per hour per IP)
- CAPTCHA on discovery form (invisible reCAPTCHA)

**Client Portal**:
- JWT-based authentication
- Refresh token rotation
- Session timeout after 30 minutes of inactivity
- Secure, httpOnly cookies

### Authorization

**Role-Based Access Control**:
- Client: Own data only
- Coach: Assigned clients only
- Admin: All data

**Data Access Patterns**:
```typescript
// Always filter by authenticated user
const packets = await prisma.packet.findMany({
  where: {
    clientId: session.user.id, // Enforced at query level
  },
});

// Coach access requires assignment check
const client = await prisma.user.findFirst({
  where: {
    id: clientId,
    assignedCoachId: session.user.id,
  },
});
if (!client) throw new UnauthorizedError();
```

### Data Protection

**Encryption**:
- TLS 1.3 for all connections
- Encrypted database fields for sensitive data
- Encrypted file storage for packets

**Privacy**:
- HIPAA compliance for health data
- GDPR compliance for EU users
- Data retention policies
- Right to deletion

---

## Deployment Strategy

### Phase 1: Foundation (Week 1-2)

- Create discovery form and calendar integration
- Build lead management system
- Set up database schema
- Deploy to staging

### Phase 2: Portal Core (Week 3-4)

- Build client portal dashboard
- Migrate intake system to portal
- Implement packet management
- Add health tools to portal

### Phase 3: Communication (Week 5)

- Implement messaging system
- Add assessment request feature
- Build coach assignment interface
- Email notifications

### Phase 4: Migration (Week 6)

- Migrate existing clients to portal
- Remove public intake forms
- Update all CTAs to discovery form
- Train staff on new workflow

### Phase 5: Polish & Launch (Week 7-8)

- User acceptance testing
- Performance optimization
- Documentation
- Soft launch with monitoring
- Full launch

---

## Monitoring and Analytics

### Key Metrics

**Conversion Funnel**:
- Discovery form submissions
- Call scheduling rate
- Call completion rate
- Client conversion rate
- Time to first packet

**Portal Engagement**:
- Login frequency
- Assessment completion rate
- Packet download rate
- Tool usage frequency
- Message response time

**System Health**:
- API response times
- Error rates
- Database query performance
- PDF generation time
- Email delivery rate

### Dashboards

**Admin Dashboard**:
- Real-time lead pipeline
- Conversion metrics
- Client engagement scores
- System health indicators

**Coach Dashboard**:
- Assigned client list
- Pending assessment requests
- Unread messages
- Client activity summary

---

## Future Enhancements

### Phase 2 Features

- Video call integration (Zoom/Meet)
- Progress photos and measurements
- Habit tracking
- Meal logging
- Workout logging
- Community features (forums, groups)
- Mobile app (React Native)
- Wearable device integration
- AI-powered insights
- Automated check-ins

### Scalability Considerations

- Microservices architecture for high-traffic features
- Separate database for analytics
- Message queue for packet generation
- CDN for packet delivery
- Horizontal scaling for API servers

---

This design provides a comprehensive blueprint for transforming AFYA into a relationship-driven wellness platform while preserving and enhancing the sophisticated intake and packet generation system already built.
