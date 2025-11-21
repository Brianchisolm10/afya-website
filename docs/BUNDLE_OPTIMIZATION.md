# Bundle Optimization Guide

This guide explains the bundle optimization strategies implemented in the AFYA website and how to maintain optimal bundle sizes.

## Overview

The website uses multiple strategies to minimize JavaScript bundle sizes:

1. **Route-based code splitting** - Separate bundles per route
2. **Lazy loading** - Load components only when needed
3. **Third-party script optimization** - Defer non-critical scripts
4. **Tree-shaking** - Remove unused code from bundles

## Bundle Size Targets

| Route | Target Size | Description |
|-------|-------------|-------------|
| `/` | 150 KB | Home page with hero and stats |
| `/programs` | 120 KB | Programs listing page |
| `/tools` | 100 KB | Tools page (per tool) |
| `/shop` | 150 KB | Shop with product grid |
| `/impact` | 120 KB | Impact page with stats |
| `/login` | 50 KB | Minimal login page |
| `/admin` | 200 KB | Admin dashboard |

## Code Splitting Strategy

### Route-Based Splitting

Each route has its own bundle configuration defined in `lib/performance/route-splitting.ts`:

```typescript
import { routeConfigs, preloadRouteComponents } from '@/lib/performance/route-splitting';

// Get configuration for current route
const config = getRouteConfig('/programs');

// Preload critical components
await preloadRouteComponents('/programs');
```

### Component-Level Splitting

Non-critical components are lazy loaded using dynamic imports:

```typescript
import { dynamicImport } from '@/lib/performance/code-splitting';

// Lazy load a component
const LazyComponent = dynamicImport(
  () => import('@/components/MyComponent'),
  { loading: LoadingSpinner, ssr: false }
);
```

### Pre-configured Dynamic Components

Use pre-configured dynamic components from `lib/dynamic-imports.tsx`:

```typescript
import {
  DynamicTestimonialCarousel,
  DynamicAnalyticsDashboard,
  DynamicProductEditor,
} from '@/lib/dynamic-imports';

// Use in your component
<DynamicTestimonialCarousel />
```

## Lazy Loading Strategy

### Loading Priorities

Components are categorized by loading priority:

- **CRITICAL** - Load immediately (above fold, essential)
- **HIGH** - Load on page load (visible soon)
- **MEDIUM** - Load on interaction or scroll
- **LOW** - Load when idle
- **DEFERRED** - Load only when explicitly needed

### Implementation

```typescript
import { shouldLazyLoad, getLoadingStrategy } from '@/lib/performance/lazy-loading-strategy';

// Check if component should be lazy loaded
if (shouldLazyLoad('TestimonialCarousel')) {
  const strategy = getLoadingStrategy('TestimonialCarousel');
  // strategy = 'visible' (load when scrolled into view)
}
```

### Lazy Loading Statistics

Get insights into lazy loading impact:

```typescript
import { calculateLazyLoadingStats } from '@/lib/performance/lazy-loading-strategy';

const stats = calculateLazyLoadingStats();
console.log(`Potential savings: ${stats.savingsPercentage}%`);
```

## Third-Party Scripts

### Script Loading Strategies

Third-party scripts are optimized using different loading strategies:

```typescript
import { OptimizedScript } from '@/components/performance/OptimizedScript';

// Load script with optimal strategy
<OptimizedScript
  src="https://example.com/script.js"
  strategy="afterInteractive"
  priority="low"
  loadOnInteraction={true}
/>
```

### Pre-configured Scripts

Use pre-configured script components:

```typescript
import { StripeScript, AnalyticsScript } from '@/components/performance/OptimizedScript';

// Stripe loads only on shop/checkout pages
<StripeScript onLoad={() => console.log('Stripe loaded')} />

// Analytics loads when idle
<AnalyticsScript />
```

### Script Performance Monitoring

Monitor third-party script impact:

```typescript
import { monitorScriptPerformance } from '@/lib/performance/third-party-scripts';

const performance = monitorScriptPerformance();
performance.forEach(script => {
  console.log(`${script.name}: ${script.loadTime}ms (${script.size} bytes)`);
});
```

## Tree-Shaking

### Package.json Configuration

The `package.json` includes `sideEffects` configuration:

```json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./app/globals.css",
    "./lib/monitoring/**/*",
    "./lib/db.ts"
  ]
}
```

This tells webpack which files have side effects and cannot be tree-shaken.

### Webpack Configuration

Tree-shaking is configured in `next.config.js`:

```javascript
webpack: (config, { isServer, dev }) => {
  if (!dev && !isServer) {
    config.optimization.usedExports = true;
    config.optimization.sideEffects = true;
    // ... additional optimizations
  }
  return config;
}
```

### Import Optimization

Use specific imports instead of barrel imports:

```typescript
// ❌ Bad - imports entire library
import { format, parse, addDays } from 'date-fns';

// ✅ Good - imports only what's needed
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import addDays from 'date-fns/addDays';
```

### Optimized Package Imports

The Next.js config includes `optimizePackageImports`:

```javascript
experimental: {
  optimizePackageImports: [
    '@prisma/client',
    'lucide-react',
    'date-fns',
    'zod',
  ],
}
```

## Bundle Analysis

### Analyze Bundle Size

Run bundle analysis:

```bash
# Analyze current bundle
npm run analyze:bundle

# Build with bundle analyzer
npm run analyze
```

### Check Bundle Size

After building, check the bundle sizes:

```bash
npm run build
```

Look for the "Route (pages)" section in the output to see bundle sizes per route.

### Identify Large Dependencies

Use the bundle analysis script to identify large dependencies:

```bash
npm run analyze:bundle
```

This will show:
- Potentially unused dependencies
- Import pattern recommendations
- Tree-shaking opportunities
- Bundle size targets vs actual

## Best Practices

### 1. Use Dynamic Imports for Large Components

```typescript
// ❌ Bad - loads immediately
import HeavyComponent from './HeavyComponent';

// ✅ Good - loads when needed
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false,
});
```

### 2. Lazy Load Below-the-Fold Content

```typescript
import { LazyLoadOnScroll } from '@/components/performance/LazyLoadOnScroll';

<LazyLoadOnScroll>
  <TestimonialCarousel />
</LazyLoadOnScroll>
```

### 3. Prefetch Critical Routes

```typescript
import { PrefetchLink } from '@/components/performance/PrefetchLink';

<PrefetchLink href="/programs">
  View Programs
</PrefetchLink>
```

### 4. Use Specific Imports

```typescript
// ❌ Bad
import * as Icons from 'lucide-react';

// ✅ Good
import { Menu, X, ChevronDown } from 'lucide-react';
```

### 5. Avoid Large Dependencies

Before adding a new dependency, consider:
- Bundle size impact
- Tree-shaking support
- Alternatives with smaller footprint
- Can you implement it yourself?

### 6. Monitor Bundle Size

Set up CI/CD checks for bundle size:

```bash
# In your CI pipeline
npm run build
# Check if bundle sizes exceed targets
```

## Troubleshooting

### Bundle Size Too Large

1. Run `npm run analyze:bundle` to identify issues
2. Check for:
   - Unused dependencies
   - Large components not lazy loaded
   - Inefficient imports
   - Duplicate code

### Component Not Loading

1. Check browser console for errors
2. Verify dynamic import path is correct
3. Ensure loading component is provided
4. Check network tab for failed requests

### Tree-Shaking Not Working

1. Verify `sideEffects` in package.json
2. Check webpack configuration
3. Use ES6 imports (not require)
4. Avoid dynamic imports in static code

## Monitoring

### Performance Metrics

Track bundle performance in the admin dashboard:

```
/admin/performance
```

This shows:
- Bundle sizes by route
- Load times
- Third-party script impact
- Optimization recommendations

### Real User Monitoring

Bundle size impacts are tracked through:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)

## Resources

- [Next.js Code Splitting](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Webpack Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
- [Web.dev Bundle Size](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

## Maintenance

### Regular Tasks

1. **Weekly**: Review bundle sizes after deployments
2. **Monthly**: Run bundle analysis and check for optimization opportunities
3. **Quarterly**: Audit dependencies for unused packages
4. **Before major releases**: Full bundle optimization review

### Checklist

- [ ] Bundle sizes within targets
- [ ] No unused dependencies
- [ ] Critical components not lazy loaded
- [ ] Non-critical components lazy loaded
- [ ] Third-party scripts optimized
- [ ] Tree-shaking enabled
- [ ] Import patterns optimized
- [ ] Performance metrics tracked
