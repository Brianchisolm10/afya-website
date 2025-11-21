# Subscription Infrastructure Requirements

## Overview

This document outlines the subscription infrastructure added to the AFYA Website V2 for future implementation of recurring product subscriptions. The infrastructure is designed to support subscription-based products alongside one-time purchases.

## Database Schema

### Product Model Extensions

The `Product` model has been extended with the following subscription-related fields:

- `isSubscription` (Boolean): Indicates if the product is a subscription
- `subscriptionInterval` (SubscriptionInterval): Billing frequency (WEEKLY, MONTHLY, QUARTERLY, YEARLY)
- `subscriptionPrice` (Float): Recurring price (may differ from one-time price)
- `trialPeriodDays` (Int): Optional trial period in days

### Subscription Model

A new `Subscription` model tracks active subscriptions:

```prisma
model Subscription {
  id                    String
  userId                String
  productId             String
  status                SubscriptionStatus
  interval              SubscriptionInterval
  price                 Float
  stripeSubscriptionId  String?
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  cancelAtPeriodEnd     Boolean
  canceledAt            DateTime?
  trialStart            DateTime?
  trialEnd              DateTime?
}
```

### Enums

**SubscriptionInterval:**
- WEEKLY
- MONTHLY
- QUARTERLY
- YEARLY

**SubscriptionStatus:**
- ACTIVE: Subscription is active and billing
- PAST_DUE: Payment failed, retry in progress
- CANCELED: Subscription has been canceled
- PAUSED: Subscription is temporarily paused
- TRIALING: In trial period, not yet billing

## Implementation Requirements

### Phase 1: Product Setup

1. **Admin Interface**
   - Add subscription toggle to product editor
   - Add interval selection dropdown
   - Add subscription price field
   - Add trial period configuration
   - Validate that subscription products have required fields

2. **Product Display**
   - Show subscription badge on product cards
   - Display billing interval (e.g., "$29/month")
   - Show trial period if available (e.g., "7-day free trial")
   - Differentiate subscription vs one-time purchase in UI

### Phase 2: Checkout Flow

1. **Cart Modifications**
   - Separate one-time and subscription items
   - Show recurring total vs one-time total
   - Display next billing date for subscriptions
   - Prevent mixing subscriptions with different intervals in single checkout

2. **Payment Processing**
   - Use Stripe Subscriptions API instead of PaymentIntent
   - Create Stripe Customer for subscription users
   - Attach payment method to customer
   - Handle trial period setup
   - Store `stripeSubscriptionId` in database

3. **Confirmation**
   - Show subscription details in confirmation email
   - Display next billing date
   - Provide subscription management link

### Phase 3: Subscription Management

1. **User Dashboard**
   - Create "My Subscriptions" page
   - Display active subscriptions with details
   - Show next billing date and amount
   - Provide cancel/pause options
   - Allow payment method updates

2. **API Endpoints**
   ```
   GET  /api/subscriptions          - List user's subscriptions
   GET  /api/subscriptions/[id]     - Get subscription details
   POST /api/subscriptions/[id]/cancel - Cancel subscription
   POST /api/subscriptions/[id]/pause  - Pause subscription
   POST /api/subscriptions/[id]/resume - Resume subscription
   PUT  /api/subscriptions/[id]/payment - Update payment method
   ```

3. **Webhook Handling**
   - Handle `customer.subscription.created`
   - Handle `customer.subscription.updated`
   - Handle `customer.subscription.deleted`
   - Handle `invoice.payment_succeeded`
   - Handle `invoice.payment_failed`
   - Update subscription status in database
   - Send notification emails

### Phase 4: Admin Management

1. **Subscription Dashboard**
   - View all active subscriptions
   - Filter by status, product, interval
   - View subscription metrics (MRR, churn rate)
   - Export subscription data

2. **Customer Support**
   - Manually cancel/pause subscriptions
   - Issue refunds
   - View subscription history
   - Handle failed payments

## Stripe Configuration

### Required Stripe Products

For each subscription product:
1. Create Stripe Product
2. Create Stripe Price with recurring interval
3. Store Stripe Price ID in product metadata
4. Configure trial period if applicable

### Webhook Events

Subscribe to the following Stripe webhook events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.subscription.trial_will_end`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `invoice.upcoming`

### Environment Variables

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SUBSCRIPTION_ENABLED=true
```

## Business Logic

### Subscription Creation

1. User adds subscription product to cart
2. User proceeds to checkout
3. System creates Stripe Customer (if new)
4. System creates Stripe Subscription with trial if applicable
5. System stores subscription in database
6. User receives confirmation email

### Billing Cycle

1. Stripe automatically charges customer on billing date
2. Webhook `invoice.payment_succeeded` received
3. System updates subscription period dates
4. System sends receipt email
5. If payment fails, webhook `invoice.payment_failed` received
6. System updates status to PAST_DUE
7. System sends payment failure notification

### Cancellation

1. User requests cancellation
2. System sets `cancelAtPeriodEnd = true`
3. Stripe subscription updated
4. User retains access until period end
5. At period end, status changes to CANCELED
6. System sends cancellation confirmation

### Trial Period

1. User starts subscription with trial
2. Status set to TRIALING
3. No charge during trial period
4. 3 days before trial end, send reminder email
5. At trial end, first charge processed
6. Status changes to ACTIVE

## Testing Requirements

### Unit Tests

- Product model validation for subscription fields
- Subscription status transitions
- Price calculations with trials
- Interval conversions

### Integration Tests

- Subscription creation flow
- Payment processing with Stripe
- Webhook handling
- Status updates

### E2E Tests

- Complete subscription purchase
- Subscription management (cancel, pause, resume)
- Payment method updates
- Trial period flow

## Migration Strategy

### Database Migration

```bash
npx prisma migrate dev --name add_subscription_infrastructure
```

### Data Migration

No data migration needed for initial setup. Existing products default to `isSubscription = false`.

### Rollout Plan

1. Deploy schema changes
2. Add subscription products in admin
3. Enable subscription checkout (feature flag)
4. Monitor for issues
5. Gradually promote subscription products

## Future Enhancements

### Phase 5: Advanced Features

- **Subscription Tiers**: Multiple subscription levels with different benefits
- **Add-ons**: Allow users to add one-time or recurring add-ons to subscriptions
- **Discounts**: Promotional pricing for first X months
- **Gifting**: Allow users to gift subscriptions
- **Referrals**: Referral program for subscription products
- **Dunning**: Automated retry logic for failed payments
- **Proration**: Handle mid-cycle upgrades/downgrades

### Analytics

- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Churn rate
- Customer Lifetime Value (LTV)
- Trial conversion rate
- Payment failure rate

## Support Considerations

### Customer Support Scripts

1. **How to cancel**: Guide users through cancellation process
2. **Payment failed**: Help users update payment method
3. **Refund policy**: Define refund policy for subscriptions
4. **Billing questions**: Explain billing cycles and charges

### Common Issues

- Payment method expired
- Insufficient funds
- Card declined
- Subscription not showing in dashboard
- Charged after cancellation

## Compliance

### Legal Requirements

- Clear disclosure of subscription terms
- Easy cancellation process
- Advance notice of price changes
- Transparent billing practices
- Data retention policies

### Terms of Service

Update Terms of Service to include:
- Subscription terms and conditions
- Cancellation policy
- Refund policy
- Auto-renewal disclosure
- Price change notification policy

## Success Metrics

### Key Performance Indicators

- Subscription conversion rate
- Trial-to-paid conversion rate
- Monthly churn rate
- Average subscription length
- Revenue per subscriber
- Customer acquisition cost (CAC)
- LTV:CAC ratio

### Monitoring

- Set up alerts for high churn
- Monitor payment failure rates
- Track subscription growth
- Analyze cancellation reasons

## Resources

- [Stripe Subscriptions Documentation](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Subscription Best Practices](https://stripe.com/docs/billing/subscriptions/best-practices)

## Status

**Current Status**: Infrastructure Ready
**Next Steps**: Implement Phase 1 (Product Setup)
**Estimated Effort**: 2-3 sprints for full implementation
**Priority**: Medium (future enhancement)
