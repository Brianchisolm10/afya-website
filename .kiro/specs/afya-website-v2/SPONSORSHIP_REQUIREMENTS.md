# Sponsorship Dashboard Requirements

## Overview

This document outlines the sponsorship program infrastructure added to the AFYA Website V2. The sponsorship program allows community members to fund wellness packets for clients in need, creating a sustainable support system for underserved populations.

## Database Schema

### Sponsor Model

Tracks sponsor accounts and their preferences:

```prisma
model Sponsor {
  id                    String
  userId                String
  sponsorType           SponsorType
  organizationName      String?
  monthlyContribution   Float
  preferredAllocation   DonationAllocation
  status                SponsorStatus
  startedAt             DateTime
  pausedAt              DateTime?
  canceledAt            DateTime?
  sponsorships          Sponsorship[]
}
```

**Enums:**
- `SponsorType`: INDIVIDUAL, ORGANIZATION, CORPORATE
- `SponsorStatus`: ACTIVE, PAUSED, CANCELED

### Sponsorship Model

Tracks individual sponsorship relationships (anonymized):

```prisma
model Sponsorship {
  id                    String
  sponsorId             String
  clientId              String
  amount                Float
  packetType            PacketType?
  status                SponsorshipStatus
  startedAt             DateTime
  completedAt           DateTime?
  clientProgress        String? // JSON with anonymized data
}
```

**Enums:**
- `SponsorshipStatus`: ACTIVE, COMPLETED, CANCELED

## Dashboard Pages

### Sponsor Dashboard (`/sponsor/dashboard`)

**Purpose**: Main hub for sponsors to track their impact and manage sponsorships.

**Sections:**

1. **Impact Summary**
   - Total clients helped
   - Total contribution amount
   - Active sponsorships count
   - Completed sponsorships count
   - Community impact metrics

2. **Active Sponsorships**
   - List of current sponsorships
   - Anonymized client progress
   - Packet type and status
   - Start date and duration

3. **Recent Activity**
   - New sponsorships matched
   - Client milestones reached
   - Contribution history
   - System notifications

4. **Quick Actions**
   - Increase contribution
   - Update payment method
   - Pause sponsorship
   - View impact report

### Sponsor Settings (`/sponsor/settings`)

**Purpose**: Manage sponsorship preferences and account settings.

**Sections:**

1. **Contribution Settings**
   - Monthly contribution amount
   - Billing frequency
   - Payment method
   - Next billing date

2. **Allocation Preferences**
   - Preferred packet types
   - Client demographics (optional)
   - Geographic preferences (optional)
   - Matching criteria

3. **Notification Preferences**
   - Email notifications
   - Progress updates frequency
   - Impact reports
   - Milestone alerts

4. **Account Management**
   - Pause sponsorship
   - Cancel sponsorship
   - Download tax receipts
   - Export contribution history

## Implementation Requirements

### Phase 1: Sponsor Onboarding

1. **Signup Flow**
   - User clicks "Become a Sponsor" on Impact page
   - User selects sponsor type (Individual/Organization/Corporate)
   - User enters contribution amount (minimum $25/month)
   - User selects allocation preferences
   - User enters payment information
   - System creates Sponsor record
   - System sends welcome email

2. **Sponsor Profile**
   - Display sponsor type and status
   - Show contribution history
   - Display impact metrics
   - Allow profile updates

### Phase 2: Matching System

1. **Client Matching**
   - System identifies clients needing sponsorship
   - System matches based on sponsor preferences
   - System creates Sponsorship record
   - System notifies sponsor of new match
   - System notifies client (anonymously)

2. **Matching Criteria**
   - Packet type preference
   - Client demographics (age, goals)
   - Geographic location
   - Urgency/priority
   - First-come-first-served fallback

3. **Matching Rules**
   - One sponsor can support multiple clients
   - One client can have multiple sponsors
   - Minimum sponsorship: cost of one packet
   - Maximum sponsorships per sponsor: unlimited
   - Matching happens automatically or manually

### Phase 3: Progress Tracking

1. **Anonymized Progress**
   - Client completes intake: "Client started their journey"
   - Packet generated: "Wellness packet created"
   - Client logs activity: "Client logged X minutes of movement"
   - Milestones reached: "Client reached 30-day milestone"
   - Program completed: "Client completed their program"

2. **Progress Updates**
   - Weekly email digest
   - In-dashboard notifications
   - Monthly impact report
   - Quarterly summary

3. **Privacy Protection**
   - No personally identifiable information shared
   - Generic progress descriptions
   - Aggregate metrics only
   - Opt-in for more detailed (still anonymous) updates

### Phase 4: Payment Processing

1. **Recurring Billing**
   - Use Stripe Subscriptions
   - Monthly billing cycle
   - Automatic payment processing
   - Failed payment handling
   - Receipt generation

2. **Payment Management**
   - Update payment method
   - Change contribution amount
   - Pause billing
   - Resume billing
   - Cancel subscription

3. **Tax Receipts**
   - Generate annual tax receipt
   - Include all contributions
   - Provide 501(c)(3) information
   - Email and download options

### Phase 5: Impact Reporting

1. **Individual Impact Report**
   - Total clients helped
   - Total contribution amount
   - Average sponsorship duration
   - Client success stories (anonymized)
   - Community impact contribution

2. **Community Impact**
   - Total sponsors
   - Total clients sponsored
   - Total packets funded
   - Success rate
   - Testimonials

3. **Report Formats**
   - PDF download
   - Email delivery
   - Shareable link
   - Social media graphics

## API Endpoints

### Sponsor Management

```typescript
// Get sponsor profile
GET /api/sponsor/profile
Response: {
  sponsor: Sponsor;
  stats: SponsorStats;
}

// Update sponsor settings
PUT /api/sponsor/settings
Request: {
  monthlyContribution?: number;
  preferredAllocation?: DonationAllocation;
  notificationPreferences?: object;
}

// Pause sponsorship
POST /api/sponsor/pause
Response: { success: boolean; pausedUntil: Date }

// Resume sponsorship
POST /api/sponsor/resume
Response: { success: boolean; resumedAt: Date }

// Cancel sponsorship
POST /api/sponsor/cancel
Request: { reason?: string; feedback?: string }
Response: { success: boolean; canceledAt: Date }
```

### Sponsorship Tracking

```typescript
// Get active sponsorships
GET /api/sponsor/sponsorships
Response: {
  active: Sponsorship[];
  completed: Sponsorship[];
  total: number;
}

// Get sponsorship details
GET /api/sponsor/sponsorships/[id]
Response: {
  sponsorship: Sponsorship;
  progress: AnonymizedProgress[];
}

// Get impact report
GET /api/sponsor/impact-report
Query: { startDate?: string; endDate?: string }
Response: {
  totalClients: number;
  totalContribution: number;
  impactMetrics: object;
}
```

### Admin Endpoints

```typescript
// Get all sponsors
GET /api/admin/sponsors
Query: { status?: string; type?: string; page?: number }

// Match sponsor to client
POST /api/admin/sponsors/match
Request: {
  sponsorId: string;
  clientId: string;
  amount: number;
}

// Send impact update
POST /api/admin/sponsors/[id]/notify
Request: {
  message: string;
  type: 'milestone' | 'progress' | 'general';
}
```

## Business Logic

### Contribution Tiers

**Individual Sponsors:**
- Bronze: $25/month (1 client per quarter)
- Silver: $50/month (1 client per month)
- Gold: $100/month (2 clients per month)
- Platinum: $250+/month (5+ clients per month)

**Organization Sponsors:**
- Starter: $500/month (10 clients per month)
- Growth: $1,000/month (20 clients per month)
- Impact: $2,500+/month (50+ clients per month)

**Corporate Sponsors:**
- Custom packages
- Employee matching programs
- Bulk sponsorships
- Branded impact reports

### Matching Algorithm

```typescript
function matchSponsorToClient(sponsor: Sponsor, availableClients: Client[]) {
  // 1. Filter by sponsor preferences
  let matches = availableClients.filter(client => {
    if (sponsor.preferredPacketType && client.packetType !== sponsor.preferredPacketType) {
      return false;
    }
    // Additional preference filters
    return true;
  });

  // 2. Prioritize by urgency
  matches.sort((a, b) => {
    return a.urgencyScore - b.urgencyScore;
  });

  // 3. Return top match
  return matches[0];
}
```

### Progress Milestones

- **Day 1**: Sponsorship started
- **Day 7**: Client completed intake
- **Day 14**: First packet generated
- **Day 30**: 30-day milestone
- **Day 60**: 60-day milestone
- **Day 90**: Program completion

### Success Metrics

- **Sponsorship Retention**: % of sponsors active after 6 months
- **Client Success Rate**: % of sponsored clients completing programs
- **Average Sponsorship Duration**: Months per sponsorship
- **Contribution Growth**: Month-over-month growth
- **Matching Efficiency**: Time to match sponsor to client

## Testing Requirements

### Unit Tests

- Sponsor model validation
- Matching algorithm logic
- Progress anonymization
- Contribution calculations

### Integration Tests

- Sponsor signup flow
- Payment processing
- Matching system
- Progress updates

### E2E Tests

- Complete sponsor onboarding
- Dashboard navigation
- Settings updates
- Impact report generation

## Privacy & Security

### Data Protection

- No PII shared with sponsors
- Anonymized progress updates
- Secure payment processing
- Encrypted data storage
- GDPR compliance

### Client Privacy

- Clients never know who sponsors them
- No direct communication between sponsor and client
- Progress updates are generic
- Opt-out option for clients
- Data retention policies

### Sponsor Privacy

- Sponsors can remain anonymous
- Optional public recognition
- Secure account access
- Two-factor authentication
- Activity logging

## Marketing & Communication

### Sponsor Recruitment

- Impact page call-to-action
- Success stories
- Tax benefits information
- Corporate partnership opportunities
- Referral program

### Sponsor Retention

- Regular impact updates
- Milestone celebrations
- Annual impact reports
- Exclusive events
- Recognition programs

### Email Templates

1. **Welcome Email**: Onboarding and next steps
2. **Match Notification**: New client matched
3. **Progress Update**: Weekly/monthly updates
4. **Milestone Alert**: Client reached milestone
5. **Impact Report**: Quarterly summary
6. **Renewal Reminder**: Annual renewal
7. **Thank You**: Appreciation messages

## Future Enhancements

### Phase 6: Advanced Features

- **Sponsor Community**: Forum for sponsors to connect
- **Impact Challenges**: Gamified sponsorship goals
- **Gift Sponsorships**: Sponsor in someone's name
- **Legacy Sponsorships**: Memorial sponsorships
- **Sponsor Matching**: Corporate matching programs
- **Micro-Sponsorships**: One-time packet sponsorships
- **Sponsor Levels**: Tiered benefits and recognition

### Analytics Dashboard

- Sponsor demographics
- Contribution trends
- Retention analysis
- Client outcomes
- ROI calculations
- Predictive modeling

## Compliance & Legal

### Tax Considerations

- 501(c)(3) status required
- Annual tax receipts
- Donation acknowledgment letters
- IRS reporting requirements
- State-specific regulations

### Terms & Conditions

- Sponsorship agreement
- Cancellation policy
- Refund policy
- Privacy policy
- Data usage terms

### Reporting Requirements

- Annual financial reports
- Impact metrics
- Donor transparency
- Regulatory compliance
- Audit readiness

## Success Criteria

### Launch Checklist

- [ ] Database schema deployed
- [ ] Dashboard pages created
- [ ] Payment processing configured
- [ ] Matching algorithm tested
- [ ] Email templates approved
- [ ] Privacy policies updated
- [ ] Marketing materials ready
- [ ] Support documentation complete

### Key Performance Indicators

- Number of active sponsors
- Monthly recurring revenue
- Sponsor retention rate
- Client success rate
- Average contribution amount
- Time to match
- Sponsor satisfaction score

## Resources

- [Nonprofit Sponsorship Best Practices](https://www.classy.org/blog/sponsorship-best-practices/)
- [Donor Retention Strategies](https://www.networkforgood.com/nonprofitblog/donor-retention/)
- [Impact Reporting Guide](https://www.guidestar.org/Articles.aspx?path=/rxa/news/articles/2019/impact-reporting-guide.aspx)

## Status

**Current Status**: Infrastructure Ready, Dashboard Placeholders Created
**Next Steps**: Implement Phase 1 (Sponsor Onboarding)
**Estimated Effort**: 3-4 sprints for full implementation
**Priority**: High (core community feature)
