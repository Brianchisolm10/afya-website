/**
 * Image optimization utilities
 * 
 * Provides utilities for generating blur placeholders and optimizing images
 */

/**
 * Generate a simple blur data URL for placeholder
 * This creates a tiny 10x10 pixel base64 encoded image
 */
export function generateBlurDataURL(color: string = '#e5e7eb'): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
      <rect width="10" height="10" fill="${color}"/>
    </svg>
  `;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate a gradient blur placeholder
 */
export function generateGradientBlurDataURL(
  color1: string = '#e5e7eb',
  color2: string = '#d1d5db'
): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="10" height="10" fill="url(#grad)"/>
    </svg>
  `;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get responsive image sizes string based on breakpoints
 */
export function getResponsiveSizes(config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  default?: string;
}): string {
  const sizes: string[] = [];

  if (config.mobile) {
    sizes.push(`(max-width: 640px) ${config.mobile}`);
  }
  if (config.tablet) {
    sizes.push(`(max-width: 1024px) ${config.tablet}`);
  }
  if (config.desktop) {
    sizes.push(`(max-width: 1536px) ${config.desktop}`);
  }
  if (config.default) {
    sizes.push(config.default);
  }

  return sizes.join(', ');
}

/**
 * Common responsive size configurations
 */
export const RESPONSIVE_SIZES = {
  FULL_WIDTH: getResponsiveSizes({
    mobile: '100vw',
    tablet: '100vw',
    desktop: '100vw',
    default: '100vw',
  }),
  HALF_WIDTH: getResponsiveSizes({
    mobile: '100vw',
    tablet: '50vw',
    desktop: '50vw',
    default: '50vw',
  }),
  THIRD_WIDTH: getResponsiveSizes({
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw',
    default: '33vw',
  }),
  QUARTER_WIDTH: getResponsiveSizes({
    mobile: '100vw',
    tablet: '50vw',
    desktop: '25vw',
    default: '25vw',
  }),
  HERO: getResponsiveSizes({
    mobile: '100vw',
    tablet: '100vw',
    desktop: '1920px',
    default: '1920px',
  }),
  CARD: getResponsiveSizes({
    mobile: '100vw',
    tablet: '50vw',
    desktop: '400px',
    default: '400px',
  }),
  THUMBNAIL: getResponsiveSizes({
    mobile: '150px',
    tablet: '200px',
    desktop: '250px',
    default: '250px',
  }),
};

/**
 * Image quality presets
 */
export const IMAGE_QUALITY = {
  LOW: 50,
  MEDIUM: 75,
  HIGH: 90,
  MAX: 100,
};

/**
 * Check if image format is supported
 */
export function isFormatSupported(format: string): boolean {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL(`image/${format}`).indexOf(`data:image/${format}`) === 0;
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalFormat(): 'avif' | 'webp' | 'jpeg' {
  if (typeof window === 'undefined') return 'jpeg';

  if (isFormatSupported('avif')) return 'avif';
  if (isFormatSupported('webp')) return 'webp';
  return 'jpeg';
}

/**
 * Preload an image
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export async function preloadImages(sources: string[]): Promise<void> {
  await Promise.all(sources.map(preloadImage));
}

/**
 * Get image dimensions from URL
 */
export function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = src;
  });
}
