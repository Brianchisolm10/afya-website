# Website Performance Optimization - Design Document

## Overview

This design document outlines the technical approach for optimizing the AFYA website's performance across all public pages. The optimization strategy focuses on reducing load times, creating seamless page transitions, and improving perceived performance through strategic code splitting, caching, and resource optimization.

## Architecture

### Performance Optimization Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
├─────────────────────────────────────────────────────────────┤
│  Service Worker Cache │ Browser Cache │ Memory Cache        │
├─────────────────────────────────────────────────────────────┤
│                     CDN Layer (Vercel Edge)                  │
├─────────────────────────────────────────────────────────────┤
│  Next.js App Router │ ISR │ Server Components               │
├─────────────────────────────────────────────────────────────┤
│  In-Memory Cache │ Redis Cache (optional)                   │
├─────────────────────────────────────────────────────────────┤
│                     Database (Prisma)                        │
└─────────────────────────────────────────────────────────────┘
```

### Page-Specific Optimization Strategy

| Page | Strategy | Priority Resources | Lazy Load |
|------|----------|-------------------|-----------|
| Home | ISR + Prefetch | Hero image, CTA | Testimonials, Stats |
| Programs | ISR + Hover Prefetch | Program cards | Program details |
| Tools | Code Splitting | Tool list | Tool components |
| Shop | ISR + Infinite Scroll | Product grid | Product images |
| Impact | ISR + Scroll Load | Hero, Stats | Stories, Forms |
| Login | Minimal Bundle | Form, Auth | Dashboard prefetch |

## Components and Interfaces

### 1. Performance Monitoring Service

**Purpose:** Track Core Web Vitals and custom metrics throughout the site, store in database, view in admin dashboard

**Architecture:**
```
Public Pages → Performance Tracking → API Endpoint → Database
                                                          ↓
Admin Dashboard ← API Endpoint ← Database Query
```

```typescript
// lib/performance/monitoring.ts

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  pageLoadTime: number;
}

interface PerformanceEntry {
  id: string;
  pageName: string;
  url: string;
  metrics: PerformanceMetrics;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  connectionType: string;
  timestamp: Date;
  userAgent: string;
}

interface PerformanceMonitor {
  // Client-side tracking (runs on all pages)
  trackPageLoad(pageName: string): void;
  trackMetric(name: string, value: number): void;
  reportWebVitals(metrics: PerformanceMetrics): Promise<void>;
  
  // Server-side API (admin only)
  getMetrics(filters?: MetricsFilter): Promise<PerformanceEntry[]>;
  getAggregatedMetrics(timeRange: string): Promise<AggregatedMetrics>;
}

class PerformanceMonitorService implements PerformanceMonitor {
  private metrics: Map<string, number>;
  
  // Tracks metrics on client-side (all pages)
  trackPageLoad(pageName: string): void;
  trackMetric(name: string, value: number): void;
  
  // Sends metrics to API endpoint
  async reportWebVitals(metrics: PerformanceMetrics): Promise<void> {
    await fetch('/api/admin/performance/metrics', {
      method: 'POST',
      body: JSON.stringify(metrics),
    });
  }
  
  // Admin-only: Retrieve metrics
  async getMetrics(filters?: MetricsFilter): Promise<PerformanceEntry[]>;
  async getAggregatedMetrics(timeRange: string): Promise<AggregatedMetrics>;
}
```

**Database Schema:**
```prisma
model PerformanceMetric {
  id             String   @id @default(cuid())
  pageName       String
  url            String
  fcp            Float
  lcp            Float
  fid            Float
  cls            Float
  ttfb           Float
  pageLoadTime   Float
  deviceType     String
  connectionType String
  userAgent      String
  timestamp      DateTime @default(now())
  
  @@index([pageName, timestamp])
  @@index([timestamp])
}
```

### 2. Resource Prefetching Service

**Purpose:** Intelligently prefetch resources based on user behavior

```typescript
// lib/performance/prefetch.ts

interface PrefetchOptions {
  priority: 'high' | 'low';
  as: 'document' | 'script' | 'style' | 'image';
  crossOrigin?: 'anonymous' | 'use-credentials';
}

interface PrefetchService {
  prefetchRoute(path: string): void;
  prefetchImage(src: string): void;
  prefetchData(url: string): Promise<void>;
  onLinkHover(href: string): void;
  onLinkVisible(href: string): void;
}

class ResourcePrefetcher implements PrefetchService {
  private prefetchedRoutes: Set<string>;
  private prefetchQueue: string[];
  
  prefetchRoute(path: string): void;
  prefetchImage(src: string): void;
  prefetchData(url: string): Promise<void>;
  onLinkHover(href: string): void;
  onLinkVisible(href: string): void;
}
```

### 3. Image Optimization Component

**Purpose:** Optimized image component with lazy loading and placeholders

```typescript
// components/performance/OptimizedImage.tsx

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  className?: string;
}

export function OptimizedImage(props: OptimizedImageProps): JSX.Element;
```

### 4. Code Splitting Utilities

**Purpose:** Dynamic imports with loading states

```typescript
// lib/performance/code-splitting.ts

interface DynamicImportOptions {
  loading?: React.ComponentType;
  ssr?: boolean;
  suspense?: boolean;
}

function dynamicImport<T>(
  importFn: () => Promise<{ default: T }>,
  options?: DynamicImportOptions
): T;

// Usage
const ToolComponent = dynamicImport(
  () => import('@/components/tools/EnergyProteinCalculator'),
  { loading: () => <Spinner />, ssr: false }
);
```

### 5. Page Transition Manager

**Purpose:** Smooth transitions between pages with loading states

```typescript
// lib/performance/transitions.ts

interface TransitionOptions {
  duration: number;
  showLoader: boolean;
  prefetch: boolean;
}

interface PageTransitionManager {
  startTransition(to: string, options?: TransitionOptions): void;
  completeTransition(): void;
  cancelTransition(): void;
  onTransitionStart(callback: () => void): void;
  onTransitionEnd(callback: () => void): void;
}

class TransitionManager implements PageTransitionManager {
  private isTransitioning: boolean;
  private currentTransition: string | null;
  
  startTransition(to: string, options?: TransitionOptions): void;
  completeTransition(): void;
  cancelTransition(): void;
}
```

### 6. Cache Management Service

**Purpose:** Unified caching layer with TTL and invalidation

```typescript
// lib/performance/cache-manager.ts

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheManager {
  get<T>(key: string): T | null;
  set<T>(key: string, data: T, ttl: number): void;
  invalidate(key: string): void;
  invalidatePattern(pattern: string): void;
  clear(): void;
  getStats(): CacheStats;
}

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}

class PerformanceCacheManager implements CacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private stats: CacheStats;
  
  get<T>(key: string): T | null;
  set<T>(key: string, data: T, ttl: number): void;
  invalidate(key: string): void;
  invalidatePattern(pattern: string): void;
}
```

## Data Models

### Performance Metrics Schema

```typescript
interface PagePerformanceMetrics {
  id: string;
  pageName: string;
  url: string;
  timestamp: Date;
  
  // Core Web Vitals
  fcp: number;  // First Contentful Paint
  lcp: number;  // Largest Contentful Paint
  fid: number;  // First Input Delay
  cls: number;  // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  
  // Custom Metrics
  pageLoadTime: number;
  domContentLoaded: number;
  resourceLoadTime: number;
  
  // Context
  deviceType: 'mobile' | 'tablet' | 'desktop';
  connectionType: string;
  userAgent: string;
}
```

### Resource Loading Strategy

```typescript
interface ResourceLoadStrategy {
  route: string;
  criticalResources: string[];
  deferredResources: string[];
  prefetchResources: string[];
  lazyLoadResources: string[];
  cacheStrategy: 'network-first' | 'cache-first' | 'stale-while-revalidate';
  cacheDuration: number;
}

const loadStrategies: Record<string, ResourceLoadStrategy> = {
  '/': {
    route: '/',
    criticalResources: ['hero-image', 'navigation', 'cta-section'],
    deferredResources: ['testimonials', 'community-stats'],
    prefetchResources: ['/programs', '/tools'],
    lazyLoadResources: ['footer-content', 'success-stories'],
    cacheStrategy: 'stale-while-revalidate',
    cacheDuration: 300, // 5 minutes
  },
  // ... other routes
};
```

## Page-Specific Optimization Strategies

### Home Page (`/`)

**Optimization Focus:** Fast initial load, engaging hero section

```typescript
// app/(public)/page.tsx

export const revalidate = 300; // ISR: 5 minutes

export default async function HomePage() {
  // Server-side data fetching with caching
  const stats = await getCommunityStats(); // Cached
  
  return (
    <>
      {/* Critical: Hero Section */}
      <HeroSection priority />
      
      {/* Deferred: Community Stats */}
      <Suspense fallback={<StatsSkeleton />}>
        <CommunityStats data={stats} />
      </Suspense>
      
      {/* Lazy: Testimonials */}
      <LazyTestimonials />
      
      {/* Prefetch: Next likely pages */}
      <PrefetchLinks routes={['/programs', '/tools']} />
    </>
  );
}
```

**Optimizations:**
- Hero image with `priority` flag
- Critical CSS inlined
- Testimonials lazy loaded on scroll
- Prefetch programs and tools pages
- ISR with 5-minute revalidation

### Programs Page (`/programs`)

**Optimization Focus:** Fast card rendering, hover prefetch

```typescript
// app/(public)/programs/page.tsx

export const revalidate = 600; // ISR: 10 minutes

export default async function ProgramsPage() {
  const programs = await getPrograms(); // Cached
  
  return (
    <>
      <ProgramsHero />
      
      <ProgramGrid 
        programs={programs}
        onCardHover={(slug) => prefetchRoute(`/programs/${slug}`)}
      />
      
      <PrefetchOnVisible routes={programs.map(p => `/programs/${p.slug}`)} />
    </>
  );
}
```

**Optimizations:**
- Program cards with lazy-loaded images
- Hover prefetch for program details
- Intersection Observer for visible card prefetch
- ISR with 10-minute revalidation

### Tools Page (`/tools`)

**Optimization Focus:** Code splitting, fast tool loading

```typescript
// app/(public)/tools/page.tsx

// Tool components loaded dynamically
const EnergyCalculator = dynamic(
  () => import('@/components/tools/EnergyProteinCalculator'),
  { loading: () => <ToolSkeleton />, ssr: false }
);

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  
  return (
    <>
      <ToolsGrid onToolSelect={setActiveTool} />
      
      {/* Only load active tool component */}
      {activeTool && (
        <Suspense fallback={<ToolSkeleton />}>
          <DynamicToolLoader toolId={activeTool} />
        </Suspense>
      )}
    </>
  );
}
```

**Optimizations:**
- Code splitting per tool
- Dynamic imports with loading states
- Tool calculation libraries lazy loaded
- No SSR for interactive tools

### Shop Page (`/shop`)

**Optimization Focus:** Progressive loading, infinite scroll

```typescript
// app/(public)/shop/page.tsx

export const revalidate = 300; // ISR: 5 minutes

export default async function ShopPage() {
  const initialProducts = await getProducts({ limit: 12 });
  
  return (
    <>
      <ShopHero />
      
      <InfiniteProductGrid 
        initialProducts={initialProducts}
        loadMore={loadMoreProducts}
        lazyLoadImages
      />
    </>
  );
}
```

**Optimizations:**
- Initial 12 products server-rendered
- Infinite scroll with pagination
- Progressive image loading with blur placeholders
- Product images lazy loaded
- ISR with 5-minute revalidation

### Impact Page (`/impact`)

**Optimization Focus:** Engaging animations, scroll-based loading

```typescript
// app/(public)/impact/page.tsx

export const revalidate = 600; // ISR: 10 minutes

export default async function ImpactPage() {
  const impactStats = await getImpactStats(); // Cached
  
  return (
    <>
      <ImpactHero priority />
      
      <AnimatedStats data={impactStats} />
      
      <LazyLoadOnScroll>
        <ImpactStories />
      </LazyLoadOnScroll>
      
      <PrefetchLinks routes={['/impact/donate', '/impact/gear-drive']} />
    </>
  );
}
```

**Optimizations:**
- Hero with priority loading
- Animated counters with Intersection Observer
- Stories lazy loaded on scroll
- Prefetch donation forms
- ISR with 10-minute revalidation

### Login Page (`/login`)

**Optimization Focus:** Minimal bundle, fast authentication

```typescript
// app/(auth)/login/page.tsx

// Minimal dependencies
export default function LoginPage() {
  return (
    <>
      <LoginForm />
      
      {/* Prefetch dashboard after form interaction */}
      <PrefetchOnInteraction route="/dashboard" />
    </>
  );
}
```

**Optimizations:**
- Minimal JavaScript bundle (< 50KB)
- No heavy dependencies
- Prefetch dashboard on form interaction
- Optimistic UI for login feedback
- No ISR (always fresh)

## Error Handling

### Performance Degradation Handling

```typescript
// lib/performance/error-handling.ts

interface PerformanceError {
  type: 'slow-load' | 'timeout' | 'resource-error';
  page: string;
  metric: string;
  value: number;
  threshold: number;
}

function handlePerformanceError(error: PerformanceError): void {
  // Log to monitoring service
  console.error('Performance degradation detected:', error);
  
  // Report to analytics
  reportToAnalytics('performance_error', error);
  
  // Attempt recovery
  if (error.type === 'timeout') {
    retryResourceLoad(error.page);
  }
}
```

### Fallback Strategies

```typescript
// Progressive enhancement fallbacks

// 1. Image loading fallback
<OptimizedImage
  src="/hero.jpg"
  fallback="/hero-low-quality.jpg"
  onError={(e) => e.target.src = '/placeholder.jpg'}
/>

// 2. Font loading fallback
font-family: 'CustomFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

// 3. JavaScript failure fallback
<noscript>
  <div class="no-js-message">
    Please enable JavaScript for the best experience.
  </div>
</noscript>
```

## Testing Strategy

### Performance Testing

```typescript
// __tests__/performance/page-load.test.ts

describe('Page Load Performance', () => {
  it('should load home page within 2.5 seconds', async () => {
    const startTime = performance.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = performance.now() - startTime;
    
    expect(loadTime).toBeLessThan(2500);
  });
  
  it('should achieve LCP under 2.5s', async () => {
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries[entries.length - 1];
          resolve(lcp.renderTime || lcp.loadTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    expect(metrics).toBeLessThan(2500);
  });
});
```

### Bundle Size Testing

```bash
# scripts/test-bundle-size.sh

#!/bin/bash

# Build production bundle
npm run build

# Analyze bundle sizes
npx next-bundle-analyzer

# Check bundle size limits
MAX_BUNDLE_SIZE=200000 # 200KB

BUNDLE_SIZE=$(du -b .next/static/chunks/main-*.js | cut -f1)

if [ $BUNDLE_SIZE -gt $MAX_BUNDLE_SIZE ]; then
  echo "❌ Bundle size ($BUNDLE_SIZE bytes) exceeds limit ($MAX_BUNDLE_SIZE bytes)"
  exit 1
else
  echo "✅ Bundle size ($BUNDLE_SIZE bytes) within limit"
fi
```

### Lighthouse CI Integration

```yaml
# .github/workflows/lighthouse-ci.yml

name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run start &
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/programs
            http://localhost:3000/tools
            http://localhost:3000/shop
            http://localhost:3000/impact
          uploadArtifacts: true
          temporaryPublicStorage: true
```

## Implementation Phases

### Phase 1: Foundation (Week 1)
- Set up performance monitoring
- Implement caching layer
- Configure ISR for all pages
- Add image optimization

### Phase 2: Page Optimization (Week 2)
- Optimize Home page
- Optimize Programs page
- Optimize Tools page
- Implement code splitting

### Phase 3: Advanced Optimization (Week 3)
- Optimize Shop page
- Optimize Impact page
- Optimize Login page
- Implement prefetching

### Phase 4: Polish & Testing (Week 4)
- Add page transitions
- Implement service worker
- Performance testing
- Lighthouse optimization

## Performance Monitoring Dashboard (Admin Only)

**Location:** `/admin/performance`

**Purpose:** Centralized dashboard for viewing all performance metrics collected from public pages

```typescript
// app/(protected)/admin/performance/page.tsx

export default async function PerformanceDashboardPage() {
  const metrics = await getPerformanceMetrics();
  
  return (
    <div>
      <h1>Website Performance Dashboard</h1>
      <PerformanceOverview metrics={metrics} />
      <PagePerformanceTable pages={metrics.pages} />
      <CoreWebVitalsChart data={metrics.vitals} />
      <BundleSizeMonitor bundles={metrics.bundles} />
    </div>
  );
}

// components/admin/PerformanceDashboard.tsx

interface PerformanceDashboard {
  overview: {
    avgLCP: number;
    avgFCP: number;
    avgFID: number;
    avgCLS: number;
    totalPageViews: number;
    passingVitals: number; // percentage
  };
  pages: {
    name: string;
    url: string;
    avgLoadTime: number;
    p50LoadTime: number;
    p95LoadTime: number;
    lcp: number;
    fid: number;
    cls: number;
    sampleSize: number;
  }[];
  vitals: {
    date: string;
    lcp: number;
    fcp: number;
    fid: number;
    cls: number;
  }[];
  bundleSizes: {
    route: string;
    size: number;
    gzipSize: number;
    change: number; // percentage change from last build
  }[];
  cacheStats: {
    hitRate: number;
    size: number;
    entries: number;
  };
  alerts: {
    type: 'warning' | 'error';
    message: string;
    page: string;
    timestamp: Date;
  }[];
}

// API Endpoints (Admin Protected)

// GET /api/admin/performance/metrics
// Returns aggregated performance metrics

// GET /api/admin/performance/metrics/[page]
// Returns metrics for specific page

// POST /api/admin/performance/metrics
// Receives metrics from client-side tracking (public endpoint)

// GET /api/admin/performance/alerts
// Returns performance alerts and warnings
```

**Client-Side Tracking (All Pages):**
```typescript
// app/(public)/layout.tsx

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { reportWebVitals } from '@/lib/performance/monitoring';

export default function PublicLayout({ children }) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Track Web Vitals on all public pages
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onCLS((metric) => reportWebVitals('cls', metric.value, pathname));
        onFID((metric) => reportWebVitals('fid', metric.value, pathname));
        onFCP((metric) => reportWebVitals('fcp', metric.value, pathname));
        onLCP((metric) => reportWebVitals('lcp', metric.value, pathname));
        onTTFB((metric) => reportWebVitals('ttfb', metric.value, pathname));
      });
    }
  }, [pathname]);
  
  return <>{children}</>;
}
```

## Success Criteria

### Performance Targets Met
- ✅ FCP < 1.2s on all pages
- ✅ LCP < 2.5s on all pages
- ✅ CLS < 0.1 on all pages
- ✅ FID < 100ms on all pages
- ✅ Lighthouse score 90+ on all pages

### User Experience Improvements
- ✅ Smooth page transitions
- ✅ No layout shifts
- ✅ Fast perceived performance
- ✅ Responsive interactions
- ✅ Offline support (basic)

### Technical Achievements
- ✅ Bundle size < 200KB gzipped
- ✅ Code splitting implemented
- ✅ ISR configured
- ✅ Caching optimized
- ✅ Images optimized

## Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
