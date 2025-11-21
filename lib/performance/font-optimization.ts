/**
 * Font Optimization Utilities
 * 
 * Utilities for optimizing font loading to prevent CLS and improve performance
 * Implements font-display: swap, preloading, and font subsetting strategies
 */

/**
 * Font configuration for the application
 */
export interface FontConfig {
  family: string;
  weights: number[];
  styles: ('normal' | 'italic')[];
  display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload: boolean;
  subset?: string; // e.g., 'latin', 'latin-ext'
}

/**
 * Default font configurations
 */
export const fontConfigs: Record<string, FontConfig> = {
  primary: {
    family: 'Inter',
    weights: [400, 500, 600, 700],
    styles: ['normal'],
    display: 'swap',
    preload: true,
    subset: 'latin',
  },
  heading: {
    family: 'Inter',
    weights: [600, 700],
    styles: ['normal'],
    display: 'swap',
    preload: true,
    subset: 'latin',
  },
  mono: {
    family: 'JetBrains Mono',
    weights: [400, 500],
    styles: ['normal'],
    display: 'swap',
    preload: false,
    subset: 'latin',
  },
};

/**
 * Generate font-face CSS with optimizations
 */
export function generateFontFaceCSS(config: FontConfig): string {
  const fontFaces: string[] = [];
  
  for (const weight of config.weights) {
    for (const style of config.styles) {
      fontFaces.push(`
@font-face {
  font-family: '${config.family}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: ${config.display};
  src: local('${config.family}'),
       url('/fonts/${config.family.toLowerCase().replace(/\s+/g, '-')}-${weight}${style === 'italic' ? '-italic' : ''}.woff2') format('woff2'),
       url('/fonts/${config.family.toLowerCase().replace(/\s+/g, '-')}-${weight}${style === 'italic' ? '-italic' : ''}.woff') format('woff');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
      `.trim());
    }
  }
  
  return fontFaces.join('\n\n');
}

/**
 * Generate all font-face CSS for the application
 */
export function generateAllFontFaceCSS(): string {
  return Object.values(fontConfigs)
    .map(config => generateFontFaceCSS(config))
    .join('\n\n');
}

/**
 * Get preload links for critical fonts
 */
export function getPreloadFontLinks(): Array<{
  href: string;
  as: 'font';
  type: string;
  crossOrigin: 'anonymous';
}> {
  const preloadLinks: Array<{
    href: string;
    as: 'font';
    type: string;
    crossOrigin: 'anonymous';
  }> = [];
  
  for (const config of Object.values(fontConfigs)) {
    if (config.preload) {
      // Preload only the most critical weights
      const criticalWeights = config.weights.slice(0, 2); // First 2 weights
      
      for (const weight of criticalWeights) {
        const fontFileName = `${config.family.toLowerCase().replace(/\s+/g, '-')}-${weight}.woff2`;
        preloadLinks.push({
          href: `/fonts/${fontFileName}`,
          as: 'font',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        });
      }
    }
  }
  
  return preloadLinks;
}

/**
 * System font stack fallback
 * Provides good fallback fonts while custom fonts load
 */
export const systemFontStack = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(', ');

/**
 * Get font family with fallback
 */
export function getFontFamilyWithFallback(fontName: keyof typeof fontConfigs): string {
  const config = fontConfigs[fontName];
  return `'${config.family}', ${systemFontStack}`;
}

/**
 * Font loading strategy
 */
export class FontLoader {
  private loadedFonts: Set<string> = new Set();
  private loadingFonts: Map<string, Promise<void>> = new Map();
  
  /**
   * Load a font dynamically
   */
  async loadFont(fontName: keyof typeof fontConfigs): Promise<void> {
    const config = fontConfigs[fontName];
    const fontKey = `${config.family}-${config.weights.join('-')}`;
    
    // Already loaded
    if (this.loadedFonts.has(fontKey)) {
      return Promise.resolve();
    }
    
    // Currently loading
    if (this.loadingFonts.has(fontKey)) {
      return this.loadingFonts.get(fontKey)!;
    }
    
    // Start loading
    const loadPromise = this.loadFontFace(config);
    this.loadingFonts.set(fontKey, loadPromise);
    
    try {
      await loadPromise;
      this.loadedFonts.add(fontKey);
    } finally {
      this.loadingFonts.delete(fontKey);
    }
  }
  
  /**
   * Load font face using CSS Font Loading API
   */
  private async loadFontFace(config: FontConfig): Promise<void> {
    if (typeof window === 'undefined' || !('FontFace' in window)) {
      return;
    }
    
    const loadPromises: Promise<FontFace>[] = [];
    
    for (const weight of config.weights) {
      for (const style of config.styles) {
        const fontFileName = `${config.family.toLowerCase().replace(/\s+/g, '-')}-${weight}${style === 'italic' ? '-italic' : ''}.woff2`;
        const fontUrl = `/fonts/${fontFileName}`;
        
        const fontFace = new FontFace(
          config.family,
          `url(${fontUrl}) format('woff2')`,
          {
            weight: weight.toString(),
            style,
            display: config.display,
          }
        );
        
        loadPromises.push(fontFace.load());
      }
    }
    
    const loadedFaces = await Promise.all(loadPromises);
    loadedFaces.forEach(face => {
      (document.fonts as any).add(face);
    });
  }
  
  /**
   * Check if a font is loaded
   */
  isLoaded(fontName: keyof typeof fontConfigs): boolean {
    const config = fontConfigs[fontName];
    const fontKey = `${config.family}-${config.weights.join('-')}`;
    return this.loadedFonts.has(fontKey);
  }
  
  /**
   * Preload all critical fonts
   */
  async preloadCriticalFonts(): Promise<void> {
    const criticalFonts = Object.entries(fontConfigs)
      .filter(([_, config]) => config.preload)
      .map(([name]) => name as keyof typeof fontConfigs);
    
    await Promise.all(criticalFonts.map(font => this.loadFont(font)));
  }
}

// Global font loader instance
export const fontLoader = new FontLoader();

/**
 * Font metrics for size-adjust to prevent CLS
 * These values help match fallback font metrics to custom fonts
 */
export const fontMetrics: Record<string, {
  ascentOverride: string;
  descentOverride: string;
  lineGapOverride: string;
  sizeAdjust: string;
}> = {
  Inter: {
    ascentOverride: '90%',
    descentOverride: '22%',
    lineGapOverride: '0%',
    sizeAdjust: '107%',
  },
  'JetBrains Mono': {
    ascentOverride: '85%',
    descentOverride: '20%',
    lineGapOverride: '0%',
    sizeAdjust: '100%',
  },
};

/**
 * Generate fallback font CSS with size-adjust
 */
export function generateFallbackFontCSS(): string {
  return `
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  ascent-override: ${fontMetrics.Inter.ascentOverride};
  descent-override: ${fontMetrics.Inter.descentOverride};
  line-gap-override: ${fontMetrics.Inter.lineGapOverride};
  size-adjust: ${fontMetrics.Inter.sizeAdjust};
}
  `.trim();
}

/**
 * Get optimized font CSS for inlining
 */
export function getOptimizedFontCSS(): string {
  const fontFaceCSS = generateAllFontFaceCSS();
  const fallbackCSS = generateFallbackFontCSS();
  
  return `
${fontFaceCSS}

${fallbackCSS}
  `.trim();
}
