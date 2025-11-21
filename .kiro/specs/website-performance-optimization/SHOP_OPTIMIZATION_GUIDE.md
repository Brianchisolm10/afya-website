# Shop Page Optimization Guide

## Quick Reference

### ISR Configuration
```typescript
// app/(public)/shop/page.tsx
export const revalidate = 300; // 5 minutes
export const dynamic = 'force-static';
```

### Cache Invalidation
```typescript
// Admin action after product update
await fetch('/api/admin/products/invalidate-cache', {
  method: 'POST',
  body: JSON.stringify({ 
    productId: 'xxx',
    category: 'APPAREL' 
  })
});
```

### Progressive Image Loading
```typescript
import { 
  generateProductBlurDataURL, 
  getProductImageSizes, 
  getProductImageQuality 
} from '@/lib/shop/image-utils';

<OptimizedImage
  src={image}
  alt={name}
  sizes={getProductImageSizes()}
  quality={getProductImageQuality()}
  blurDataURL={generateProductBlurDataURL()}
  priority={index < 4} // First 4 products
  lazyLoad={index >= 4}
/>
```

### Infinite Scroll Setup
```typescript
import { createOptimizedObserver } from '@/lib/shop/scroll-utils';

const observer = createOptimizedObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      loadMoreProducts();
    }
  },
  { rootMargin: '200px' }
);
```

### Virtual Scrolling (Optional)
```typescript
import { useVirtualGrid } from '@/lib/shop/useVirtualScroll';

const { virtualItems, offsetY } = useVirtualGrid(
  products,
  400, // row height
  4,   // columns
  2    // overscan
);
```

## Performance Checklist

### Initial Load
- [x] ISR enabled (5-minute revalidation)
- [x] Server-side data fetching
- [x] Initial 12 products loaded
- [x] Cache headers configured

### Images
- [x] Blur placeholders for all products
- [x] Priority loading for first 4 products
- [x] Lazy loading for below-the-fold
- [x] Responsive image sizes
- [x] Quality optimization (85%)

### Scrolling
- [x] Intersection Observer for infinite scroll
- [x] 200px preload margin
- [x] Passive event listeners
- [x] 60fps scroll performance
- [x] Scroll position persistence

### Caching
- [x] 5-minute ISR revalidation
- [x] Stale-while-revalidate (10 min)
- [x] Cache invalidation API
- [x] Pattern-based cache clearing

## Monitoring

### Key Metrics
- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **TTI**: < 3.5s
- **Scroll FPS**: 60fps

### Performance Tracking
```typescript
// Built into ShopPageClient
const startTime = performance.now();
// ... load products
const loadTime = performance.now() - startTime;
if (loadTime > 1000) {
  console.warn(`Slow product load: ${loadTime}ms`);
}
```

## Troubleshooting

### Slow Initial Load
1. Check ISR is enabled (`revalidate = 300`)
2. Verify database query optimization
3. Check image sizes and formats
4. Monitor server response time

### Images Not Loading
1. Verify image URLs are valid
2. Check blur placeholder generation
3. Ensure OptimizedImage component is used
4. Check browser console for errors

### Infinite Scroll Not Working
1. Verify Intersection Observer is created
2. Check `hasMore` state is correct
3. Ensure `loadMoreRef` is attached
4. Check API pagination parameters

### Cache Not Invalidating
1. Verify admin authentication
2. Check cache key patterns
3. Ensure revalidatePath is called
4. Monitor cache invalidation logs

## Best Practices

### Image Optimization
- Use WebP/AVIF formats when possible
- Compress images before upload
- Use appropriate quality settings
- Implement responsive sizes
- Add blur placeholders

### Scroll Performance
- Use passive event listeners
- Throttle scroll events with RAF
- Implement virtual scrolling for 100+ items
- Preload next page before user reaches bottom
- Save/restore scroll position

### Caching Strategy
- Use ISR for static content
- Implement stale-while-revalidate
- Invalidate cache on data updates
- Monitor cache hit rates
- Set appropriate TTLs

### Code Splitting
- Lazy load below-the-fold components
- Use dynamic imports for heavy components
- Implement Suspense boundaries
- Monitor bundle sizes

## Resources

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Web Vitals](https://web.dev/vitals/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
