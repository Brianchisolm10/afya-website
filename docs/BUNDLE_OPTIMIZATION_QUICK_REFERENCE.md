# Bundle Optimization Quick Reference

Quick reference for maintaining optimal bundle sizes in the AFYA website.

## Quick Commands

```bash
# Build and check bundle sizes
npm run build

# Analyze bundle
npm run analyze:bundle

# Build with bundle analyzer
npm run analyze
```

## Bundle Size Targets

| Route | Target | Status |
|-------|--------|--------|
| `/` | 150 KB | 🎯 |
| `/programs` | 120 KB | 🎯 |
| `/tools` | 100 KB | 🎯 |
| `/shop` | 150 KB | 🎯 |
| `/impact` | 120 KB | 🎯 |
| `/login` | 50 KB | 🎯 |
| `/admin` | 200 KB | 🎯 |

## Quick Patterns

### 1. Lazy Load a Component

```typescript
import dynamic from 'next/dynamic';

const LazyComponent = dynamic(() => import('./Component'), {
  loading: () => <Spinner />,
  ssr: false,
});
```

### 2. Use Pre-configured Dynamic Component

```typescript
import { DynamicTestimonialCarousel } from '@/lib/dynamic-imports';

<DynamicTestimonialCarousel />
```

### 3. Optimize Third-Party Script

```typescript
import { OptimizedScript } from '@/components/performance/OptimizedScript';

<OptimizedScript
  src="https://example.com/script.js"
  strategy="afterInteractive"
  priority="low"
  loadOnInteraction={true}
/>
```

### 4. Check if Component Should Be Lazy Loaded

```typescript
import { shouldLazyLoad } from '@/lib/performance/lazy-loading-strategy';

if (shouldLazyLoad('ComponentName')) {
  // Use dynamic import
}
```

### 5. Optimize Package Imports

```typescript
// ❌ Bad
import { format, parse } from 'date-fns';

// ✅ Good
import format from 'date-fns/format';
import parse from 'date-fns/parse';
```

## Common Issues

### Bundle Too Large

1. Run `npm run analyze:bundle`
2. Check for unused dependencies
3. Verify lazy loading is applied
4. Review import patterns

### Component Not Loading

1. Check browser console
2. Verify import path
3. Add loading component
4. Check network tab

### Tree-Shaking Not Working

1. Use ES6 imports
2. Check `sideEffects` in package.json
3. Avoid dynamic imports in static code
4. Use specific imports

## Checklist for New Components

- [ ] Is it above the fold? → Load immediately
- [ ] Is it below the fold? → Lazy load
- [ ] Is it a modal/dialog? → Lazy load on interaction
- [ ] Is it an admin component? → Lazy load
- [ ] Is it a tool? → Lazy load
- [ ] Does it use third-party scripts? → Optimize loading

## Checklist for New Dependencies

- [ ] Check bundle size impact
- [ ] Verify tree-shaking support
- [ ] Use specific imports
- [ ] Add to `optimizePackageImports` if needed
- [ ] Document in bundle analysis

## Performance Monitoring

Check `/admin/performance` for:
- Bundle sizes by route
- Third-party script impact
- Optimization recommendations
- Performance metrics

## Resources

- [Full Guide](./BUNDLE_OPTIMIZATION.md)
- [Code Splitting Docs](./CODE_SPLITTING.md)
- [Next.js Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
