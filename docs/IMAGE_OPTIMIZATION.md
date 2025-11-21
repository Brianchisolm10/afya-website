# Image Optimization Guide

This guide covers image optimization strategies implemented in the AFYA Website V2.

## Overview

The AFYA website uses Next.js Image component with automatic optimization for:
- WebP and AVIF format conversion
- Responsive image sizing
- Lazy loading
- Blur-up placeholders

## Components

### OptimizedImage Component

Use the `OptimizedImage` component for all images in the application:

```tsx
import { OptimizedImage } from '@/components/ui';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={false} // Set to true for above-the-fold images
/>
```

### Features

1. **Automatic Format Conversion**: Images are automatically converted to WebP/AVIF
2. **Lazy Loading**: Images load only when they enter the viewport
3. **Loading States**: Shows skeleton loader while image loads
4. **Error Handling**: Displays fallback image on error
5. **Responsive Sizing**: Serves appropriate image size based on device

## Best Practices

### 1. Use Appropriate Sizes

```tsx
import { IMAGE_SIZES } from '@/lib/image-utils';

// Product card images
<OptimizedImage
  src={product.image}
  alt={product.name}
  fill
  sizes={IMAGE_SIZES.productCard}
/>

// Hero images
<OptimizedImage
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes={IMAGE_SIZES.hero}
  priority // Load immediately
/>
```

### 2. Prioritize Above-the-Fold Images

Set `priority={true}` for images visible on initial page load:

```tsx
<OptimizedImage
  src="/hero-image.jpg"
  alt="Hero"
  priority={true} // Loads immediately, no lazy loading
  fill
/>
```

### 3. Provide Proper Alt Text

Always include descriptive alt text for accessibility:

```tsx
<OptimizedImage
  src="/product.jpg"
  alt="AFYA Performance T-Shirt in turquoise, front view"
  width={400}
  height={400}
/>
```

### 4. Use Appropriate Dimensions

Specify width and height to prevent layout shift:

```tsx
<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  // Or use fill for responsive containers
  // fill
  // className="object-cover"
/>
```

## Image Formats

### Supported Formats

The application automatically serves images in the best format:

1. **AVIF** (best compression, modern browsers)
2. **WebP** (good compression, wide support)
3. **JPEG/PNG** (fallback for older browsers)

### Source Image Guidelines

- **Format**: Upload JPEG or PNG
- **Size**: Maximum 2MB per image
- **Dimensions**: At least 2x the display size for retina displays
- **Optimization**: Pre-optimize images before upload using tools like:
  - [TinyPNG](https://tinypng.com/)
  - [Squoosh](https://squoosh.app/)
  - [ImageOptim](https://imageoptim.com/)

## Responsive Images

### Using the sizes Attribute

The `sizes` attribute tells the browser which image size to load:

```tsx
<OptimizedImage
  src="/image.jpg"
  alt="Description"
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

This means:
- Mobile (≤640px): Use 100% of viewport width
- Tablet (≤1024px): Use 50% of viewport width
- Desktop (>1024px): Use 33% of viewport width

### Predefined Size Configurations

Use predefined configurations from `lib/image-utils.ts`:

```tsx
import { IMAGE_SIZES } from '@/lib/image-utils';

// Product cards in grid
sizes={IMAGE_SIZES.productCard}

// Hero images
sizes={IMAGE_SIZES.hero}

// Thumbnails
sizes={IMAGE_SIZES.thumbnail}

// Full width
sizes={IMAGE_SIZES.fullWidth}
```

## Performance Tips

### 1. Lazy Load Below-the-Fold Images

By default, images are lazy loaded. Only set `priority={true}` for critical images:

```tsx
// Above the fold - load immediately
<OptimizedImage src="/hero.jpg" alt="Hero" priority />

// Below the fold - lazy load (default)
<OptimizedImage src="/product.jpg" alt="Product" />
```

### 2. Use Blur Placeholders

Add blur placeholders for better perceived performance:

```tsx
import { generateBlurDataURL } from '@/lib/image-utils';

<OptimizedImage
  src="/image.jpg"
  alt="Description"
  placeholder="blur"
  blurDataURL={generateBlurDataURL()}
  width={800}
  height={600}
/>
```

### 3. Preload Critical Images

For critical images, use preloading:

```tsx
import { preloadImages } from '@/lib/image-utils';

// In component or page
useEffect(() => {
  preloadImages(['/hero.jpg', '/logo.png']);
}, []);
```

### 4. Optimize Image Dimensions

Serve images at the correct size:

```tsx
// Bad - serving 4000x3000 image for 400x300 display
<OptimizedImage src="/huge-image.jpg" width={400} height={300} />

// Good - image is appropriately sized
<OptimizedImage src="/optimized-image.jpg" width={400} height={300} />
```

## Product Images

### Product Card Images

```tsx
<OptimizedImage
  src={product.images[0]}
  alt={`${product.name} - ${product.category}`}
  fill
  sizes={IMAGE_SIZES.productCard}
  className="object-cover"
/>
```

### Product Detail Images

```tsx
<OptimizedImage
  src={selectedImage}
  alt={`${product.name} - View ${currentIndex + 1}`}
  fill
  sizes={IMAGE_SIZES.halfWidth}
  priority={currentIndex === 0}
  className="object-contain"
/>
```

## Testing

### Performance Testing

Test image loading performance:

```bash
# Run Lighthouse audit
npm run build
npm start
# Open Chrome DevTools > Lighthouse > Run audit
```

### Check Image Formats

Verify WebP/AVIF delivery:

1. Open Chrome DevTools > Network tab
2. Filter by "Img"
3. Check "Type" column for webp/avif

### Measure Layout Shift

Check for Cumulative Layout Shift (CLS):

1. Open Chrome DevTools > Performance
2. Record page load
3. Check for layout shifts in timeline

## Troubleshooting

### Images Not Loading

1. Check image path is correct
2. Verify image exists in `public/` folder
3. Check Next.js Image configuration in `next.config.js`
4. Ensure remote domains are configured (if using external images)

### Slow Image Loading

1. Reduce source image file size
2. Use appropriate image dimensions
3. Enable priority loading for above-the-fold images
4. Check network throttling in DevTools

### Layout Shift Issues

1. Always specify width and height
2. Use `fill` with proper container sizing
3. Add `aspect-ratio` CSS to containers
4. Use blur placeholders

## Configuration

### next.config.js

Current image optimization configuration:

```javascript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

### Adding Remote Image Domains

To use images from external sources:

```javascript
images: {
  domains: ['example.com', 'cdn.example.com'],
  // Or use remotePatterns for more control
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.example.com',
    },
  ],
}
```

## Resources

- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [MDN Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
