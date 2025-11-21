# Production Environment Setup Guide

This guide covers setting up environment variables for production deployment of AFYA Website V2.

## Required Environment Variables

### Database
```env
DATABASE_URL="postgresql://user:password@host:5432/afya?schema=public&sslmode=require"
```
- **IMPORTANT**: Always use SSL in production (`sslmode=require`)
- Use a managed database service (Vercel Postgres, Supabase, AWS RDS, etc.)
- Ensure connection pooling is configured

### Authentication
```env
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
```
- `NEXTAUTH_URL` must match your production domain
- Generate a strong secret: `openssl rand -base64 32`

### Email
```env
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="<your-sendgrid-api-key>"
EMAIL_FROM="noreply@yourdomain.com"
```
- Recommended providers: SendGrid, AWS SES, Resend
- Ensure SPF and DKIM records are configured

### Stripe Payment Processing
```env
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```
- Use **live keys** for production (not test keys)
- Configure webhook endpoint at: `https://yourdomain.com/api/webhooks/stripe`
- Webhook events to listen for:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `charge.refunded`

### Webhook Security
```env
WEBHOOK_SECRET="<generate-with-openssl-rand-base64-32>"
```
- Must match the secret in your Google Apps Script
- Used to authenticate webhook requests

## Feature Flags

### Shop Feature
```env
NEXT_PUBLIC_SHOP_ENABLED="true"
```
- Set to `"false"` to disable shop functionality site-wide
- Useful for maintenance or gradual rollout

### Gear Drive
```env
NEXT_PUBLIC_GEAR_DRIVE_ENABLED="true"
```
- Set to `"false"` to disable gear drive submissions
- Form will show "Currently not accepting submissions"

### Equipment Donation (Coming Soon)
```env
NEXT_PUBLIC_EQUIPMENT_DONATION_ENABLED="false"
```
- Keep as `"false"` until feature is ready
- When enabled, removes "Coming Soon" badge and activates form

### Community Stats Counter
```env
NEXT_PUBLIC_COMMUNITY_STATS_ENABLED="true"
```
- Displays "Community Minutes Moved" counter
- Set to `"false"` to hide counter during initial launch

### Donation Allocation
```env
NEXT_PUBLIC_DONATION_ALLOCATION_REQUIRED="true"
```
- When `"true"`, customers must select allocation before checkout
- When `"false"`, allocation is optional

### Real-time Updates
```env
NEXT_PUBLIC_REALTIME_UPDATES_ENABLED="false"
```
- Enable WebSocket/polling for live community stats updates
- Requires additional infrastructure (Redis, WebSocket server)
- Keep disabled unless infrastructure is in place

## Production Settings

### Rate Limiting
```env
RATE_LIMIT_MAX_REQUESTS="100"
RATE_LIMIT_WINDOW_MS="60000"
```
- Protects against abuse and DDoS
- Adjust based on expected traffic patterns
- Consider higher limits for authenticated users

### Session Configuration
```env
SESSION_MAX_AGE="2592000"
SESSION_UPDATE_AGE="86400"
```
- `SESSION_MAX_AGE`: Total session lifetime (30 days)
- `SESSION_UPDATE_AGE`: How often to refresh session (1 day)

### Cache TTL
```env
CACHE_TTL_PRODUCTS="300"
CACHE_TTL_COMMUNITY_STATS="60"
CACHE_TTL_CONTENT="3600"
```
- Balances freshness vs. performance
- Lower values = more database queries, fresher data
- Higher values = fewer queries, potentially stale data

### Image Optimization
```env
NEXT_PUBLIC_IMAGE_QUALITY="85"
NEXT_PUBLIC_IMAGE_FORMATS="webp,avif"
```
- Quality: 75-90 recommended (85 is good balance)
- Formats: Modern formats (WebP, AVIF) with automatic fallbacks

### Security
```env
ENABLE_SECURITY_HEADERS="true"
ENABLE_CSP="true"
```
- Always keep enabled in production
- Provides defense-in-depth security

### Logging
```env
LOG_LEVEL="info"
DEBUG_MODE="false"
```
- Production should use `"info"` or `"warn"` level
- Never enable `DEBUG_MODE` in production (exposes sensitive info)

## Optional: Performance Monitoring

### Sentry (Recommended)
```env
SENTRY_DSN="https://your-key@sentry.io/your-project-id"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"
SENTRY_ORG="your-organization"
SENTRY_PROJECT="your-project"
ENABLE_PERFORMANCE_MONITORING="true"
PERFORMANCE_SAMPLE_RATE="0.1"
```
- Tracks errors and performance issues
- Sample rate: 0.1 = 10% of requests (adjust based on traffic)

## Optional: Caching (Redis)

```env
REDIS_URL="redis://user:password@host:6379"
```
- Significantly improves performance
- Recommended for production
- Providers: Upstash, Redis Cloud, AWS ElastiCache

## Optional: File Storage (S3)

```env
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="afya-packets"
```
- For storing packet PDFs
- Alternative: Vercel Blob Storage

## Deployment Checklist

### Pre-Deployment
- [ ] Generate all required secrets (`openssl rand -base64 32`)
- [ ] Set up production database with SSL
- [ ] Configure email provider (SendGrid, SES, etc.)
- [ ] Create Stripe live account and get API keys
- [ ] Set up Stripe webhook endpoint
- [ ] Configure DNS and SSL certificate
- [ ] Set all environment variables in hosting platform

### Post-Deployment
- [ ] Run database migrations
- [ ] Seed initial data (products, community stats)
- [ ] Test Stripe webhook delivery
- [ ] Test email delivery
- [ ] Verify all feature flags work correctly
- [ ] Monitor error logs for first 24 hours
- [ ] Test complete purchase flow with real payment
- [ ] Verify mobile responsiveness

## Platform-Specific Instructions

### Vercel
1. Go to Project Settings → Environment Variables
2. Add all variables from this guide
3. Set appropriate environments (Production, Preview, Development)
4. Redeploy after adding variables

### Netlify
1. Go to Site Settings → Build & Deploy → Environment
2. Add all variables
3. Trigger new deployment

### AWS/Custom Server
1. Use `.env.production` file or system environment variables
2. Ensure file permissions are secure (600)
3. Never commit `.env.production` to version control
4. Use secrets manager for sensitive values (AWS Secrets Manager, etc.)

## Security Best Practices

1. **Never commit secrets to version control**
   - Use `.gitignore` for `.env` files
   - Use secrets management services

2. **Rotate secrets regularly**
   - Database passwords: Every 90 days
   - API keys: Every 180 days
   - Webhook secrets: Every 180 days

3. **Use different secrets for each environment**
   - Development, staging, and production should have unique secrets

4. **Limit access to production secrets**
   - Only senior team members should have access
   - Use role-based access control

5. **Monitor for leaked secrets**
   - Use tools like GitGuardian or GitHub secret scanning
   - Immediately rotate any leaked secrets

## Troubleshooting

### Stripe Webhooks Not Working
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Check webhook endpoint is publicly accessible
- Review webhook logs in Stripe dashboard
- Ensure `NEXT_PUBLIC_APP_URL` is correct

### Email Not Sending
- Verify SMTP credentials
- Check email provider logs
- Ensure SPF/DKIM records are configured
- Test with a simple email first

### Database Connection Issues
- Verify SSL mode is enabled
- Check connection string format
- Ensure database allows connections from your hosting IP
- Verify connection pooling settings

### Feature Flags Not Working
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Rebuild application after changing environment variables
- Clear browser cache and hard refresh

## Support

For additional help:
- Review [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- Check [Stripe Setup Guide](./STRIPE_SETUP_GUIDE.md)
- Consult [Monitoring Guide](./MONITORING_GUIDE.md)
