# Deployment Guide

This guide covers deploying the Afya Dynamic Intake and Packet Generation System to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Job Queue Infrastructure](#job-queue-infrastructure)
5. [File Storage Configuration](#file-storage-configuration)
6. [Deployment Steps](#deployment-steps)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Rollback Procedures](#rollback-procedures)

## Prerequisites

Before deploying, ensure you have:

- [ ] Production database (PostgreSQL recommended)
- [ ] Email service provider (SMTP credentials)
- [ ] Domain name and SSL certificate
- [ ] Hosting platform account (Vercel, Railway, AWS, etc.)
- [ ] Node.js 18+ runtime environment
- [ ] Access to environment variable management

## Environment Configuration

### Required Environment Variables

Create a `.env.production` file or configure these in your hosting platform:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# Email Provider (SMTP)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@yourdomain.com"

# Webhook Security
WEBHOOK_SECRET="<generate-with-openssl-rand-base64-32>"

# Node Environment
NODE_ENV="production"

# Optional: Performance & Monitoring
SENTRY_DSN="<your-sentry-dsn>"
SENTRY_AUTH_TOKEN="<your-sentry-auth-token>"
SENTRY_ORG="<your-sentry-org>"
SENTRY_PROJECT="<your-sentry-project>"

# Optional: Redis for Caching (if using)
REDIS_URL="redis://user:password@host:port"

# Optional: S3 for File Storage (if using)
AWS_ACCESS_KEY_ID="<your-access-key>"
AWS_SECRET_ACCESS_KEY="<your-secret-key>"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="afya-packets"

# Optional: Job Queue (if using external service)
JOB_QUEUE_URL="<your-queue-url>"
```

### Generating Secrets

Generate secure secrets for production:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate WEBHOOK_SECRET
openssl rand -base64 32
```

### Platform-Specific Configuration

#### Vercel

1. Go to Project Settings → Environment Variables
2. Add all required variables
3. Set environment to "Production"
4. Redeploy after adding variables

#### Railway

1. Go to Variables tab
2. Add all required variables
3. Railway will auto-deploy on changes

#### AWS/EC2

1. Use AWS Systems Manager Parameter Store or Secrets Manager
2. Configure environment variables in your deployment script
3. Use IAM roles for AWS service access

## Database Setup

### 1. Create Production Database

**PostgreSQL (Recommended):**

```bash
# Using managed service (Vercel Postgres, Supabase, etc.)
# Follow provider's setup instructions

# Or using your own PostgreSQL server:
createdb afya_production
```

### 2. Configure Connection

Update `DATABASE_URL` with your production database connection string:

```
postgresql://username:password@host:port/database?schema=public&sslmode=require
```

**Important:** Always use SSL in production (`sslmode=require`)

### 3. Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Verify schema
npx prisma db pull
```

### 4. Seed Initial Data

```bash
# Seed question blocks
npm run seed:questions

# Seed intake paths
npm run seed:paths

# Seed packet templates
npm run seed:templates

# Create admin user
npm run seed:admin
```

## Job Queue Infrastructure

The system uses an in-memory job queue for packet generation. For production, consider these options:

### Option 1: In-Memory Queue (Current Implementation)

**Pros:**
- No additional infrastructure
- Simple setup
- Works for small to medium scale

**Cons:**
- Jobs lost on server restart
- No horizontal scaling
- Limited monitoring

**Configuration:**
- No additional setup required
- Jobs are processed in the same Node.js process

### Option 2: Redis-Based Queue (Recommended for Production)

**Setup:**

1. Install dependencies:
```bash
npm install bull redis
npm install --save-dev @types/bull
```

2. Configure Redis:
```bash
REDIS_URL="redis://user:password@host:port"
```

3. Update job queue implementation (see `lib/intake/job-queue.ts`)

### Option 3: External Job Service

Consider services like:
- **AWS SQS** - Managed queue service
- **Google Cloud Tasks** - Serverless task queue
- **Quirrel** - Serverless job queue for Next.js

## File Storage Configuration

### Option 1: Local File System (Current Implementation)

**Configuration:**
```bash
# Files stored in public/packets directory
# Served directly by Next.js
```

**Pros:**
- Simple setup
- No additional costs

**Cons:**
- Not suitable for serverless deployments
- No CDN benefits
- Limited scalability

### Option 2: AWS S3 (Recommended for Production)

**Setup:**

1. Create S3 bucket:
```bash
aws s3 mb s3://afya-packets --region us-east-1
```

2. Configure bucket policy for public read access (for packet downloads)

3. Install AWS SDK:
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

4. Update environment variables:
```bash
AWS_ACCESS_KEY_ID="<your-key>"
AWS_SECRET_ACCESS_KEY="<your-secret>"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="afya-packets"
```

5. Update PDF export service to use S3

### Option 3: Vercel Blob Storage

If deploying to Vercel:

```bash
npm install @vercel/blob
```

Configure in Vercel dashboard and update PDF export service.

## Deployment Steps

### Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Backup current production data (if applicable)
- [ ] Monitoring tools configured

### Vercel Deployment

1. **Connect Repository:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Link project
   vercel link
   ```

2. **Configure Build Settings:**
   - Build Command: `prisma generate && prisma migrate deploy && next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Deploy:**
   ```bash
   # Deploy to preview
   vercel
   
   # Deploy to production
   vercel --prod
   ```

### Railway Deployment

1. **Connect Repository:**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure:**
   - Add environment variables
   - Railway auto-detects Next.js
   - Set start command: `npm start`

3. **Deploy:**
   - Push to main branch
   - Railway auto-deploys

### Docker Deployment

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci
   
   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   
   RUN npx prisma generate
   RUN npm run build
   
   # Production image
   FROM base AS runner
   WORKDIR /app
   
   ENV NODE_ENV production
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   
   EXPOSE 3000
   
   ENV PORT 3000
   
   CMD ["node", "server.js"]
   ```

2. **Build and Deploy:**
   ```bash
   docker build -t afya-app .
   docker run -p 3000:3000 --env-file .env.production afya-app
   ```

## Post-Deployment Verification

### 1. Health Checks

Create a health check endpoint:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: 'Database connection failed'
    }, { status: 503 });
  }
}
```

### 2. Verify Services

```bash
# Check application is running
curl https://yourdomain.com/api/health

# Check database migrations
npx prisma migrate status

# Verify seeded data
npx prisma studio
```

### 3. Test Critical Flows

- [ ] User can access homepage
- [ ] User can complete intake form
- [ ] Packets are generated successfully
- [ ] Admin can login and access dashboard
- [ ] Email notifications are sent
- [ ] PDF downloads work

### 4. Monitor Logs

```bash
# Vercel
vercel logs

# Railway
railway logs

# Docker
docker logs <container-id>
```

## Rollback Procedures

### Vercel Rollback

1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Railway Rollback

1. Go to Deployments tab
2. Click on previous deployment
3. Click "Redeploy"

### Database Rollback

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back <migration-name>

# Restore from backup
pg_restore -d afya_production backup.dump
```

## Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Database Connection Issues:**
- Verify DATABASE_URL is correct
- Check firewall rules
- Ensure SSL is configured properly

**Environment Variable Issues:**
- Verify all required variables are set
- Check for typos in variable names
- Ensure secrets are properly encoded

**Packet Generation Failures:**
- Check job queue is running
- Verify file storage is accessible
- Review error logs for specific issues

## Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured
- [ ] Database uses SSL connection
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Authentication required for protected routes
- [ ] Secrets rotated regularly
- [ ] Backups configured
- [ ] Monitoring and alerting set up

## Performance Optimization

### Caching Strategy

1. **Static Assets:**
   - Configure CDN (Vercel Edge Network, CloudFront, etc.)
   - Set appropriate cache headers

2. **API Responses:**
   - Implement Redis caching for frequently accessed data
   - Cache question blocks and intake paths

3. **Database:**
   - Enable connection pooling
   - Add indexes for frequently queried fields
   - Use read replicas for reporting queries

### Monitoring Metrics

Track these key metrics:
- Response time (p50, p95, p99)
- Error rate
- Database query performance
- Packet generation time
- Queue depth
- Memory usage
- CPU usage

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check packet generation success rate
- Review system health metrics

**Weekly:**
- Review and clear old logs
- Check database size and performance
- Update dependencies (security patches)

**Monthly:**
- Review and optimize slow queries
- Analyze user analytics
- Update documentation
- Rotate secrets and credentials

**Quarterly:**
- Full security audit
- Performance optimization review
- Disaster recovery drill
- Dependency updates (major versions)

## Support

For deployment issues:
1. Check logs first
2. Review this documentation
3. Check GitHub issues
4. Contact development team

---

**Last Updated:** November 2025
**Version:** 1.0.0
