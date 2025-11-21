/**
 * Critical CSS Extraction and Inlining
 * 
 * Extracts and inlines critical CSS for above-the-fold content
 * to improve First Contentful Paint (FCP) and Largest Contentful Paint (LCP)
 */

/**
 * Critical CSS for above-the-fold content
 * This includes essential styles for layout, typography, and core components
 * Target: Keep under 14KB
 */
export const criticalCSS = `
/* CSS Variables - Essential for theming */
:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
  --text-base: 1rem;
  --leading-normal: 1.5;
  --space-4: 1rem;
  --transition-base: 200ms;
}

/* Base Reset - Critical for layout stability */
*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb;
}

html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  line-height: inherit;
  color: rgb(31 41 55);
  background-color: rgb(255 255 255);
  overflow-x: hidden;
}

/* Typography - Above the fold */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  color: rgb(17 24 39);
  line-height: 1.25;
  margin-bottom: var(--space-4);
  word-wrap: break-word;
  overflow-wrap: break-word;
}

h1 {
  font-size: 2.25rem;
  line-height: 1.25;
}

@media (min-width: 768px) {
  h1 {
    font-size: 3rem;
  }
}

p {
  font-size: var(--text-base);
  line-height: 1.625;
  margin-bottom: var(--space-4);
}

/* Layout - Critical for preventing CLS */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

/* Navigation - Above the fold */
nav {
  position: relative;
  z-index: 50;
}

/* Button - Critical interactive element */
button {
  font-family: inherit;
  font-size: 100%;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  margin: 0;
  padding: 0;
  background-color: transparent;
  background-image: none;
  cursor: pointer;
}

/* Links - Critical for navigation */
a {
  color: inherit;
  text-decoration: inherit;
  transition: color var(--transition-base) ease;
}

/* Focus visible - Accessibility */
*:focus-visible {
  outline: 2px solid rgb(0 206 209);
  outline-offset: 2px;
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Utility classes - Most commonly used above fold */
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.grid { display: grid; }
.hidden { display: none; }
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.sticky { position: sticky; }

.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }

.w-full { width: 100%; }
.h-full { height: 100%; }
.min-h-screen { min-height: 100vh; }

.mx-auto { margin-left: auto; margin-right: auto; }
.my-8 { margin-top: 2rem; margin-bottom: 2rem; }
.mt-4 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1rem; }

.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }

.text-center { text-align: center; }
.text-white { color: rgb(255 255 255); }
.text-gray-600 { color: rgb(75 85 99); }
.text-gray-800 { color: rgb(31 41 55); }
.text-gray-900 { color: rgb(17 24 39); }

.bg-white { background-color: rgb(255 255 255); }
.bg-gray-50 { background-color: rgb(249 250 251); }
.bg-gray-100 { background-color: rgb(243 244 246); }

.rounded { border-radius: 0.25rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }

.shadow { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }

.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-medium { font-weight: 500; }

.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }

.transition { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }

/* AFYA Brand Colors - Critical */
.bg-afya-primary { background-color: rgb(0 206 209); }
.text-afya-primary { color: rgb(0 206 209); }
.bg-afya-secondary { background-color: rgb(255 20 147); }
.text-afya-secondary { color: rgb(255 20 147); }

/* Prevent layout shift */
img, video {
  max-width: 100%;
  height: auto;
  display: block;
}
`;

/**
 * Get critical CSS as a string for inlining
 */
export function getCriticalCSS(): string {
  return criticalCSS.trim();
}

/**
 * Get critical CSS size in bytes
 */
export function getCriticalCSSSize(): number {
  return new Blob([criticalCSS]).size;
}

/**
 * Check if critical CSS is under the 14KB limit
 */
export function isCriticalCSSUnderLimit(): boolean {
  const sizeInBytes = getCriticalCSSSize();
  const sizeInKB = sizeInBytes / 1024;
  return sizeInKB < 14;
}

/**
 * Get critical CSS stats
 */
export function getCriticalCSSStats() {
  const sizeInBytes = getCriticalCSSSize();
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);
  const isUnderLimit = isCriticalCSSUnderLimit();
  
  return {
    sizeInBytes,
    sizeInKB: parseFloat(sizeInKB),
    limit: 14,
    isUnderLimit,
    percentage: ((parseFloat(sizeInKB) / 14) * 100).toFixed(1),
  };
}
