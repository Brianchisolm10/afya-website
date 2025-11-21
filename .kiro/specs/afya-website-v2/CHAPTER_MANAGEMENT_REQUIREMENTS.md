# Chapter Management Requirements

## Overview

This document outlines the chapter management infrastructure added to the AFYA Website V2. The chapter system enables geographic expansion by creating local AFYA communities with regional leadership, events, and programs.

## Database Schema

### Chapter Model

Tracks local AFYA chapters:

```prisma
model Chapter {
  id                    String
  name                  String
  slug                  String
  description           String
  city                  String
  state                 String
  country               String
  timezone              String
  coordinates           String? // JSON: { lat, lng }
  email                 String
  phone                 String?
  website               String?
  socialLinks           String? // JSON
  leaderId              String?
  leader                User?
  status                ChapterStatus
  launchedAt            DateTime?
  logoUrl               String?
  coverImageUrl         String?
  primaryColor          String?
  members               ChapterMembership[]
  events                ChapterEvent[]
}
```

**Enums:**
- `ChapterStatus`: ACTIVE, INACTIVE, PENDING

### ChapterMembership Model

Tracks chapter members and their roles:

```prisma
model ChapterMembership {
  id                    String
  chapterId             String
  userId                String
  role                  ChapterRole
  joinedAt              DateTime
}
```

**Enums:**
- `ChapterRole`: MEMBER, VOLUNTEER, COORDINATOR, LEADER

### ChapterEvent Model

Links events to specific chapters:

```prisma
model ChapterEvent {
  id                    String
  chapterId             String
  eventId               String
}
```

## Implementation Requirements

### Phase 1: Chapter Discovery

1. **Chapters Listing Page** (`/chapters`)
   - Interactive map view
   - List view with filters
   - Search by location
   - Filter by status
   - Sort by distance (if location enabled)

2. **Chapter Cards**
   - Chapter name and logo
   - City, state
   - Member count
   - Upcoming events count
   - "Join Chapter" button
   - Distance from user (if location enabled)

3. **Location Search**
   - Search by city/state/zip
   - Geolocation detection
   - Radius-based search
   - "Chapters near me" feature

### Phase 2: Chapter Detail Pages

1. **Chapter Profile** (`/chapters/[slug]`)
   - Chapter information
   - Leadership team
   - Member count
   - Upcoming events
   - Recent activity
   - Join button
   - Contact information

2. **Chapter About Section**
   - Description
   - Mission statement
   - Meeting location
   - Schedule
   - Photos/media

3. **Chapter Events**
   - Upcoming events list
   - Past events
   - Event calendar
   - Register for events

4. **Chapter Members** (Optional)
   - Member directory
   - Leadership profiles
   - Volunteer opportunities

### Phase 3: Chapter Membership

1. **Join Chapter Flow**
   - User clicks "Join Chapter"
   - Login required
   - Confirm membership
   - Welcome email
   - Access to chapter resources

2. **Member Dashboard**
   - My chapters
   - Chapter events
   - Chapter announcements
   - Member directory
   - Leave chapter option

3. **Membership Roles**
   - **Member**: Basic access
   - **Volunteer**: Help with events
   - **Coordinator**: Organize activities
   - **Leader**: Full chapter management

### Phase 4: Chapter Administration

1. **Chapter Admin Dashboard**
   - Chapter settings
   - Member management
   - Event management
   - Content management
   - Analytics

2. **Chapter Settings**
   - Update chapter info
   - Upload logo/images
   - Set primary color
   - Manage contact info
   - Social media links

3. **Member Management**
   - View all members
   - Assign roles
   - Remove members
   - Send announcements
   - Export member list

4. **Event Management**
   - Create chapter events
   - Manage registrations
   - Track attendance
   - Post-event surveys

### Phase 5: Chapter Creation

1. **Chapter Application**
   - Application form
   - Leader information
   - Proposed location
   - Community assessment
   - References
   - Background check

2. **Review Process**
   - Admin reviews application
   - Interview with applicant
   - Approval/rejection
   - Onboarding process

3. **Chapter Launch**
   - Set up chapter profile
   - Assign leader role
   - Create initial events
   - Marketing announcement
   - Launch celebration

## API Endpoints

### Public Endpoints

```typescript
// Get all chapters
GET /api/chapters
Query: { 
  status?: ChapterStatus;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  radius?: number; // miles
}
Response: {
  chapters: Chapter[];
  total: number;
}

// Get chapter details
GET /api/chapters/[slug]
Response: {
  chapter: Chapter;
  memberCount: number;
  upcomingEvents: Event[];
  isMember: boolean;
}

// Join chapter
POST /api/chapters/[slug]/join
Response: {
  membership: ChapterMembership;
}

// Leave chapter
DELETE /api/chapters/[slug]/leave
Response: { success: boolean }
```

### Chapter Admin Endpoints

```typescript
// Update chapter
PUT /api/chapters/[slug]
Request: { chapter: Partial<ChapterInput> }
Response: { chapter: Chapter }

// Get chapter members
GET /api/chapters/[slug]/members
Response: { members: ChapterMembership[] }

// Update member role
PUT /api/chapters/[slug]/members/[userId]
Request: { role: ChapterRole }
Response: { membership: ChapterMembership }

// Remove member
DELETE /api/chapters/[slug]/members/[userId]
Response: { success: boolean }

// Send announcement
POST /api/chapters/[slug]/announce
Request: {
  subject: string;
  message: string;
  recipients: 'all' | 'leaders' | 'volunteers';
}
Response: { sent: number }
```

### Super Admin Endpoints

```typescript
// Create chapter
POST /api/admin/chapters
Request: { chapter: ChapterInput }
Response: { chapter: Chapter }

// Approve chapter application
POST /api/admin/chapters/applications/[id]/approve
Response: { chapter: Chapter }

// Deactivate chapter
POST /api/admin/chapters/[id]/deactivate
Request: { reason: string }
Response: { success: boolean }
```

## Business Logic

### Chapter Lifecycle

1. **Application Phase**
   - Prospective leader applies
   - Admin reviews application
   - Interview conducted
   - Decision made

2. **Setup Phase** (Status: PENDING)
   - Chapter profile created
   - Leader assigned
   - Initial content added
   - Launch date set

3. **Active Phase** (Status: ACTIVE)
   - Members can join
   - Events can be created
   - Full functionality enabled
   - Regular activity

4. **Inactive Phase** (Status: INACTIVE)
   - No new members
   - No new events
   - Existing members retained
   - Can be reactivated

### Geographic Coverage

**Chapter Territories:**
- Metropolitan areas: City-based
- Suburban areas: County-based
- Rural areas: Multi-county regions
- Minimum distance between chapters: 25 miles

**Overlap Handling:**
- Users can join multiple chapters
- Events can be cross-promoted
- Chapters can collaborate
- No territorial restrictions

### Leadership Requirements

**Chapter Leader Qualifications:**
- Active AFYA member for 6+ months
- Completed leadership training
- Background check passed
- References verified
- Commitment to 1-year term

**Leader Responsibilities:**
- Organize monthly events
- Recruit and manage volunteers
- Maintain chapter profile
- Submit quarterly reports
- Represent AFYA locally

### Membership Benefits

**Chapter Members Get:**
- Access to local events
- Chapter-specific discounts
- Local community connection
- Volunteer opportunities
- Leadership development

**Chapter Leaders Get:**
- Leadership training
- AFYA certification
- Marketing support
- Operational resources
- National network access

## Testing Requirements

### Unit Tests

- Chapter validation
- Distance calculations
- Role permissions
- Membership logic

### Integration Tests

- Chapter creation flow
- Membership management
- Event association
- Location search

### E2E Tests

- Join chapter flow
- Chapter admin tasks
- Event creation
- Member communication

## User Experience

### Chapter Discovery

1. **Map View**
   - Interactive map with pins
   - Click pin for chapter info
   - Zoom and pan
   - Current location marker

2. **List View**
   - Chapter cards
   - Sort by distance
   - Filter by state
   - Search by name

3. **Chapter Card**
   - Logo and name
   - Location
   - Member count
   - Next event
   - Join button

### Chapter Profile

1. **Hero Section**
   - Cover image
   - Chapter name
   - Location
   - Join button
   - Member count

2. **About Section**
   - Description
   - Meeting info
   - Leadership team
   - Contact details

3. **Events Section**
   - Upcoming events
   - Past events
   - Event calendar

4. **Activity Feed**
   - Recent updates
   - New members
   - Event highlights
   - Announcements

### Mobile Experience

- Responsive chapter cards
- Mobile-friendly map
- Location-based search
- Push notifications (future)
- Mobile check-in

## Marketing & Growth

### Chapter Launch

- Press release
- Social media campaign
- Email announcement
- Local partnerships
- Launch event

### Member Recruitment

- Local advertising
- Community outreach
- Referral program
- Open houses
- Free trial events

### Chapter Support

- Monthly leader calls
- Resource library
- Marketing materials
- Event templates
- Best practices guide

## Future Enhancements

### Phase 6: Advanced Features

- **Sub-Chapters**: Neighborhood-level groups
- **Chapter Challenges**: Inter-chapter competitions
- **Chapter Store**: Chapter-branded merchandise
- **Chapter Fundraising**: Local fundraising campaigns
- **Chapter Grants**: Funding for chapter activities
- **Chapter Certification**: Quality standards program
- **Chapter Network**: Leader collaboration platform

### Integration Opportunities

- Meetup.com sync
- Facebook Groups integration
- Eventbrite connection
- Local business partnerships
- Municipal recreation programs

## Compliance & Legal

### Legal Structure

- Chapters as AFYA representatives
- Liability insurance
- Volunteer agreements
- Code of conduct
- Safety protocols

### Data Privacy

- Member data protection
- GDPR compliance
- Opt-in communications
- Data retention policies

### Risk Management

- Background checks
- Safety training
- Incident reporting
- Insurance coverage
- Legal support

## Success Metrics

### Chapter Health Indicators

- Active member count
- Event frequency
- Attendance rates
- Member retention
- New member growth
- Volunteer participation

### Network Metrics

- Total chapters
- Geographic coverage
- Total members
- Events per month
- Cross-chapter collaboration
- Leader satisfaction

### Monitoring

- Monthly chapter reports
- Quarterly reviews
- Annual assessments
- Member surveys
- Leader feedback

## Resources

- [Meetup Organizer Guide](https://help.meetup.com/hc/en-us/categories/115000683131-Organizers)
- [Chapter Management Best Practices](https://www.councilofnonprofits.org/tools-resources/chapters-and-affiliates)
- [Community Building Handbook](https://www.communitybuildinghandbook.com/)

## Status

**Current Status**: Infrastructure Ready, Chapters Page Placeholder Created
**Next Steps**: Implement Phase 1 (Chapter Discovery)
**Estimated Effort**: 3-4 sprints for full implementation
**Priority**: Medium-High (expansion strategy)
