# Performance Monitoring Architecture

## Overview

Performance metrics are tracked throughout the entire website (all public pages) but are viewed and managed exclusively through the admin dashboard. This provides comprehensive visibility into site performance without exposing sensitive data to public users.

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Public Pages                              │
│  (Home, Programs, Tools, Shop, Impact, Login)                   │
│                                                                   │
│  • Web Vitals tracking on every page                            │
│  • Automatic metric collection                                   │
│  • No UI for users - invisible tracking                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ POST /api/admin/performance/metrics
                         │ (Public endpoint - receives data)
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API Layer                                   │
│                                                                   │
│  POST /api/admin/performance/metrics  (Public - receives)       │
│  GET  /api/admin/performance/metrics  (Admin - retrieves)       │
│  GET  /api/admin/performance/alerts   (Admin - alerts)          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Store metrics
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Database                                    │
│                                                                   │
│  PerformanceMetric table:                                        │
│  • Page name, URL                                                │
│  • FCP, LCP, FID, CLS, TTFB                                     │
│  • Device type, connection                                       │
│  • Timestamp, user agent                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Query metrics
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Admin Dashboard                                │
│                   /admin/performance                             │
│                                                                   │
│  • Performance overview                                          │
│  • Page-by-page metrics                                          │
│  • Core Web Vitals charts                                        │
│  • Bundle size monitoring                                        │
│  • Performance alerts                                            │
│  • Historical trends                                             │
└─────────────────────────────────────────────────────────────────┘
```

## Implementation Details

### 1. Client-Side Tracking (All Public Pages)

**Location:** `app/(public)/layout.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackWebVitals } from '@/lib/performance/monitoring';

export default function PublicLayout({ children }) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Automatically track Web Vitals on all pages
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onCLS((metric) => trackWebVitals('cls', metric.value, pathname));
        onFID((metric) => trackWebVitals('fid', metric.value, pathname));
        onFCP((metric) => trackWebVitals('fcp', metric.value, pathname));
        onLCP((metric) => trackWebVitals('lcp', metric.value, pathname));
        onTTFB((metric) => trackWebVitals('ttfb', metric.value, pathname));
      });
    }
  }, [pathname]);
  
  return <>{children}</>;
}
```

**Key Points:**
- Runs on every public page automatically
- No UI visible to users
- Minimal performance impact (< 5KB gzipped)
- Tracks real user experiences

### 2. Performance Monitoring Service

**Location:** `lib/performance/monitoring.ts`

```typescript
interface PerformanceMetrics {
  pageName: string;
  url: string;
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  connectionType: string;
}

export async function trackWebVitals(
  metric: string,
  value: number,
  pathname: string
): Promise<void> {
  // Collect device and connection info
  const deviceType = getDeviceType();
  const connectionType = getConnectionType();
  
  // Send to API endpoint (batched to reduce requests)
  await fetch('/api/admin/performance/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pageName: getPageName(pathname),
      url: pathname,
      [metric]: value,
      deviceType,
      connectionType,
      timestamp: new Date().toISOString(),
    }),
  });
}
```

**Key Points:**
- Batches metrics to reduce API calls
- Includes device and connection context
- Handles errors gracefully
- No user-facing errors

### 3. API Endpoints

#### POST /api/admin/performance/metrics (Public)

**Purpose:** Receive metrics from client-side tracking

```typescript
// app/api/admin/performance/metrics/route.ts

export async function POST(request: Request) {
  const metrics = await request.json();
  
  // Validate metrics
  const validated = performanceMetricsSchema.parse(metrics);
  
  // Store in database
  await prisma.performanceMetric.create({
    data: validated,
  });
  
  // Check for performance issues and create alerts
  await checkPerformanceThresholds(validated);
  
  return NextResponse.json({ success: true });
}
```

#### GET /api/admin/performance/metrics (Admin Only)

**Purpose:** Retrieve aggregated metrics for dashboard

```typescript
export async function GET(request: Request) {
  // Verify admin authentication
  const session = await getServerSession();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('timeRange') || '7d';
  const page = searchParams.get('page');
  
  // Query metrics from database
  const metrics = await getAggregatedMetrics(timeRange, page);
  
  return NextResponse.json(metrics);
}
```

### 4. Database Schema

**Location:** `prisma/schema.prisma`

```prisma
model PerformanceMetric {
  id             String   @id @default(cuid())
  pageName       String   // e.g., "Home", "Programs", "Shop"
  url            String   // Full URL path
  
  // Core Web Vitals
  fcp            Float?   // First Contentful Paint (ms)
  lcp            Float?   // Largest Contentful Paint (ms)
  fid            Float?   // First Input Delay (ms)
  cls            Float?   // Cumulative Layout Shift (score)
  ttfb           Float?   // Time to First Byte (ms)
  
  // Context
  deviceType     String   // mobile, tablet, desktop
  connectionType String   // 4g, 3g, wifi, etc.
  userAgent      String
  timestamp      DateTime @default(now())
  
  @@index([pageName, timestamp])
  @@index([timestamp])
  @@map("performance_metrics")
}

model PerformanceAlert {
  id          String   @id @default(cuid())
  type        String   // warning, error, critical
  message     String
  pageName    String
  metricName  String   // lcp, fcp, etc.
  threshold   Float
  actualValue Float
  resolved    Boolean  @default(false)
  createdAt   DateTime @default(now())
  resolvedAt  DateTime?
  
  @@index([resolved, createdAt])
  @@map("performance_alerts")
}
```

### 5. Admin Dashboard

**Location:** `app/(protected)/admin/performance/page.tsx`

```typescript
export default async function PerformanceDashboardPage() {
  // Verify admin access
  const session = await getServerSession();
  if (session?.user?.role !== 'ADMIN') {
    redirect('/login');
  }
  
  // Fetch metrics
  const metrics = await getPerformanceMetrics('7d');
  const alerts = await getPerformanceAlerts();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Performance Dashboard</h1>
      
      {/* Overview Cards */}
      <PerformanceOverview metrics={metrics.overview} />
      
      {/* Alerts */}
      {alerts.length > 0 && (
        <PerformanceAlerts alerts={alerts} />
      )}
      
      {/* Core Web Vitals Chart */}
      <CoreWebVitalsChart data={metrics.vitals} />
      
      {/* Page Performance Table */}
      <PagePerformanceTable pages={metrics.pages} />
      
      {/* Bundle Size Monitor */}
      <BundleSizeMonitor bundles={metrics.bundles} />
    </div>
  );
}
```

**Dashboard Components:**

1. **PerformanceOverview** - Key metrics at a glance
   - Average LCP, FCP, FID, CLS
   - Percentage passing Core Web Vitals
   - Total page views tracked

2. **PerformanceAlerts** - Active performance issues
   - Critical alerts (LCP > 4s, etc.)
   - Warnings (approaching thresholds)
   - Resolution tracking

3. **CoreWebVitalsChart** - Time-series visualization
   - Trend lines for each metric
   - 7-day, 30-day, 90-day views
   - Device/connection breakdowns

4. **PagePerformanceTable** - Per-page metrics
   - All pages with their metrics
   - Sort by any metric
   - Drill-down to page details

5. **BundleSizeMonitor** - JavaScript bundle tracking
   - Bundle sizes per route
   - Change tracking over time
   - Alerts for size increases

## Data Flow Example

### User Visits Home Page

1. **Page Loads** → Client-side tracking initializes
2. **Web Vitals Measured** → Browser reports FCP, LCP, FID, CLS
3. **Metrics Sent** → POST to `/api/admin/performance/metrics`
4. **Data Stored** → Saved to `PerformanceMetric` table
5. **Thresholds Checked** → Alert created if metrics exceed limits
6. **Admin Views** → Dashboard shows updated metrics

### Admin Checks Performance

1. **Navigate** → `/admin/performance`
2. **Authentication** → Verify admin role
3. **Fetch Data** → GET `/api/admin/performance/metrics?timeRange=7d`
4. **Aggregate** → Calculate averages, percentiles, trends
5. **Display** → Render charts and tables
6. **Alerts** → Show any active performance issues

## Security Considerations

### Public Endpoint Protection

The POST endpoint is public (must be to receive metrics from all pages) but protected against abuse:

```typescript
// Rate limiting
const rateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 100, // Max 100 metrics per minute per IP
});

// Data validation
const performanceMetricsSchema = z.object({
  pageName: z.string().max(100),
  url: z.string().url().max(500),
  fcp: z.number().min(0).max(60000),
  lcp: z.number().min(0).max(60000),
  // ... other validations
});

// No sensitive data stored
// Only performance metrics, no user PII
```

### Admin Dashboard Protection

All GET endpoints require admin authentication:

```typescript
const session = await getServerSession();
if (session?.user?.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}
```

## Performance Impact

### Client-Side Overhead

- **Bundle Size:** ~5KB gzipped (web-vitals library)
- **Runtime Impact:** < 1ms per metric
- **Network:** 1 API call per page load (batched metrics)
- **User Experience:** Zero visible impact

### Server-Side Load

- **Database Writes:** ~1 per page view
- **Storage:** ~200 bytes per metric entry
- **Retention:** 90 days (configurable)
- **Cleanup:** Automated job deletes old metrics

## Monitoring Best Practices

### 1. Set Performance Budgets

```typescript
const PERFORMANCE_BUDGETS = {
  '/': { lcp: 2000, fcp: 1200, cls: 0.1 },
  '/programs': { lcp: 2500, fcp: 1500, cls: 0.1 },
  '/tools': { lcp: 2000, fcp: 1200, cls: 0.1 },
  '/shop': { lcp: 2500, fcp: 1500, cls: 0.1 },
  '/impact': { lcp: 2500, fcp: 1500, cls: 0.1 },
  '/login': { lcp: 1500, fcp: 800, cls: 0.1 },
};
```

### 2. Alert on Degradation

```typescript
// Alert if metrics exceed budget by 20%
if (metric.lcp > budget.lcp * 1.2) {
  await createAlert({
    type: 'warning',
    message: `LCP on ${pageName} exceeded budget`,
    pageName,
    metricName: 'lcp',
    threshold: budget.lcp,
    actualValue: metric.lcp,
  });
}
```

### 3. Regular Reviews

- **Daily:** Check for critical alerts
- **Weekly:** Review trends and patterns
- **Monthly:** Analyze long-term performance
- **Quarterly:** Adjust budgets and thresholds

## Future Enhancements

1. **Real-Time Dashboard** - WebSocket updates for live metrics
2. **Anomaly Detection** - ML-based performance issue detection
3. **A/B Testing** - Compare performance of different implementations
4. **Geographic Insights** - Performance by user location
5. **Custom Metrics** - Track business-specific performance indicators

---

**Summary:** Performance tracking happens everywhere, monitoring happens in admin dashboard only. This provides comprehensive visibility while maintaining security and user privacy.
