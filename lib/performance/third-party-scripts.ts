/**
 * Third-Party Script Optimization
 * 
 * Manages loading of third-party scripts with optimal strategies
 * to minimize impact on page performance
 */

/**
 * Script loading strategy
 */
export enum ScriptStrategy {
  BLOCKING = 'blocking',           // Load immediately (blocks rendering)
  DEFER = 'defer',                 // Load after HTML parsing
  ASYNC = 'async',                 // Load asynchronously
  LAZY = 'lazy',                   // Load when idle or on interaction
  WORKER = 'worker',               // Load in web worker
}

/**
 * Script priority
 */
export enum ScriptPriority {
  CRITICAL = 'critical',           // Essential for page function
  HIGH = 'high',                   // Important but not critical
  MEDIUM = 'medium',               // Nice to have
  LOW = 'low',                     // Can be deferred
}

/**
 * Third-party script configuration
 */
export interface ThirdPartyScript {
  name: string;
  src?: string;
  inline?: string;
  strategy: ScriptStrategy;
  priority: ScriptPriority;
  condition?: () => boolean;       // Load only if condition is true
  onLoad?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;                // Timeout in ms
}

/**
 * Configured third-party scripts
 */
export const thirdPartyScripts: Record<string, ThirdPartyScript> = {
  // Stripe (critical for checkout)
  stripe: {
    name: 'Stripe',
    src: 'https://js.stripe.com/v3/',
    strategy: ScriptStrategy.DEFER,
    priority: ScriptPriority.HIGH,
    condition: () => {
      // Only load on shop/checkout pages
      if (typeof window === 'undefined') return false;
      return window.location.pathname.includes('/shop') ||
             window.location.pathname.includes('/checkout') ||
             window.location.pathname.includes('/donate');
    },
    timeout: 5000,
  },

  // Web Vitals (performance monitoring)
  webVitals: {
    name: 'Web Vitals',
    strategy: ScriptStrategy.LAZY,
    priority: ScriptPriority.LOW,
    inline: `
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
            onCLS(console.log);
            onFID(console.log);
            onFCP(console.log);
            onLCP(console.log);
            onTTFB(console.log);
          });
        });
      }
    `,
  },

  // Analytics (if needed in future)
  analytics: {
    name: 'Analytics',
    strategy: ScriptStrategy.LAZY,
    priority: ScriptPriority.LOW,
    condition: () => {
      // Only load in production
      return process.env.NODE_ENV === 'production';
    },
  },
};

/**
 * Load a third-party script
 */
export async function loadScript(config: ThirdPartyScript): Promise<void> {
  // Check condition
  if (config.condition && !config.condition()) {
    return;
  }

  // Handle inline scripts
  if (config.inline) {
    const script = document.createElement('script');
    script.textContent = config.inline;
    script.async = config.strategy === ScriptStrategy.ASYNC;
    script.defer = config.strategy === ScriptStrategy.DEFER;
    document.head.appendChild(script);
    return;
  }

  // Handle external scripts
  if (!config.src) {
    throw new Error(`Script ${config.name} has no src or inline content`);
  }

  return new Promise((resolve, reject) => {
    // Check if already loaded
    const existing = document.querySelector(`script[src="${config.src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = config.src;
    script.async = config.strategy === ScriptStrategy.ASYNC;
    script.defer = config.strategy === ScriptStrategy.DEFER;

    // Set timeout
    let timeoutId: NodeJS.Timeout | null = null;
    if (config.timeout) {
      timeoutId = setTimeout(() => {
        const error = new Error(`Script ${config.name} timed out`);
        if (config.onError) {
          config.onError(error);
        }
        reject(error);
      }, config.timeout);
    }

    script.onload = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (config.onLoad) {
        config.onLoad();
      }
      resolve();
    };

    script.onerror = () => {
      if (timeoutId) clearTimeout(timeoutId);
      const error = new Error(`Failed to load script ${config.name}`);
      if (config.onError) {
        config.onError(error);
      }
      reject(error);
    };

    document.head.appendChild(script);
  });
}

/**
 * Load script when idle
 */
export function loadScriptWhenIdle(config: ThirdPartyScript): void {
  if (typeof window === 'undefined') return;

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(
      () => {
        loadScript(config).catch(console.error);
      },
      { timeout: config.timeout || 5000 }
    );
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      loadScript(config).catch(console.error);
    }, 1000);
  }
}

/**
 * Load script on interaction
 */
export function loadScriptOnInteraction(
  config: ThirdPartyScript,
  events: string[] = ['mousedown', 'touchstart', 'keydown']
): () => void {
  if (typeof window === 'undefined') return () => {};

  let loaded = false;

  const load = () => {
    if (loaded) return;
    loaded = true;
    loadScript(config).catch(console.error);
    cleanup();
  };

  const listeners = events.map((event) => {
    const listener = () => load();
    window.addEventListener(event, listener, { once: true, passive: true });
    return () => window.removeEventListener(event, listener);
  });

  const cleanup = () => {
    listeners.forEach((remove) => remove());
  };

  return cleanup;
}

/**
 * Load script when visible
 */
export function loadScriptWhenVisible(
  config: ThirdPartyScript,
  element: HTMLElement
): () => void {
  if (typeof window === 'undefined') return () => {};

  let loaded = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loaded) {
          loaded = true;
          loadScript(config).catch(console.error);
          observer.disconnect();
        }
      });
    },
    { rootMargin: '100px' }
  );

  observer.observe(element);

  return () => {
    observer.disconnect();
  };
}

/**
 * Preconnect to third-party domains
 */
export function preconnectToDomain(domain: string): void {
  if (typeof document === 'undefined') return;

  // Check if already exists
  const existing = document.querySelector(`link[href="${domain}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = domain;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

/**
 * DNS prefetch for third-party domains
 */
export function dnsPrefetch(domain: string): void {
  if (typeof document === 'undefined') return;

  const existing = document.querySelector(`link[href="${domain}"][rel="dns-prefetch"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = domain;
  document.head.appendChild(link);
}

/**
 * Initialize third-party scripts based on priority
 */
export function initializeThirdPartyScripts(): void {
  if (typeof window === 'undefined') return;

  // Preconnect to critical domains
  preconnectToDomain('https://js.stripe.com');

  // Load critical scripts immediately
  Object.values(thirdPartyScripts)
    .filter((script) => script.priority === ScriptPriority.CRITICAL)
    .forEach((script) => {
      loadScript(script).catch(console.error);
    });

  // Load high priority scripts with defer
  Object.values(thirdPartyScripts)
    .filter((script) => script.priority === ScriptPriority.HIGH)
    .forEach((script) => {
      if (script.strategy === ScriptStrategy.DEFER) {
        loadScript(script).catch(console.error);
      }
    });

  // Load medium/low priority scripts when idle
  Object.values(thirdPartyScripts)
    .filter((script) => 
      script.priority === ScriptPriority.MEDIUM ||
      script.priority === ScriptPriority.LOW
    )
    .forEach((script) => {
      loadScriptWhenIdle(script);
    });
}

/**
 * Remove unused third-party scripts
 */
export function removeUnusedScripts(): void {
  if (typeof document === 'undefined') return;

  // List of known unused script patterns
  const unusedPatterns = [
    // Add patterns for scripts that should be removed
  ];

  unusedPatterns.forEach((pattern) => {
    const scripts = document.querySelectorAll(`script[src*="${pattern}"]`);
    scripts.forEach((script) => script.remove());
  });
}

/**
 * Monitor third-party script performance
 */
export interface ScriptPerformance {
  name: string;
  loadTime: number;
  size: number;
  blocking: boolean;
}

export function monitorScriptPerformance(): ScriptPerformance[] {
  if (typeof window === 'undefined' || !window.performance) {
    return [];
  }

  const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  return resources
    .filter((resource) => resource.initiatorType === 'script')
    .map((resource) => ({
      name: resource.name,
      loadTime: resource.duration,
      size: resource.transferSize || 0,
      blocking: resource.renderBlockingStatus === 'blocking',
    }))
    .sort((a, b) => b.loadTime - a.loadTime);
}

/**
 * Get third-party script recommendations
 */
export function getScriptOptimizationRecommendations(): {
  defer: string[];
  async: string[];
  remove: string[];
  lazy: string[];
} {
  const performance = monitorScriptPerformance();
  
  return {
    defer: performance
      .filter((s) => s.blocking && s.loadTime > 100)
      .map((s) => s.name),
    async: performance
      .filter((s) => !s.blocking && s.loadTime > 200)
      .map((s) => s.name),
    remove: [], // Manually identify unused scripts
    lazy: performance
      .filter((s) => s.size > 50000) // > 50KB
      .map((s) => s.name),
  };
}

/**
 * Facade pattern for third-party libraries
 * Delays loading until user interaction
 */
export class ThirdPartyFacade {
  private loaded = false;
  private loading = false;
  private loadPromise: Promise<void> | null = null;

  constructor(
    private config: ThirdPartyScript,
    private events: string[] = ['mouseenter', 'touchstart', 'focus']
  ) {}

  /**
   * Initialize facade (attach event listeners)
   */
  init(element: HTMLElement): () => void {
    const listeners = this.events.map((event) => {
      const listener = () => this.load();
      element.addEventListener(event, listener, { once: true, passive: true });
      return () => element.removeEventListener(event, listener);
    });

    return () => {
      listeners.forEach((remove) => remove());
    };
  }

  /**
   * Load the third-party script
   */
  async load(): Promise<void> {
    if (this.loaded) return;
    if (this.loading) return this.loadPromise!;

    this.loading = true;
    this.loadPromise = loadScript(this.config);

    try {
      await this.loadPromise;
      this.loaded = true;
    } catch (error) {
      this.loading = false;
      throw error;
    }
  }

  /**
   * Check if loaded
   */
  isLoaded(): boolean {
    return this.loaded;
  }
}
