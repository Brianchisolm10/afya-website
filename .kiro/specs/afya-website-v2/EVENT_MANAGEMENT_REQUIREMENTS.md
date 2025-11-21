# Event Management Requirements

## Overview

This document outlines the event management infrastructure added to the AFYA Website V2. The system supports community events including workshops, training sessions, meetups, and virtual webinars.

## Database Schema

### Event Model

Tracks all community events:

```prisma
model Event {
  id                    String
  title                 String
  description           String
  eventType             EventType
  startDate             DateTime
  endDate               DateTime
  timezone              String
  locationType          LocationType
  venue                 String?
  address               String? // JSON
  virtualLink           String?
  maxCapacity           Int?
  registeredCount       Int
  waitlistEnabled       Boolean
  registrationDeadline  DateTime?
  isFree                Boolean
  price                 Float?
  status                EventStatus
  publishedAt           DateTime?
  canceledAt            DateTime?
  imageUrl              String?
  registrations         EventRegistration[]
}
```

**Enums:**
- `EventType`: WORKSHOP, TRAINING_SESSION, COMMUNITY_MEETUP, FUNDRAISER, WEBINAR, COMPETITION, SOCIAL
- `LocationType`: IN_PERSON, VIRTUAL, HYBRID
- `EventStatus`: DRAFT, PUBLISHED, CANCELED, COMPLETED

### EventRegistration Model

Tracks event registrations:

```prisma
model EventRegistration {
  id                    String
  eventId               String
  userId                String?
  email                 String
  name                  String
  phone                 String?
  status                RegistrationStatus
  isWaitlist            Boolean
  paymentStatus         PaymentStatus?
  paymentIntentId       String?
  amountPaid            Float?
  checkedIn             Boolean
  checkedInAt           DateTime?
}
```

**Enums:**
- `RegistrationStatus`: CONFIRMED, CANCELED, WAITLIST, NO_SHOW

## Implementation Requirements

### Phase 1: Event Creation & Management

1. **Admin Event Editor**
   - Create/edit event form
   - Event type selection
   - Date/time picker with timezone
   - Location type and details
   - Capacity and waitlist settings
   - Pricing configuration
   - Image upload
   - Draft/publish workflow

2. **Event Listing Page** (`/events`)
   - Display upcoming events
   - Filter by event type
   - Filter by location type
   - Search functionality
   - Calendar view option
   - List view with cards

3. **Event Detail Page** (`/events/[id]`)
   - Event information
   - Date, time, location
   - Registration button
   - Capacity indicator
   - Event description
   - Image/media
   - Share buttons

### Phase 2: Registration System

1. **Registration Flow**
   - User clicks "Register"
   - Login required or guest registration
   - Collect required information
   - Payment processing (if paid event)
   - Confirmation email
   - Calendar invite (.ics file)

2. **Registration Form**
   - Name and email (required)
   - Phone number (optional)
   - Dietary restrictions (for in-person)
   - Emergency contact (for in-person)
   - Custom questions per event
   - Terms acceptance

3. **Waitlist Management**
   - Automatic waitlist when full
   - Notification when spot opens
   - Time-limited acceptance (24 hours)
   - Automatic promotion from waitlist

### Phase 3: Event Communication

1. **Email Notifications**
   - Registration confirmation
   - Event reminder (24 hours before)
   - Event reminder (1 hour before)
   - Event cancellation
   - Waitlist promotion
   - Post-event follow-up

2. **Calendar Integration**
   - Generate .ics calendar file
   - Include event details
   - Include virtual link (if applicable)
   - Add to Google Calendar button
   - Add to Outlook button

3. **Event Updates**
   - Notify registrants of changes
   - Location changes
   - Time changes
   - Cancellations
   - Important announcements

### Phase 4: Check-In System

1. **Admin Check-In Interface**
   - QR code scanner
   - Manual name search
   - Mark as checked in
   - View attendance list
   - Export attendance report

2. **Attendee Check-In**
   - QR code on confirmation email
   - Mobile-friendly check-in
   - Self-check-in kiosk option
   - Attendance tracking

### Phase 5: Event Analytics

1. **Event Metrics**
   - Registration count
   - Attendance rate
   - Waitlist conversion
   - Revenue (if paid)
   - Cancellation rate
   - No-show rate

2. **Reporting**
   - Event performance dashboard
   - Attendance reports
   - Revenue reports
   - Demographic insights
   - Export to CSV/PDF

## API Endpoints

### Public Endpoints

```typescript
// Get upcoming events
GET /api/events
Query: { 
  type?: EventType; 
  location?: LocationType; 
  startDate?: string;
  endDate?: string;
  page?: number;
}
Response: {
  events: Event[];
  total: number;
  hasMore: boolean;
}

// Get event details
GET /api/events/[id]
Response: {
  event: Event;
  availableSpots: number;
  isRegistered: boolean;
}

// Register for event
POST /api/events/[id]/register
Request: {
  name: string;
  email: string;
  phone?: string;
  customResponses?: object;
}
Response: {
  registration: EventRegistration;
  confirmationNumber: string;
}

// Cancel registration
DELETE /api/events/[id]/register
Response: { success: boolean }
```

### Admin Endpoints

```typescript
// Create event
POST /api/admin/events
Request: { event: EventInput }
Response: { event: Event }

// Update event
PUT /api/admin/events/[id]
Request: { event: Partial<EventInput> }
Response: { event: Event }

// Delete event
DELETE /api/admin/events/[id]
Response: { success: boolean }

// Get registrations
GET /api/admin/events/[id]/registrations
Response: { registrations: EventRegistration[] }

// Check in attendee
POST /api/admin/events/[id]/check-in
Request: { registrationId: string }
Response: { success: boolean; checkedInAt: Date }

// Send event update
POST /api/admin/events/[id]/notify
Request: { 
  subject: string;
  message: string;
  recipients: 'all' | 'confirmed' | 'waitlist';
}
Response: { sent: number }
```

## Business Logic

### Event Types & Use Cases

**Workshops:**
- Educational sessions
- Skill-building activities
- Expert-led instruction
- Typically 2-4 hours
- Limited capacity (10-30 people)

**Training Sessions:**
- Group workouts
- Technique clinics
- Sport-specific training
- 1-2 hours
- Medium capacity (20-50 people)

**Community Meetups:**
- Social gatherings
- Networking events
- Casual activities
- Flexible duration
- Large capacity (50+ people)

**Webinars:**
- Virtual presentations
- Q&A sessions
- Expert talks
- 1 hour
- Unlimited capacity

**Competitions:**
- Fitness challenges
- Friendly competitions
- Team events
- Half-day to full-day
- Variable capacity

### Capacity Management

```typescript
function canRegister(event: Event): boolean {
  // Check if event is published
  if (event.status !== 'PUBLISHED') return false;
  
  // Check if registration deadline passed
  if (event.registrationDeadline && new Date() > event.registrationDeadline) {
    return false;
  }
  
  // Check if event already started
  if (new Date() > event.startDate) return false;
  
  // Check capacity
  if (event.maxCapacity && event.registeredCount >= event.maxCapacity) {
    return event.waitlistEnabled; // Can join waitlist
  }
  
  return true;
}
```

### Waitlist Promotion

```typescript
async function promoteFromWaitlist(event: Event) {
  // Find next person on waitlist
  const nextInLine = await db.eventRegistration.findFirst({
    where: {
      eventId: event.id,
      isWaitlist: true,
      status: 'WAITLIST'
    },
    orderBy: { createdAt: 'asc' }
  });
  
  if (!nextInLine) return;
  
  // Send notification with 24-hour deadline
  await sendWaitlistPromotionEmail(nextInLine, event);
  
  // Set expiration timer
  setTimeout(async () => {
    // Check if they accepted
    const registration = await db.eventRegistration.findUnique({
      where: { id: nextInLine.id }
    });
    
    if (registration.status === 'WAITLIST') {
      // They didn't accept, move to next person
      await promoteFromWaitlist(event);
    }
  }, 24 * 60 * 60 * 1000); // 24 hours
}
```

### Pricing Tiers

**Free Events:**
- Community meetups
- Most webinars
- Social events
- Open training sessions

**Paid Events:**
- Specialized workshops ($25-$75)
- Expert-led training ($30-$100)
- Multi-day events ($100-$300)
- Fundraisers (variable)

**Member Discounts:**
- Active clients: 20% off
- Sponsors: 50% off
- Volunteers: Free

## Testing Requirements

### Unit Tests

- Event validation
- Capacity calculations
- Waitlist logic
- Registration eligibility

### Integration Tests

- Registration flow
- Payment processing
- Email notifications
- Waitlist promotion

### E2E Tests

- Complete registration
- Event cancellation
- Check-in process
- Admin event management

## User Experience

### Event Discovery

1. **Homepage Widget**
   - Show next 3 upcoming events
   - "View All Events" link

2. **Events Page**
   - Calendar view
   - List view with filters
   - Search by keyword
   - Sort by date/popularity

3. **Event Cards**
   - Event image
   - Title and type
   - Date and time
   - Location
   - Capacity indicator
   - Price (if applicable)
   - "Register" button

### Registration Experience

1. **Pre-Registration**
   - Clear event details
   - Capacity status
   - Pricing information
   - Cancellation policy

2. **During Registration**
   - Simple form
   - Progress indicator
   - Secure payment
   - Clear error messages

3. **Post-Registration**
   - Confirmation page
   - Confirmation email
   - Calendar invite
   - Add to calendar buttons
   - Share on social media

### Mobile Experience

- Responsive event cards
- Mobile-friendly forms
- QR code check-in
- Calendar integration
- Push notifications (future)

## Marketing & Promotion

### Event Promotion

- Email announcements
- Social media posts
- Website banner
- Newsletter feature
- Partner promotion

### Early Bird Incentives

- Discounted pricing
- Exclusive perks
- Limited spots
- VIP access

### Referral Program

- Bring a friend discount
- Group registration rates
- Referral rewards
- Team challenges

## Future Enhancements

### Phase 6: Advanced Features

- **Recurring Events**: Weekly/monthly series
- **Event Series**: Multi-session programs
- **Private Events**: Invitation-only
- **Virtual Rooms**: Integrated video conferencing
- **Live Streaming**: Broadcast events
- **Event Recordings**: On-demand access
- **Certificates**: Completion certificates
- **Badges**: Attendance badges
- **Leaderboards**: Competition rankings

### Integration Opportunities

- Zoom/Google Meet integration
- Eventbrite sync
- Facebook Events
- Meetup.com
- Strava challenges
- Apple Health/Google Fit

## Compliance & Safety

### Health & Safety

- COVID-19 protocols
- Capacity limits
- Sanitation requirements
- Emergency procedures
- Liability waivers

### Data Privacy

- GDPR compliance
- Data retention policies
- Opt-out options
- Secure data storage

### Accessibility

- ADA compliance
- Wheelchair accessibility
- Closed captioning (virtual)
- Sign language interpretation
- Accessible materials

## Success Metrics

### Key Performance Indicators

- Events per month
- Average attendance rate
- Registration conversion rate
- Waitlist conversion rate
- No-show rate
- Revenue per event
- Attendee satisfaction score
- Repeat attendance rate

### Monitoring

- Real-time registration tracking
- Capacity alerts
- Low registration warnings
- Post-event surveys
- Feedback collection

## Resources

- [Eventbrite Best Practices](https://www.eventbrite.com/blog/event-planning-guide/)
- [Event Marketing Guide](https://www.hubspot.com/event-marketing)
- [Virtual Event Handbook](https://www.zoom.us/virtual-events)

## Status

**Current Status**: Infrastructure Ready, Events Page Placeholder Created
**Next Steps**: Implement Phase 1 (Event Creation & Management)
**Estimated Effort**: 2-3 sprints for full implementation
**Priority**: Medium (community engagement feature)
