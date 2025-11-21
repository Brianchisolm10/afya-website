# Drop Management Infrastructure Requirements

## Overview

This document outlines the drop management infrastructure added to the AFYA Website V2 for limited-time merchandise releases. The infrastructure supports countdown timers, inventory tracking, and notification signups for upcoming drops.

## Database Schema

### Product Model Extensions

The `Product` model has been extended with drop management fields:

- `isDrop` (Boolean): Indicates if the product is a limited drop
- `dropStartDate` (DateTime): When the drop becomes available
- `dropEndDate` (DateTime): When the drop ends
- `dropNotifyEnabled` (Boolean): Whether notification signup is enabled
- `dropMaxQuantity` (Int): Maximum quantity available for the drop
- `dropSoldCount` (Int): Number of units sold (for tracking)

### DropNotification Model

A new `DropNotification` model tracks notification signups:

```prisma
model DropNotification {
  id                String
  productId         String
  email             String
  name              String?
  notified          Boolean
  notifiedAt        DateTime?
  createdAt         DateTime
}
```

## Components

### DropCountdown Component

**Location**: `components/shop/DropCountdown.tsx`

A real-time countdown timer that displays days, hours, minutes, and seconds until a drop ends.

**Props:**
- `endDate` (Date): The drop end date
- `onExpire` (Function): Optional callback when countdown reaches zero
- `className` (String): Optional CSS classes

**Features:**
- Real-time updates every second
- Gradient styling matching AFYA theme
- Automatic cleanup on unmount
- "Drop Ended" message when expired

**Usage:**
```tsx
<DropCountdown 
  endDate={product.dropEndDate} 
  onExpire={() => console.log('Drop ended')}
/>
```

### DropNotificationSignup Component

**Location**: `components/shop/DropNotificationSignup.tsx`

A form component for users to sign up for drop notifications.

**Props:**
- `productId` (String): Product ID for the drop
- `productName` (String): Product name for display
- `dropStartDate` (Date): Optional start date to display
- `onSuccess` (Function): Optional callback on successful signup

**Features:**
- Email and optional name fields
- Form validation
- Success state with confirmation message
- Error handling
- Loading states
- Gradient styling matching AFYA theme

**Usage:**
```tsx
<DropNotificationSignup
  productId={product.id}
  productName={product.name}
  dropStartDate={product.dropStartDate}
  onSuccess={() => console.log('Signed up!')}
/>
```

## Implementation Requirements

### Phase 1: Drop Product Setup

1. **Admin Interface**
   - Add "Drop" toggle to product editor
   - Add drop start/end date pickers
   - Add max quantity field
   - Add notification toggle
   - Validate that drop products have required fields
   - Show sold count and remaining inventory

2. **Product Display**
   - Show "DROP" badge on drop products
   - Display countdown timer for active drops
   - Show "Coming Soon" for future drops
   - Show "Sold Out" when inventory depleted
   - Display notification signup for upcoming drops

### Phase 2: Drop Lifecycle Management

1. **Before Drop Starts**
   - Display "Coming Soon" badge
   - Show drop start date
   - Enable notification signup
   - Disable "Add to Cart" button
   - Show countdown to start (optional)

2. **During Active Drop**
   - Display countdown timer to end
   - Enable "Add to Cart" button
   - Show remaining inventory (optional)
   - Update sold count on each purchase
   - Disable when sold out

3. **After Drop Ends**
   - Display "Drop Ended" message
   - Disable "Add to Cart" button
   - Optionally hide from shop
   - Archive drop data

### Phase 3: Notification System

1. **Signup Flow**
   - User enters email (and optional name)
   - System validates email format
   - System checks for duplicate signups
   - System stores notification record
   - User receives confirmation message

2. **Notification Sending**
   - Automated job runs before drop start (e.g., 24 hours before)
   - System queries all non-notified signups for product
   - System sends email to each subscriber
   - Email includes drop details and direct link
   - System marks notifications as sent
   - System logs notification activity

3. **Email Template**
   ```
   Subject: 🔥 [Product Name] Drop is Live!
   
   Hey [Name],
   
   The [Product Name] drop you signed up for is now live!
   
   This is a limited release - only [X] available.
   
   [Shop Now Button]
   
   Drop ends: [End Date]
   
   Don't miss out!
   
   - AFYA Team
   ```

### Phase 4: Inventory Management

1. **Stock Tracking**
   - Decrement inventory on successful purchase
   - Increment sold count
   - Check inventory before allowing purchase
   - Handle race conditions (optimistic locking)
   - Reserve inventory during checkout (5-minute hold)

2. **Sold Out Handling**
   - Automatically disable "Add to Cart" when inventory = 0
   - Display "Sold Out" badge
   - Optionally allow waitlist signup
   - Send sold-out notification to admin

3. **Inventory Alerts**
   - Alert admin when 90% sold
   - Alert admin when sold out
   - Daily inventory report for active drops

## API Endpoints

### Drop Notification Signup

```typescript
POST /api/shop/drops/notify

Request:
{
  productId: string;
  email: string;
  name?: string;
}

Response:
{
  success: boolean;
  message: string;
}
```

### Get Drop Status

```typescript
GET /api/shop/drops/[productId]/status

Response:
{
  isActive: boolean;
  hasStarted: boolean;
  hasEnded: boolean;
  remainingQuantity: number;
  timeRemaining: number; // seconds
}
```

### Admin: Send Drop Notifications

```typescript
POST /api/admin/drops/[productId]/notify

Response:
{
  notificationsSent: number;
  errors: string[];
}
```

### Admin: Get Drop Analytics

```typescript
GET /api/admin/drops/[productId]/analytics

Response:
{
  totalSignups: number;
  notificationsSent: number;
  totalSold: number;
  remainingInventory: number;
  conversionRate: number;
  revenueGenerated: number;
}
```

## Business Logic

### Drop Scheduling

1. **Pre-Drop Phase** (Before dropStartDate)
   - Product visible but not purchasable
   - Notification signup enabled
   - Countdown to start displayed

2. **Active Drop Phase** (Between dropStartDate and dropEndDate)
   - Product purchasable
   - Countdown to end displayed
   - Inventory tracked
   - Auto-disable when sold out

3. **Post-Drop Phase** (After dropEndDate)
   - Product no longer purchasable
   - Display "Drop Ended"
   - Archive or hide from shop

### Notification Timing

**Recommended Schedule:**
- 7 days before: "Coming Soon" announcement
- 24 hours before: "Drop Tomorrow" reminder
- At drop start: "Drop is Live" notification
- 2 hours before end: "Last Chance" reminder

### Inventory Reservation

To prevent overselling:
1. User adds drop item to cart
2. System creates 5-minute inventory reservation
3. User completes checkout within 5 minutes
4. Reservation converted to sale
5. If timeout, reservation released

## Testing Requirements

### Unit Tests

- Countdown timer calculations
- Time remaining display
- Notification signup validation
- Inventory decrement logic

### Integration Tests

- Drop lifecycle transitions
- Notification sending
- Inventory reservation
- Sold out handling

### E2E Tests

- Complete drop purchase flow
- Notification signup and receipt
- Countdown timer display
- Sold out state

## Monitoring & Analytics

### Key Metrics

- **Signup Rate**: Notifications / Product Views
- **Conversion Rate**: Purchases / Notifications Sent
- **Sell-Through Rate**: Units Sold / Total Inventory
- **Time to Sell Out**: Duration from start to sold out
- **Average Order Value**: Revenue / Orders

### Dashboards

1. **Active Drops Dashboard**
   - Current active drops
   - Time remaining
   - Inventory remaining
   - Sales velocity

2. **Drop Performance**
   - Historical drop data
   - Conversion rates
   - Revenue by drop
   - Top performing drops

## Best Practices

### Drop Sizing

- **Small Drop**: 25-50 units (high exclusivity)
- **Medium Drop**: 100-250 units (balanced)
- **Large Drop**: 500+ units (wider availability)

### Timing

- Launch drops on specific days (e.g., "Drop Fridays")
- Avoid major holidays
- Consider time zones (launch at noon EST)
- Run drops for 24-72 hours typically

### Marketing

- Tease drops 1-2 weeks in advance
- Share sneak peeks on social media
- Build hype with countdown posts
- Highlight limited quantity
- Share sold-out announcements

### Communication

- Clear drop rules and terms
- Transparent about quantity
- Honest about restock likelihood
- Responsive to customer questions
- Post-drop thank you message

## Future Enhancements

### Phase 5: Advanced Features

- **Waitlist**: Allow signups after sold out for potential restocks
- **Early Access**: VIP or subscriber early access period
- **Bundle Drops**: Multiple products in coordinated drop
- **Tiered Drops**: Different quantities at different price points
- **Flash Drops**: Surprise drops with no advance notice
- **Raffle System**: Enter to win purchase opportunity
- **Purchase Limits**: Max quantity per customer

### Gamification

- Drop badges for successful purchases
- Loyalty points for drop participation
- Exclusive access for repeat customers
- Referral bonuses for drop signups

## Technical Considerations

### Performance

- Cache drop status to reduce database queries
- Use Redis for inventory reservation
- Optimize countdown timer rendering
- Lazy load drop components

### Scalability

- Handle high traffic during drop launches
- Queue notification emails
- Rate limit API endpoints
- CDN for static assets

### Security

- Prevent bot purchases
- Rate limit signup endpoints
- Validate email addresses
- Prevent duplicate signups
- CAPTCHA for high-demand drops

## Compliance

### Legal Requirements

- Clear terms for limited releases
- No false scarcity claims
- Accurate inventory counts
- Refund policy for drops
- Data privacy for email signups

### Email Compliance

- Include unsubscribe link
- Honor opt-out requests
- CAN-SPAM compliance
- GDPR compliance for EU customers

## Success Criteria

### Launch Checklist

- [ ] Drop products configured in admin
- [ ] Countdown timer tested
- [ ] Notification system tested
- [ ] Inventory tracking verified
- [ ] Email templates approved
- [ ] Marketing materials ready
- [ ] Support team briefed
- [ ] Monitoring dashboards set up

### Post-Launch Review

- Analyze conversion rates
- Review customer feedback
- Identify technical issues
- Assess inventory accuracy
- Evaluate notification effectiveness
- Plan improvements for next drop

## Resources

- [Shopify Drop Best Practices](https://www.shopify.com/blog/product-drops)
- [Limited Release Marketing Guide](https://www.shopify.com/blog/limited-edition-products)
- [Email Marketing for Drops](https://www.klaviyo.com/blog/product-launch-email)

## Status

**Current Status**: Infrastructure Ready
**Next Steps**: Implement Phase 1 (Drop Product Setup)
**Estimated Effort**: 1-2 sprints for full implementation
**Priority**: Medium (future enhancement)
