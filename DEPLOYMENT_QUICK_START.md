# AFYA Website V2 - Deployment Quick Start

This is a quick reference guide for deploying AFYA Website V2. For complete details, see [docs/DEPLOYMENT_CHECKLIST_V2.md](docs/DEPLOYMENT_CHECKLIST_V2.md).

## Prerequisites

- [ ] Production database created
- [ ] Stripe live account configured
- [ ] Email provider configured
- [ ] Hosting platform ready (Vercel, Netlify, etc.)

## Quick Deployment Steps

### 1. Configure Environment Variables

Copy all variables from `.env.example` to your hosting platform. Key variables:

```env
# Database (with SSL!)
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Auth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# Stripe (LIVE keys!)
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="<your-api-key>"

# Feature Flags
NEXT_PUBLIC_SHOP_ENABLED="true"
NEXT_PUBLIC_GEAR_DRIVE_ENABLED="true"
NEXT_PUBLIC_COMMUNITY_STATS_ENABLED="true"
```

**Validate environment:**
```bash
npx tsx scripts/validate-env.ts
```

### 2. Deploy Code

```bash
# Push to production branch
git push origin main

# Or trigger deployment in hosting platform
```

### 3. Run Database Migrations

```bash
# This script backs up DB first, then runs migrations
./scripts/run-production-migrations.sh
```

### 4. Seed Initial Data

```bash
# Seeds products, community stats, and placeholder content
npx tsx scripts/seed-production.ts
```

### 5. Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET` env var
5. Test webhook delivery

### 6. Test Critical Flows

```bash
# Run automated tests
npx tsx scripts/test-staging.ts
```

**Manual tests:**
- [ ] Complete a test purchase (use Stripe test card, then refund)
- [ ] Submit gear drive form
- [ ] Complete intake form
- [ ] Test on mobile device
- [ ] Verify emails are delivered

### 7. Monitor

- [ ] Check error logs
- [ ] Verify Stripe payments working
- [ ] Test email delivery
- [ ] Monitor performance

## Stripe Test Cards

For testing payments:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Auth:** `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

## Rollback Procedure

If issues occur:

1. **Disable features:**
   ```env
   NEXT_PUBLIC_SHOP_ENABLED="false"
   NEXT_PUBLIC_GEAR_DRIVE_ENABLED="false"
   ```

2. **Revert deployment** in hosting platform

3. **Restore database** (if needed):
   ```bash
   ls backups/  # Find latest backup
   gunzip backups/afya_backup_TIMESTAMP.sql.gz
   psql $DATABASE_URL -f backups/afya_backup_TIMESTAMP.sql
   ```

## Common Issues

### Stripe Webhooks Not Working
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Check webhook endpoint is publicly accessible
- Review webhook logs in Stripe dashboard

### Emails Not Sending
- Verify SMTP credentials
- Check email provider logs
- Test with simple email first

### Database Connection Issues
- Verify SSL mode is enabled (`sslmode=require`)
- Check connection string format
- Ensure database allows connections from hosting IP

## Support

- **Full Checklist:** [docs/DEPLOYMENT_CHECKLIST_V2.md](docs/DEPLOYMENT_CHECKLIST_V2.md)
- **Environment Setup:** [docs/PRODUCTION_ENV_SETUP.md](docs/PRODUCTION_ENV_SETUP.md)
- **Stripe Setup:** [docs/STRIPE_SETUP_GUIDE.md](docs/STRIPE_SETUP_GUIDE.md)

## Quick Commands Reference

```bash
# Validate environment
npx tsx scripts/validate-env.ts

# Backup database
./scripts/backup-database.sh

# Run migrations (with backup)
./scripts/run-production-migrations.sh

# Seed data
npx tsx scripts/seed-production.ts

# Verify schema
npx tsx scripts/verify-schema.ts

# Test staging
npx tsx scripts/test-staging.ts

# Verify deployment
npx tsx scripts/verify-deployment.ts
```

## Success Checklist

Deployment is successful when:

- [ ] All pages load without errors
- [ ] Test purchase completes successfully
- [ ] Emails are delivered
- [ ] Mobile experience works
- [ ] Admin panel is accessible
- [ ] No critical errors in logs
- [ ] Stripe webhook delivers successfully

---

**Need help?** See the complete deployment checklist: [docs/DEPLOYMENT_CHECKLIST_V2.md](docs/DEPLOYMENT_CHECKLIST_V2.md)
