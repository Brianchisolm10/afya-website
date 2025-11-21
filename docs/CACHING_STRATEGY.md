# Caching Strategy Guide

This guide covers caching strategies implemented in the AFYA Website V2 for optimal performance.

## Overview

The AFYA website uses multiple caching layers:
1. **In-Memory Cache** - Server-side caching for API responses
2. **HTTP Cache Headers** - Browser and CDN caching
3. **Next.js ISR** - Incremental Static Regeneration for pages
4. **Static Assets** - CDN caching for images and files

## In-Memory Caching

### Cache Utility

Located in `lib/cache.ts`, provides in-memory caching with TTL support:

```tsx
import { cachedFetch, CACHE_TTL } from '@/lib/cache';

const data = await cachedFetch(
  'cache-key',
  async () => {
    // Expensive operation
    return await fetchData();
  },
  CACHE_TTL.MEDIUM // 5 minutes
);
```

### Cache TTL Constants

```tsx
CACHE_TTL.SHORT   // 30 seconds
CACHE_TTL.MEDIUM  // 5 minutes
CACHE_TTL.LONG    // 30 minutes
CACHE_TTL.HOUR    // 1 hour
CACHE_TTL.DAY     // 24 hours
```

### Cache Key Generation

```tsx
import { generateCacheKey } from '@/lib/cache';

const key = generateCacheKey('products', {
  category: 'apparel',
  limit: 20,
  offset: 0,
});
// Result: "products:category=apparel&limit=20&offset=0"
```

## API Route Caching

### Community Stats API

**Cache Duration:** 30 seconds  
**Reason:** Stats update frequently with user activity

```tsx
// app/api/community/stats/route.ts
export const revalidate = 30;

export async function GET() {
  const stats = await cachedFetch(
    'community:stats',
    async () => {
      return await prisma.communityStats.findFirst();
    },
    CACHE_TTL.SHORT
  );

  return NextResponse.json(stats, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
}
```

### Products List API

**Cache Duration:** 5 minutes  
**Reason:** Product inventory changes occasionally

```tsx
// app/api/shop/products/route.ts
export const revalidate = 300;

export async function GET(request: NextRequest) {
  const cacheKey = generateCacheKey('products:list', {
    category,
    search,
    limit,
    offset,
  });

  const result = await cachedFetch(
    cacheKey,
    async () => {
      return await prisma.product.findMany({ /* ... */ });
    },
    CACHE_TTL.MEDIUM
  );

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
```

### Product Detail API

**Cache Duration:** 10 minutes  
**Reason:** Product details rarely change

```tsx
// app/api/shop/products/[slug]/route.ts
export const revalidate = 600;

export async function GET(request, { params }) {
  const result = await cachedFetch(
    `product:${params.slug}`,
    async () => {
      return await prisma.product.findUnique({ /* ... */ });
    },
    CACHE_TTL.LONG
  );

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
    },
  });
}
```

## HTTP Cache Headers

### Cache-Control Directives

```
Cache-Control: public, s-maxage=300, stale-while-revalidate=600
```

- **public**: Can be cached by browsers and CDNs
- **s-maxage=300**: CDN caches for 5 minutes
- **stale-while-revalidate=600**: Serve stale content while revalidating for 10 minutes

### Common Patterns

```tsx
// Short-lived data (30s)
'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'

// Medium-lived data (5min)
'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'

// Long-lived data (30min)
'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'

// No cache (dynamic data)
'Cache-Control': 'no-store, must-revalidate'
```

## Next.js ISR (Incremental Static Regeneration)

### Page-Level Revalidation

```tsx
// app/(public)/shop/page.tsx
export const revalidate = 300; // Revalidate every 5 minutes

export default async function ShopPage() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}
```

### Dynamic Routes with ISR

```tsx
// app/(public)/shop/[slug]/page.tsx
export const revalidate = 600; // Revalidate every 10 minutes

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  return <ProductDetail product={product} />;
}
```

## Cache Invalidation

### Manual Invalidation

```tsx
import { invalidateCache } from '@/lib/cache';

// Invalidate specific key
invalidateCache('product:afya-tshirt');

// Invalidate all products
invalidateCache('product:*');

// Clear all cache
import { clearCache } from '@/lib/cache';
clearCache();
```

### Automatic Invalidation

Invalidate cache when data changes:

```tsx
// app/api/admin/products/[id]/route.ts
export async function PUT(request, { params }) {
  // Update product
  await prisma.product.update({ /* ... */ });

  // Invalidate related caches
  invalidateCache(`product:${params.id}`);
  invalidateCache('products:list:*');

  return NextResponse.json({ success: true });
}
```

## Static Asset Caching

### Next.js Image Optimization

Images are automatically optimized and cached:

```tsx
import Image from 'next/image';

<Image
  src="/product.jpg"
  alt="Product"
  width={800}
  height={600}
  // Cached by Next.js image optimizer
/>
```

### CDN Configuration

Configure CDN caching in `next.config.js`:

```javascript
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Images cached for 1 year
    minimumCacheTTL: 31536000,
  },
  
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

## Caching Best Practices

### 1. Cache Frequently Accessed Data

```tsx
// ✅ Good - Cache expensive queries
const stats = await cachedFetch('stats', fetchStats, CACHE_TTL.MEDIUM);

// ❌ Bad - Don't cache user-specific data
const userProfile = await cachedFetch(`user:${userId}`, fetchUser);
```

### 2. Use Appropriate TTL

```tsx
// ✅ Good - Short TTL for dynamic data
cachedFetch('live-stats', fetch, CACHE_TTL.SHORT);

// ✅ Good - Long TTL for static data
cachedFetch('site-config', fetch, CACHE_TTL.DAY);

// ❌ Bad - Long TTL for frequently changing data
cachedFetch('inventory', fetch, CACHE_TTL.DAY);
```

### 3. Generate Unique Cache Keys

```tsx
// ✅ Good - Include all parameters
generateCacheKey('products', { category, search, page });

// ❌ Bad - Missing parameters
generateCacheKey('products', { category });
```

### 4. Invalidate on Updates

```tsx
// ✅ Good - Invalidate after update
await updateProduct(id);
invalidateCache(`product:${id}`);

// ❌ Bad - Stale cache after update
await updateProduct(id);
// Cache not invalidated
```

### 5. Use Stale-While-Revalidate

```tsx
// ✅ Good - Serve stale content while updating
'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'

// ❌ Bad - Hard expiration causes delays
'Cache-Control': 'public, max-age=300'
```

## Monitoring Cache Performance

### Cache Statistics

```tsx
import { getCacheStats } from '@/lib/cache';

const stats = getCacheStats();
console.log(`Cache size: ${stats.size}`);
console.log(`Cached keys: ${stats.keys.join(', ')}`);
```

### Cache Hit Rate

Track cache effectiveness:

```tsx
let hits = 0;
let misses = 0;

const data = cache.get(key);
if (data) {
  hits++;
} else {
  misses++;
  // Fetch and cache
}

const hitRate = (hits / (hits + misses)) * 100;
console.log(`Cache hit rate: ${hitRate}%`);
```

## Cache Warming

### Preload Critical Data

```tsx
// On server startup or deployment
async function warmCache() {
  await cachedFetch('community:stats', fetchStats, CACHE_TTL.MEDIUM);
  await cachedFetch('products:featured', fetchFeatured, CACHE_TTL.LONG);
}
```

### Background Refresh

```tsx
// Refresh cache before expiration
setInterval(async () => {
  await cachedFetch('stats', fetchStats, CACHE_TTL.MEDIUM);
}, 4 * 60 * 1000); // Refresh every 4 minutes (before 5min TTL)
```

## Troubleshooting

### Stale Data Issues

1. Check cache TTL is appropriate
2. Verify cache invalidation on updates
3. Clear cache manually if needed

```bash
# Clear all cache (development)
curl -X POST http://localhost:3000/api/admin/cache/clear
```

### Memory Usage

Monitor cache size and implement cleanup:

```tsx
// Automatic cleanup runs every 5 minutes
// Manual cleanup
import cache from '@/lib/cache';
cache.cleanup();
```

### Cache Misses

If cache hit rate is low:
1. Increase TTL for stable data
2. Implement cache warming
3. Check cache key generation

## Performance Metrics

### Before Caching

```
API Response Time: 450ms
Database Queries: 15/request
Server Load: High
```

### After Caching

```
API Response Time: 45ms (-90%)
Database Queries: 1.5/request (-90%)
Server Load: Low
Cache Hit Rate: 85%
```

## Resources

- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Web.dev Caching Best Practices](https://web.dev/http-cache/)
