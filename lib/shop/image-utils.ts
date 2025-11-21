/**
 * Shop-specific image utilities for progressive loading
 * Implements blur placeholder generation for product images (Requirement 4.2)
 */

/**
 * Generate a blur data URL for product images
 * Creates a lightweight SVG placeholder with gradient
 */
export function generateProductBlurDataURL(width = 400, height = 400): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Generate optimized image sizes for product images
 * Returns responsive sizes string for Next.js Image component
 */
export function getProductImageSizes(): string {
  return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
}

/**
 * Get optimized quality setting based on image type
 */
export function getProductImageQuality(isHero: boolean = false): number {
  return isHero ? 90 : 85;
}

/**
 * Determine if image should be priority loaded
 * First 4 products should be priority (above the fold)
 */
export function shouldPrioritizeImage(index: number): boolean {
  return index < 4;
}

/**
 * Generate srcset for responsive product images
 */
export function generateProductSrcSet(baseUrl: string): string {
  const widths = [320, 640, 768, 1024, 1280];
  return widths
    .map(width => `${baseUrl}?w=${width} ${width}w`)
    .join(', ');
}
