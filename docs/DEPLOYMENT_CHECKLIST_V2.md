# AFYA Website V2 - Deployment Checklist

This checklist ensures a smooth deployment of AFYA Website V2 with all new features (Shop, Impact, Community Stats, Gear Drive).

## Pre-Deployment Checklist

### 1. Environment Configuration

- [ ] All environment variables set in hosting platform
  - [ ] `DATABASE_URL` (with SSL enabled)
  - [ ] `NEXTAUTH_URL` (production domain)
  - [ ] `NEXTAUTH_SECRET` (generated with `openssl rand -base64 32`)
  - [ ] `STRIPE_SECRET_KEY` (live key: `sk_live_...`)
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live key: `pk_live_...`)
  - [ ] `STRIPE_WEBHOOK_SECRET` (from Stripe dashboard)
  - [ ] `NEXT_PUBLIC_APP_URL` (production domain)
  - [ ] Email configuration (SMTP settings)
  - [ ] `WEBHOOK_SECRET` (for Google Apps Script)
  - [ ] Feature flags configured appropriately

- [ ] Run environment validation script:
  ```bash
  npx tsx scripts/validate-env.ts
  ```

### 2. Database Preparation

- [ ] Production database created and accessible
- [ ] Database connection tested
- [ ] SSL/TLS enabled for database connections
- [ ] Connection pooling configured
- [ ] Backup strategy in place

### 3. Stripe Configuration

- [ ] Stripe account in live mode
- [ ] Live API keys obtained
- [ ] Webhook endpoint configured:
  - URL: `https://yourdomain.com/api/webhooks/stripe`
  - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
- [ ] Webhook secret obtained and set in environment
- [ ] Test payment with live card (small amount)
- [ ] Refund tested

### 4. Email Configuration

- [ ] Email provider configured (SendGrid, AWS SES, etc.)
- [ ] SMTP credentials verified
- [ ] SPF and DKIM records configured
- [ ] Test email sent successfully
- [ ] Email templates reviewed

### 5. Code Review

- [ ] All features tested locally
- [ ] No console.log statements in production code
- [ ] No hardcoded secrets or API keys
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Mobile responsiveness verified
- [ ] Accessibility checked
- [ ] SEO meta tags added

## Deployment Steps

### Step 1: Backup Current Production (if applicable)

```bash
# Backup database
./scripts/backup-database.sh

# Backup environment variables (document current settings)
```

### Step 2: Deploy Code

- [ ] Push code to production branch
- [ ] Trigger deployment (Vercel, Netlify, etc.)
- [ ] Wait for build to complete
- [ ] Check build logs for errors

### Step 3: Run Database Migrations

```bash
# In production environment
./scripts/run-production-migrations.sh
```

- [ ] Migrations completed successfully
- [ ] Schema verified with `npx tsx scripts/verify-schema.ts`
- [ ] No migration errors in logs

### Step 4: Seed Initial Data

```bash
# Seed products, community stats, and placeholder content
npx tsx scripts/seed-production.ts
```

- [ ] Products seeded successfully
- [ ] Community stats initialized
- [ ] Placeholder content added (if any)
- [ ] Verify data in database

### Step 5: Verify Deployment

```bash
# Run staging tests against production
NEXT_PUBLIC_APP_URL=https://yourdomain.com npx tsx scripts/test-staging.ts
```

- [ ] All critical pages load
- [ ] API endpoints respond correctly
- [ ] No 500 errors in logs

## Post-Deployment Testing

### Critical User Flows

#### 1. Shop & Purchase Flow
- [ ] Browse products on shop page
- [ ] Filter products by category
- [ ] View product details
- [ ] Add product to cart
- [ ] Proceed to checkout
- [ ] Select donation allocation (Foundations or Sponsor-A-Client)
- [ ] Complete payment with test card (then refund)
- [ ] Receive order confirmation email
- [ ] View order in admin panel

#### 2. Donation Flow
- [ ] Navigate to Impact > Donate
- [ ] Fill out donation form
- [ ] Complete payment
- [ ] Receive donation confirmation email
- [ ] Verify donation recorded in database

#### 3. Gear Drive Submission
- [ ] Navigate to Impact > Gear Drive
- [ ] Fill out gear drive form
- [ ] Submit form
- [ ] Receive confirmation email
- [ ] Verify submission in admin panel

#### 4. Intake Form
- [ ] Navigate to intake form
- [ ] Select client type
- [ ] Complete form
- [ ] Submit form
- [ ] Verify packet generation
- [ ] Download packet PDF

#### 5. Community Stats
- [ ] Verify "Community Minutes Moved" counter displays
- [ ] Check counter value is reasonable
- [ ] Verify stats update (if real-time enabled)

### Navigation & Pages

- [ ] Home page loads correctly
- [ ] Programs page displays all 7 programs
- [ ] Shop page displays products
- [ ] Impact page shows all sections
- [ ] About page loads
- [ ] Contact page loads
- [ ] FAQ page loads
- [ ] Login page works
- [ ] Navigation menu works on desktop
- [ ] Mobile navigation (hamburger menu) works
- [ ] Footer displays all links
- [ ] Footer links work correctly

### Mobile Testing

Test on actual devices:

- [ ] iPhone (Safari)
  - [ ] Navigation works
  - [ ] Forms are usable
  - [ ] Checkout flow works
  - [ ] Touch targets are adequate
  - [ ] Images load correctly

- [ ] Android (Chrome)
  - [ ] Navigation works
  - [ ] Forms are usable
  - [ ] Checkout flow works
  - [ ] Touch targets are adequate
  - [ ] Images load correctly

- [ ] Tablet (iPad/Android)
  - [ ] Layout adapts correctly
  - [ ] All features work

### Admin Panel

- [ ] Login to admin panel
- [ ] View products
- [ ] Add/edit product
- [ ] View orders
- [ ] View gear drive submissions
- [ ] View community stats
- [ ] View clients
- [ ] Manage users
- [ ] Edit content

### Performance

- [ ] Home page loads in < 3 seconds
- [ ] Shop page loads in < 3 seconds
- [ ] Images are optimized (WebP format)
- [ ] No layout shift on page load
- [ ] Lighthouse score > 90 (Performance)

### Security

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CSP (Content Security Policy) enabled
- [ ] Rate limiting active
- [ ] No sensitive data in client-side code
- [ ] API routes protected with authentication
- [ ] Stripe webhook signature verified

### Monitoring

- [ ] Error tracking configured (Sentry, etc.)
- [ ] Performance monitoring active
- [ ] Database monitoring active
- [ ] Uptime monitoring configured
- [ ] Alert notifications configured

## Stripe Webhook Verification

### Test Webhook Delivery

1. Go to Stripe Dashboard > Developers > Webhooks
2. Find your production webhook endpoint
3. Click "Send test webhook"
4. Select `payment_intent.succeeded`
5. Verify webhook received successfully
6. Check application logs for webhook processing

### Verify Webhook Events

- [ ] `payment_intent.succeeded` - Order marked as paid
- [ ] `payment_intent.payment_failed` - Order marked as failed
- [ ] `charge.refunded` - Order marked as refunded

## Rollback Plan

If critical issues are discovered:

### Immediate Actions

1. **Disable problematic features** using feature flags:
   ```env
   NEXT_PUBLIC_SHOP_ENABLED="false"
   NEXT_PUBLIC_GEAR_DRIVE_ENABLED="false"
   ```

2. **Revert deployment** (if necessary):
   - Rollback to previous version in hosting platform
   - Restore database from backup if schema changed

3. **Restore database** (if migrations failed):
   ```bash
   # Find latest backup
   ls -lh backups/
   
   # Restore backup
   gunzip backups/afya_backup_TIMESTAMP.sql.gz
   psql $DATABASE_URL -f backups/afya_backup_TIMESTAMP.sql
   ```

### Communication

- [ ] Notify team of issues
- [ ] Post status update (if public-facing)
- [ ] Document issues for post-mortem

## Post-Deployment Monitoring

### First 24 Hours

- [ ] Monitor error logs every 2 hours
- [ ] Check Stripe dashboard for payment issues
- [ ] Verify email delivery
- [ ] Monitor database performance
- [ ] Check API response times
- [ ] Review user feedback/support tickets

### First Week

- [ ] Daily error log review
- [ ] Monitor conversion rates
- [ ] Check donation allocation distribution
- [ ] Review gear drive submissions
- [ ] Analyze community stats growth
- [ ] Performance metrics review

### First Month

- [ ] Weekly metrics review
- [ ] User feedback analysis
- [ ] Performance optimization opportunities
- [ ] Feature usage analysis
- [ ] Plan next iteration

## Success Criteria

Deployment is considered successful when:

- [ ] All critical user flows work correctly
- [ ] No critical errors in logs
- [ ] Payment processing works (test transaction completed)
- [ ] Email delivery works
- [ ] Mobile experience is smooth
- [ ] Performance meets targets (< 3s page load)
- [ ] Admin panel is functional
- [ ] Monitoring is active
- [ ] Team is trained on new features

## Documentation Updates

- [ ] Update README with new features
- [ ] Update admin guide with shop management
- [ ] Update user guide with new pages
- [ ] Document any deployment-specific configurations
- [ ] Update API documentation (if applicable)

## Team Communication

- [ ] Notify team of successful deployment
- [ ] Share access to monitoring dashboards
- [ ] Schedule post-deployment review meeting
- [ ] Document lessons learned
- [ ] Update runbooks with any new procedures

## Support Preparation

- [ ] Support team trained on new features
- [ ] FAQ updated with common questions
- [ ] Support documentation updated
- [ ] Escalation procedures defined
- [ ] Contact information verified

---

## Quick Reference Commands

```bash
# Validate environment
npx tsx scripts/validate-env.ts

# Backup database
./scripts/backup-database.sh

# Run migrations
./scripts/run-production-migrations.sh

# Seed data
npx tsx scripts/seed-production.ts

# Verify schema
npx tsx scripts/verify-schema.ts

# Test staging
npx tsx scripts/test-staging.ts

# Check deployment
npx tsx scripts/verify-deployment.ts
```

## Emergency Contacts

- **Technical Lead**: [Name] - [Contact]
- **DevOps**: [Name] - [Contact]
- **Stripe Support**: https://support.stripe.com
- **Hosting Support**: [Provider-specific]

---

**Last Updated**: [Date]
**Deployment Version**: V2.0.0
**Deployed By**: [Name]
