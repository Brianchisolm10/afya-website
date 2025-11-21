/**
 * Image optimization utilities for AFYA Website
 * 
 * Provides helpers for:
 * - Generating responsive image sizes
 * - Image format conversion
 * - Lazy loading configuration
 */

/**
 * Generate responsive sizes attribute for Next.js Image component
 * 
 * @param breakpoints - Object with breakpoint sizes
 * @returns sizes string for Image component
 */
export function generateImageSizes(breakpoints: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  wide?: string;
}): string {
  const {
    mobile = '100vw',
    tablet = '50vw',
    desktop = '33vw',
    wide = '25vw',
  } = breakpoints;

  return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, (max-width: 1536px) ${desktop}, ${wide}`;
}

/**
 * Common image size configurations for different use cases
 */
export const IMAGE_SIZES = {
  // Product images in grid
  productCard: generateImageSizes({
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw',
    wide: '25vw',
  }),

  // Hero images
  hero: generateImageSizes({
    mobile: '100vw',
    tablet: '100vw',
    desktop: '100vw',
    wide: '100vw',
  }),

  // Thumbnail images
  thumbnail: generateImageSizes({
    mobile: '20vw',
    tablet: '15vw',
    desktop: '10vw',
    wide: '10vw',
  }),

  // Full width images
  fullWidth: '100vw',

  // Half width images
  halfWidth: generateImageSizes({
    mobile: '100vw',
    tablet: '50vw',
    desktop: '50vw',
    wide: '50vw',
  }),

  // Avatar/profile images
  avatar: generateImageSizes({
    mobile: '96px',
    tablet: '128px',
    desktop: '128px',
    wide: '128px',
  }),
};

/**
 * Get optimized image URL with transformations
 * For use with external image services or CDN
 * 
 * @param url - Original image URL
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  } = {}
): string {
  // If using a CDN or image service, add transformation parameters here
  // For now, return the original URL as Next.js handles optimization
  return url;
}

/**
 * Check if image should be loaded with priority
 * Priority images are loaded immediately (above the fold)
 * 
 * @param index - Image index in list
 * @param threshold - Number of images to prioritize
 * @returns Whether image should have priority loading
 */
export function shouldPrioritizeImage(index: number, threshold: number = 2): boolean {
  return index < threshold;
}

/**
 * Generate blur data URL for placeholder
 * Creates a tiny base64 encoded image for blur-up effect
 * 
 * @param width - Placeholder width
 * @param height - Placeholder height
 * @returns Base64 data URL
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  // Create a simple gray gradient as placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d1d5db;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
    </svg>
  `;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Preload critical images
 * Use in page components to preload above-the-fold images
 * 
 * @param urls - Array of image URLs to preload
 */
export function preloadImages(urls: string[]): void {
  if (typeof window === 'undefined') return;

  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Lazy load images using Intersection Observer
 * For custom image implementations outside of Next.js Image
 * 
 * @param selector - CSS selector for images to lazy load
 */
export function lazyLoadImages(selector: string = 'img[data-lazy]'): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const images = document.querySelectorAll(selector);

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.lazy;

        if (src) {
          img.src = src;
          img.removeAttribute('data-lazy');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}
