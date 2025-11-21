# Monitoring and Logging Guide

This guide covers setting up comprehensive monitoring and logging for the Afya system.

## Table of Contents

1. [Error Tracking](#error-tracking)
2. [Performance Monitoring](#performance-monitoring)
3. [Job Queue Monitoring](#job-queue-monitoring)
4. [Log Aggregation](#log-aggregation)
5. [Alerting](#alerting)
6. [Dashboards](#dashboards)

## Error Tracking

### Sentry Integration

Sentry provides real-time error tracking and performance monitoring.

#### Setup

1. **Create Sentry Account:**
   - Go to https://sentry.io
   - Create a new project (Next.js)
   - Get your DSN

2. **Install Sentry SDK:**
   ```bash
   npm install @sentry/nextjs
   ```

3. **Initialize Sentry:**
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

4. **Configure Environment Variables:**
   ```bash
   SENTRY_DSN="https://your-dsn@sentry.io/project-id"
   SENTRY_AUTH_TOKEN="your-auth-token"
   SENTRY_ORG="your-org"
   SENTRY_PROJECT="your-project"
   ```

5. **Sentry Configuration Files:**

**sentry.client.config.ts:**
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["localhost", /^https:\/\/yourapp\.com/],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

**sentry.server.config.ts:**
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  tracesSampleRate: 1.0,
  
  environment: process.env.NODE_ENV,
  
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  
  integrations: [
    new Sentry.Integrations.Prisma({ client: prisma }),
  ],
});
```

**sentry.edge.config.ts:**
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

#### Usage in Code

**Capture Errors:**
```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'packet-generation',
      clientType: client.clientType,
    },
    extra: {
      clientId: client.id,
      packetType: packet.type,
    },
  });
  throw error;
}
```

**Add Context:**
```typescript
Sentry.setUser({
  id: user.id,
  email: user.email,
  role: user.role,
});

Sentry.setContext('client', {
  id: client.id,
  type: client.clientType,
});
```

**Custom Transactions:**
```typescript
const transaction = Sentry.startTransaction({
  op: 'packet.generation',
  name: 'Generate Nutrition Packet',
});

try {
  // Your code
  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('internal_error');
  throw error;
} finally {
  transaction.finish();
}
```

### Alternative: LogRocket

For session replay and user monitoring:

```bash
npm install logrocket
```

```typescript
import LogRocket from 'logrocket';

LogRocket.init('your-app-id');

// Identify users
LogRocket.identify(user.id, {
  name: user.name,
  email: user.email,
});
```

## Performance Monitoring

### Application Performance Monitoring (APM)

#### Vercel Analytics

Built-in for Vercel deployments:

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### New Relic

1. **Install:**
   ```bash
   npm install newrelic
   ```

2. **Configure:**
   ```javascript
   // newrelic.js
   exports.config = {
     app_name: ['Afya App'],
     license_key: process.env.NEW_RELIC_LICENSE_KEY,
     logging: {
       level: 'info'
     },
     distributed_tracing: {
       enabled: true
     }
   };
   ```

3. **Initialize:**
   ```javascript
   // At the top of your entry file
   require('newrelic');
   ```

### Custom Performance Tracking

**Create Performance Logger:**

```typescript
// lib/monitoring/performance.ts
import * as Sentry from '@sentry/nextjs';

export class PerformanceMonitor {
  private startTime: number;
  private operation: string;

  constructor(operation: string) {
    this.operation = operation;
    this.startTime = Date.now();
  }

  finish(metadata?: Record<string, any>) {
    const duration = Date.now() - this.startTime;
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${this.operation}: ${duration}ms`, metadata);
    }
    
    // Send to Sentry
    Sentry.addBreadcrumb({
      category: 'performance',
      message: this.operation,
      level: 'info',
      data: {
        duration,
        ...metadata,
      },
    });
    
    // Alert if slow
    if (duration > 5000) {
      Sentry.captureMessage(`Slow operation: ${this.operation}`, {
        level: 'warning',
        tags: { type: 'performance' },
        extra: { duration, ...metadata },
      });
    }
    
    return duration;
  }
}

// Usage
const monitor = new PerformanceMonitor('packet-generation');
await generatePacket(client);
monitor.finish({ clientId: client.id });
```

### Database Query Monitoring

**Prisma Middleware:**

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

const prisma = new PrismaClient();

// Log slow queries
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  const duration = after - before;

  if (duration > 1000) {
    Sentry.captureMessage('Slow database query', {
      level: 'warning',
      tags: { type: 'database' },
      extra: {
        model: params.model,
        action: params.action,
        duration,
      },
    });
  }

  return result;
});

export { prisma };
```

## Job Queue Monitoring

### In-Memory Queue Monitoring

**Create Queue Monitor:**

```typescript
// lib/monitoring/queue-monitor.ts
import { jobQueue } from '@/lib/intake/job-queue';
import * as Sentry from '@sentry/nextjs';

export class QueueMonitor {
  private checkInterval: NodeJS.Timeout | null = null;

  start() {
    // Check queue health every minute
    this.checkInterval = setInterval(() => {
      this.checkQueueHealth();
    }, 60000);
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  private async checkQueueHealth() {
    const stats = await jobQueue.getStats();
    
    // Log metrics
    console.log('[Queue Stats]', stats);
    
    // Send to monitoring
    Sentry.addBreadcrumb({
      category: 'queue',
      message: 'Queue health check',
      level: 'info',
      data: stats,
    });
    
    // Alert if queue is backed up
    if (stats.pending > 50) {
      Sentry.captureMessage('Job queue backed up', {
        level: 'warning',
        tags: { type: 'queue' },
        extra: stats,
      });
    }
    
    // Alert if high failure rate
    if (stats.failed > stats.completed * 0.1) {
      Sentry.captureMessage('High job failure rate', {
        level: 'error',
        tags: { type: 'queue' },
        extra: stats,
      });
    }
  }

  async getMetrics() {
    return await jobQueue.getStats();
  }
}

export const queueMonitor = new QueueMonitor();
```

**Queue Metrics API:**

```typescript
// app/api/admin/monitoring/queue/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { queueMonitor } from '@/lib/monitoring/queue-monitor';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const metrics = await queueMonitor.getMetrics();
  
  return NextResponse.json(metrics);
}
```

### Redis Queue Monitoring (Bull)

If using Bull with Redis:

```typescript
import Bull from 'bull';
import * as Sentry from '@sentry/nextjs';

const packetQueue = new Bull('packet-generation', process.env.REDIS_URL);

// Monitor queue events
packetQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
  Sentry.addBreadcrumb({
    category: 'queue',
    message: 'Job completed',
    data: { jobId: job.id },
  });
});

packetQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
  Sentry.captureException(err, {
    tags: { type: 'queue-job-failed' },
    extra: { jobId: job.id, jobData: job.data },
  });
});

packetQueue.on('stalled', (job) => {
  Sentry.captureMessage('Job stalled', {
    level: 'warning',
    tags: { type: 'queue' },
    extra: { jobId: job.id },
  });
});
```

## Log Aggregation

### Structured Logging

**Create Logger Utility:**

```typescript
// lib/monitoring/logger.ts
import * as Sentry from '@sentry/nextjs';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  userId?: string;
  clientId?: string;
  packetId?: string;
  operation?: string;
  [key: string]: any;
}

class Logger {
  private context: LogContext = {};

  setContext(context: LogContext) {
    this.context = { ...this.context, ...context };
  }

  clearContext() {
    this.context = {};
  }

  private log(level: LogLevel, message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.context,
      data,
    };

    // Console output
    const consoleMethod = level === LogLevel.ERROR ? 'error' : 
                         level === LogLevel.WARN ? 'warn' : 'log';
    console[consoleMethod](JSON.stringify(logEntry));

    // Send to Sentry
    if (level === LogLevel.ERROR) {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: { ...this.context, ...data },
      });
    } else if (level === LogLevel.WARN) {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: { ...this.context, ...data },
      });
    } else {
      Sentry.addBreadcrumb({
        category: 'log',
        message,
        level: level as any,
        data: { ...this.context, ...data },
      });
    }
  }

  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, data);
    }
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, error?: Error, data?: any) {
    this.log(LogLevel.ERROR, message, {
      error: error?.message,
      stack: error?.stack,
      ...data,
    });
  }
}

export const logger = new Logger();
```

**Usage:**

```typescript
import { logger } from '@/lib/monitoring/logger';

// Set context for all logs in this request
logger.setContext({ userId: user.id, operation: 'packet-generation' });

logger.info('Starting packet generation', { packetType: 'NUTRITION' });

try {
  // Your code
  logger.info('Packet generated successfully', { packetId: packet.id });
} catch (error) {
  logger.error('Packet generation failed', error, { clientId: client.id });
}

logger.clearContext();
```

### Log Aggregation Services

#### Logtail (BetterStack)

```bash
npm install @logtail/node @logtail/winston
```

```typescript
import { Logtail } from '@logtail/node';

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

logtail.info('Packet generated', {
  clientId: client.id,
  packetType: packet.type,
});
```

#### Datadog

```bash
npm install dd-trace
```

```typescript
// At the top of your entry file
require('dd-trace').init({
  logInjection: true,
  analytics: true,
});
```

## Alerting

### Alert Configuration

**Create Alert Rules:**

```typescript
// lib/monitoring/alerts.ts
import * as Sentry from '@sentry/nextjs';

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

interface Alert {
  title: string;
  message: string;
  severity: AlertSeverity;
  metadata?: Record<string, any>;
}

export class AlertManager {
  async sendAlert(alert: Alert) {
    // Log alert
    console.error(`[ALERT ${alert.severity.toUpperCase()}] ${alert.title}`, alert);

    // Send to Sentry
    const sentryLevel = this.getSentryLevel(alert.severity);
    Sentry.captureMessage(alert.title, {
      level: sentryLevel,
      tags: {
        alert: 'true',
        severity: alert.severity,
      },
      extra: {
        message: alert.message,
        ...alert.metadata,
      },
    });

    // Send email for critical alerts
    if (alert.severity === AlertSeverity.CRITICAL) {
      await this.sendEmailAlert(alert);
    }

    // Send to Slack/Discord (if configured)
    if (process.env.SLACK_WEBHOOK_URL) {
      await this.sendSlackAlert(alert);
    }
  }

  private getSentryLevel(severity: AlertSeverity): Sentry.SeverityLevel {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return 'fatal';
      case AlertSeverity.HIGH:
        return 'error';
      case AlertSeverity.MEDIUM:
        return 'warning';
      default:
        return 'info';
    }
  }

  private async sendEmailAlert(alert: Alert) {
    // Implement email sending
    // Use your email service
  }

  private async sendSlackAlert(alert: Alert) {
    const color = {
      [AlertSeverity.LOW]: '#36a64f',
      [AlertSeverity.MEDIUM]: '#ff9900',
      [AlertSeverity.HIGH]: '#ff0000',
      [AlertSeverity.CRITICAL]: '#8b0000',
    }[alert.severity];

    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attachments: [{
          color,
          title: alert.title,
          text: alert.message,
          fields: Object.entries(alert.metadata || {}).map(([key, value]) => ({
            title: key,
            value: String(value),
            short: true,
          })),
          footer: 'Afya Monitoring',
          ts: Math.floor(Date.now() / 1000),
        }],
      }),
    });
  }
}

export const alertManager = new AlertManager();
```

**Usage:**

```typescript
import { alertManager, AlertSeverity } from '@/lib/monitoring/alerts';

// Critical alert
await alertManager.sendAlert({
  title: 'Database Connection Lost',
  message: 'Unable to connect to production database',
  severity: AlertSeverity.CRITICAL,
  metadata: {
    database: 'production',
    error: error.message,
  },
});

// High severity alert
await alertManager.sendAlert({
  title: 'High Packet Generation Failure Rate',
  message: '25% of packets failed in the last hour',
  severity: AlertSeverity.HIGH,
  metadata: {
    failureRate: '25%',
    period: '1 hour',
  },
});
```

### Alert Conditions

Monitor and alert on:

1. **Error Rate:** > 5% of requests failing
2. **Response Time:** p95 > 2 seconds
3. **Queue Depth:** > 100 pending jobs
4. **Job Failure Rate:** > 10% of jobs failing
5. **Database Connection:** Connection pool exhausted
6. **Memory Usage:** > 80% of available memory
7. **Disk Space:** < 10% free space
8. **Packet Generation:** > 60 seconds to generate

## Dashboards

### Monitoring Dashboard API

```typescript
// app/api/admin/monitoring/dashboard/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { queueMonitor } from '@/lib/monitoring/queue-monitor';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get system metrics
  const [
    totalClients,
    totalPackets,
    pendingPackets,
    failedPackets,
    recentErrors,
    queueStats,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.packet.count(),
    prisma.packet.count({ where: { status: 'PENDING' } }),
    prisma.packet.count({ where: { status: 'FAILED' } }),
    prisma.packet.findMany({
      where: { status: 'FAILED' },
      take: 10,
      orderBy: { updatedAt: 'desc' },
      include: { client: { select: { fullName: true, email: true } } },
    }),
    queueMonitor.getMetrics(),
  ]);

  // Calculate success rate
  const successRate = totalPackets > 0
    ? ((totalPackets - failedPackets) / totalPackets * 100).toFixed(2)
    : 100;

  return NextResponse.json({
    system: {
      totalClients,
      totalPackets,
      pendingPackets,
      failedPackets,
      successRate: `${successRate}%`,
    },
    queue: queueStats,
    recentErrors: recentErrors.map(packet => ({
      id: packet.id,
      type: packet.type,
      client: packet.client.fullName,
      error: packet.lastError,
      timestamp: packet.updatedAt,
    })),
    timestamp: new Date().toISOString(),
  });
}
```

### Grafana Dashboard (Optional)

If using Prometheus + Grafana:

1. **Install Prometheus Client:**
   ```bash
   npm install prom-client
   ```

2. **Create Metrics Endpoint:**
   ```typescript
   // app/api/metrics/route.ts
   import { NextResponse } from 'next/server';
   import client from 'prom-client';

   const register = new client.Registry();

   // Define metrics
   const httpRequestDuration = new client.Histogram({
     name: 'http_request_duration_seconds',
     help: 'Duration of HTTP requests in seconds',
     labelNames: ['method', 'route', 'status'],
     registers: [register],
   });

   const packetGenerationDuration = new client.Histogram({
     name: 'packet_generation_duration_seconds',
     help: 'Duration of packet generation in seconds',
     labelNames: ['type'],
     registers: [register],
   });

   export async function GET() {
     const metrics = await register.metrics();
     return new NextResponse(metrics, {
       headers: { 'Content-Type': register.contentType },
     });
   }
   ```

## Best Practices

1. **Log Levels:**
   - DEBUG: Detailed information for debugging
   - INFO: General informational messages
   - WARN: Warning messages for potential issues
   - ERROR: Error messages for failures

2. **Structured Logging:**
   - Always use JSON format
   - Include context (userId, clientId, etc.)
   - Add timestamps
   - Use consistent field names

3. **Error Tracking:**
   - Capture all exceptions
   - Add relevant context
   - Group similar errors
   - Set up alerts for critical errors

4. **Performance Monitoring:**
   - Track key operations
   - Monitor database queries
   - Measure API response times
   - Alert on slow operations

5. **Privacy:**
   - Don't log sensitive data (passwords, tokens)
   - Mask PII in logs
   - Comply with data retention policies

## Monitoring Checklist

- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring enabled
- [ ] Database query monitoring active
- [ ] Job queue monitoring implemented
- [ ] Structured logging in place
- [ ] Alert rules configured
- [ ] Dashboard created
- [ ] Log retention policy set
- [ ] Privacy compliance verified
- [ ] Team notified of monitoring setup

---

**Last Updated:** November 2025
**Version:** 1.0.0
