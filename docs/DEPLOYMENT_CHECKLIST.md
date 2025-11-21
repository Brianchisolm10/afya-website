# Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Code reviewed and approved
- [ ] Documentation updated

### Environment Setup
- [ ] Production database created
- [ ] All environment variables configured
- [ ] Secrets generated and stored securely
- [ ] SSL certificate configured
- [ ] Domain name configured

### Database
- [ ] Database connection string tested
- [ ] SSL mode enabled for database connection
- [ ] Migrations reviewed
- [ ] Backup strategy in place
- [ ] Connection pooling configured

### Security
- [ ] NEXTAUTH_SECRET generated (32+ characters)
- [ ] WEBHOOK_SECRET generated (32+ characters)
- [ ] Email credentials secured
- [ ] API keys stored in environment variables
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation implemented

## Deployment Steps

### 1. Database Setup
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Verify schema
npx prisma db pull
```
- [ ] Migrations completed successfully
- [ ] Schema matches expected structure

### 2. Seed Initial Data
```bash
# Seed all data
npm run seed:all

# Or seed individually:
npm run seed:questions
npm run seed:paths
npm run seed:templates
```
- [ ] Question blocks seeded
- [ ] Intake paths seeded
- [ ] Packet templates seeded

### 3. Create Admin User
```bash
npm run seed:admin
```
- [ ] Admin user created
- [ ] Admin credentials saved securely
- [ ] Admin can login successfully

### 4. Deploy Application

**Vercel:**
```bash
vercel --prod
```

**Railway:**
```bash
git push origin main
```

**Docker:**
```bash
docker build -t afya-app .
docker run -p 3000:3000 --env-file .env.production afya-app
```

- [ ] Deployment completed without errors
- [ ] Application is accessible

## Post-Deployment Verification

### Health Checks
- [ ] Health endpoint responding: `GET /api/health`
- [ ] Database connection verified
- [ ] Application uptime confirmed

### Functional Testing
- [ ] Homepage loads correctly
- [ ] User can access intake form
- [ ] Path selection works
- [ ] Dynamic form renders correctly
- [ ] Form submission succeeds
- [ ] Packet generation triggered
- [ ] Admin can login
- [ ] Admin dashboard accessible
- [ ] Packet management works
- [ ] Template management works
- [ ] Email notifications sent

### Performance Testing
- [ ] Page load times acceptable (< 3s)
- [ ] API response times acceptable (< 1s)
- [ ] Database queries optimized
- [ ] No memory leaks detected

### Security Testing
- [ ] HTTPS enabled
- [ ] Authentication required for protected routes
- [ ] Authorization checks working
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Input sanitization working

### Monitoring Setup
- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring enabled
- [ ] Log aggregation working
- [ ] Alerts configured
- [ ] Dashboard accessible

## Monitoring and Alerting

### Configure Alerts
- [ ] Error rate > 5%
- [ ] Response time p95 > 2s
- [ ] Queue depth > 100
- [ ] Job failure rate > 10%
- [ ] Database connection issues
- [ ] Memory usage > 80%
- [ ] Disk space < 10%

### Set Up Dashboards
- [ ] System health dashboard
- [ ] Queue monitoring dashboard
- [ ] Analytics dashboard
- [ ] Error tracking dashboard

### Configure Notifications
- [ ] Email alerts for critical issues
- [ ] Slack/Discord webhooks configured
- [ ] On-call rotation set up

## Documentation

- [ ] Deployment guide updated
- [ ] Monitoring guide updated
- [ ] Admin guide updated
- [ ] User guide updated
- [ ] API documentation updated
- [ ] Runbook created for common issues

## Backup and Recovery

- [ ] Database backup configured
- [ ] Backup schedule set (daily recommended)
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented
- [ ] Rollback procedure documented

## Performance Optimization

- [ ] CDN configured for static assets
- [ ] Caching strategy implemented
- [ ] Database indexes added
- [ ] Connection pooling enabled
- [ ] Image optimization enabled

## Compliance and Legal

- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] GDPR compliance verified (if applicable)
- [ ] HIPAA compliance verified (if handling PHI)
- [ ] Data retention policy implemented

## Team Communication

- [ ] Team notified of deployment
- [ ] Deployment notes shared
- [ ] Known issues documented
- [ ] Support team briefed
- [ ] Monitoring access granted

## Post-Deployment Tasks

### Immediate (Within 1 hour)
- [ ] Monitor error logs
- [ ] Check system metrics
- [ ] Verify critical flows
- [ ] Test user-reported issues

### Short-term (Within 24 hours)
- [ ] Review performance metrics
- [ ] Analyze user behavior
- [ ] Check packet generation success rate
- [ ] Review queue health

### Medium-term (Within 1 week)
- [ ] Gather user feedback
- [ ] Optimize slow queries
- [ ] Review and fix any bugs
- [ ] Update documentation based on learnings

## Rollback Plan

If issues are detected:

1. **Assess Severity:**
   - Critical: Immediate rollback
   - High: Rollback within 1 hour
   - Medium: Fix forward if possible
   - Low: Schedule fix for next deployment

2. **Execute Rollback:**
   - Vercel: Promote previous deployment
   - Railway: Redeploy previous version
   - Docker: Deploy previous image

3. **Database Rollback (if needed):**
   ```bash
   # Rollback migration
   npx prisma migrate resolve --rolled-back <migration-name>
   
   # Restore from backup
   pg_restore -d afya_production backup.dump
   ```

4. **Communicate:**
   - Notify team of rollback
   - Document issues encountered
   - Plan fix for next deployment

## Success Criteria

Deployment is considered successful when:

- [ ] All health checks passing
- [ ] No critical errors in logs
- [ ] All functional tests passing
- [ ] Performance metrics within acceptable range
- [ ] User feedback positive
- [ ] No rollback required within 24 hours

## Sign-Off

**Deployed By:** ___________________  
**Date:** ___________________  
**Time:** ___________________  
**Version:** ___________________  
**Environment:** ___________________  

**Verified By:** ___________________  
**Date:** ___________________  

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________

---

**Last Updated:** November 2025
**Version:** 1.0.0
