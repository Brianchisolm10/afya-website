/**
 * CSS Loading Utilities
 * 
 * Utilities for deferring non-critical CSS and implementing CSS code splitting
 * to optimize CSS bundle size and improve page load performance
 */

/**
 * Load CSS asynchronously
 * This prevents CSS from blocking page render
 */
export function loadCSSAsync(href: string, media: string = 'all'): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print'; // Load as print stylesheet initially (non-blocking)
  
  // Once loaded, switch to the correct media type
  link.onload = function() {
    link.media = media;
  };
  
  document.head.appendChild(link);
}

/**
 * Preload CSS for faster loading when needed
 */
export function preloadCSS(href: string): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  
  document.head.appendChild(link);
}

/**
 * Load CSS with priority
 * High priority CSS loads immediately, low priority defers
 */
export function loadCSSWithPriority(
  href: string,
  priority: 'high' | 'low' = 'low'
): void {
  if (priority === 'high') {
    // Load immediately
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  } else {
    // Defer loading
    loadCSSAsync(href);
  }
}

/**
 * CSS Module Loader
 * Dynamically loads CSS modules for code splitting
 */
export class CSSModuleLoader {
  private loadedModules: Set<string> = new Set();
  private loadingModules: Map<string, Promise<void>> = new Map();
  
  /**
   * Load a CSS module
   */
  async loadModule(moduleName: string, href: string): Promise<void> {
    // Already loaded
    if (this.loadedModules.has(moduleName)) {
      return Promise.resolve();
    }
    
    // Currently loading
    if (this.loadingModules.has(moduleName)) {
      return this.loadingModules.get(moduleName)!;
    }
    
    // Start loading
    const loadPromise = new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      
      link.onload = () => {
        this.loadedModules.add(moduleName);
        this.loadingModules.delete(moduleName);
        resolve();
      };
      
      link.onerror = () => {
        this.loadingModules.delete(moduleName);
        reject(new Error(`Failed to load CSS module: ${moduleName}`));
      };
      
      document.head.appendChild(link);
    });
    
    this.loadingModules.set(moduleName, loadPromise);
    return loadPromise;
  }
  
  /**
   * Check if a module is loaded
   */
  isLoaded(moduleName: string): boolean {
    return this.loadedModules.has(moduleName);
  }
  
  /**
   * Preload a CSS module
   */
  preloadModule(href: string): void {
    preloadCSS(href);
  }
}

// Global CSS module loader instance
export const cssModuleLoader = new CSSModuleLoader();

/**
 * Route-specific CSS modules
 * Maps routes to their CSS module paths
 */
export const routeCSSModules: Record<string, string[]> = {
  '/tools': ['/css/tools.css'],
  '/shop': ['/css/shop.css'],
  '/programs': ['/css/programs.css'],
  '/impact': ['/css/impact.css'],
  '/admin': ['/css/admin.css'],
};

/**
 * Load CSS for a specific route
 */
export async function loadRouteCSS(route: string): Promise<void> {
  const modules = routeCSSModules[route];
  
  if (!modules || modules.length === 0) {
    return;
  }
  
  const loadPromises = modules.map(href => 
    cssModuleLoader.loadModule(`route:${route}`, href)
  );
  
  await Promise.all(loadPromises);
}

/**
 * Preload CSS for a route (for prefetching)
 */
export function preloadRouteCSS(route: string): void {
  const modules = routeCSSModules[route];
  
  if (!modules || modules.length === 0) {
    return;
  }
  
  modules.forEach(href => cssModuleLoader.preloadModule(href));
}

/**
 * Component-specific CSS loader
 * For lazy-loaded components that need their own styles
 */
export async function loadComponentCSS(
  componentName: string,
  href: string
): Promise<void> {
  return cssModuleLoader.loadModule(`component:${componentName}`, href);
}

/**
 * Defer non-critical CSS loading until after page load
 */
export function deferNonCriticalCSS(): void {
  if (typeof window === 'undefined') return;
  
  // Wait for page load
  if (document.readyState === 'complete') {
    loadDeferredCSS();
  } else {
    window.addEventListener('load', loadDeferredCSS);
  }
}

function loadDeferredCSS(): void {
  // Load non-critical stylesheets marked with data-defer
  const deferredLinks = document.querySelectorAll('link[data-defer="true"]');
  
  deferredLinks.forEach((link) => {
    const href = link.getAttribute('data-href');
    if (href) {
      loadCSSAsync(href);
    }
  });
}

/**
 * CSS Loading Strategy
 * Determines how CSS should be loaded based on route and priority
 */
export interface CSSLoadingStrategy {
  critical: string[];      // Inline in <head>
  highPriority: string[];  // Load immediately
  lowPriority: string[];   // Defer loading
  lazy: string[];          // Load on demand
}

/**
 * Get CSS loading strategy for a route
 */
export function getCSSLoadingStrategy(route: string): CSSLoadingStrategy {
  // Default strategy
  const defaultStrategy: CSSLoadingStrategy = {
    critical: [],
    highPriority: ['/css/main.css'],
    lowPriority: ['/css/animations.css', '/css/utilities.css'],
    lazy: [],
  };
  
  // Route-specific strategies
  const strategies: Record<string, Partial<CSSLoadingStrategy>> = {
    '/': {
      highPriority: ['/css/main.css', '/css/hero.css'],
      lowPriority: ['/css/testimonials.css', '/css/stats.css'],
    },
    '/tools': {
      highPriority: ['/css/main.css'],
      lazy: ['/css/tools.css', '/css/calculators.css'],
    },
    '/shop': {
      highPriority: ['/css/main.css', '/css/shop.css'],
      lowPriority: ['/css/product-grid.css'],
    },
    '/login': {
      highPriority: ['/css/main.css', '/css/forms.css'],
      lowPriority: [],
    },
  };
  
  return {
    ...defaultStrategy,
    ...strategies[route],
  };
}
