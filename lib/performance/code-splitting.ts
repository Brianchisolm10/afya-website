/**
 * Code Splitting Utilities
 * 
 * Provides utilities for dynamic imports, lazy loading components,
 * and managing loading states
 */

import React, { ComponentType } from 'react';
import dynamic, { Loader } from 'next/dynamic';

/**
 * Enhanced dynamic import options
 */
export interface DynamicImportOptions<P = {}> {
  loading?: ComponentType<any>;
  ssr?: boolean;
  suspense?: boolean;
}

/**
 * Create a dynamically imported component with loading state
 */
export function dynamicImport<P = {}>(
  loader: Loader<P>,
  options?: DynamicImportOptions<P>
) {
  const loadingComponent = options?.loading 
    ? () => React.createElement(options.loading!)
    : undefined;

  return dynamic(loader, {
    loading: loadingComponent,
    ssr: options?.ssr ?? true,
    suspense: options?.suspense ?? false,
  });
}

/**
 * Create a client-only dynamic component (no SSR)
 */
export function clientOnlyImport<P = {}>(
  loader: Loader<P>,
  options?: Omit<DynamicImportOptions<P>, 'ssr'>
) {
  const loadingComponent = options?.loading 
    ? () => React.createElement(options.loading!)
    : undefined;

  return dynamic(loader, {
    loading: loadingComponent,
    ssr: false,
    suspense: options?.suspense ?? false,
  });
}

/**
 * Create a lazy-loaded component with custom loading component
 */
export function lazyImport<P = {}>(
  loader: Loader<P>,
  LoadingComponent?: ComponentType<any>
) {
  const loadingComponent = LoadingComponent 
    ? () => React.createElement(LoadingComponent)
    : undefined;

  return dynamic(loader, {
    loading: loadingComponent,
    ssr: false,
  });
}

/**
 * Preload a dynamic component
 */
export function preloadComponent<P = {}>(
  component: ReturnType<typeof dynamic>
): void {
  if (component && typeof component === 'object' && 'preload' in component) {
    (component as any).preload();
  }
}

/**
 * Route-based code splitting helper
 * Groups related components for a route
 */
export interface RouteComponents {
  [key: string]: () => Promise<any>;
}

export function createRouteBundle(components: RouteComponents) {
  const loadedComponents: { [key: string]: any } = {};

  return {
    /**
     * Load a specific component from the bundle
     */
    load: async (key: string) => {
      if (loadedComponents[key]) {
        return loadedComponents[key];
      }

      if (!components[key]) {
        throw new Error(`Component "${key}" not found in route bundle`);
      }

      const module = await components[key]();
      loadedComponents[key] = module.default || module;
      return loadedComponents[key];
    },

    /**
     * Preload all components in the bundle
     */
    preloadAll: async () => {
      const promises = Object.keys(components).map(async (key) => {
        if (!loadedComponents[key]) {
          const module = await components[key]();
          loadedComponents[key] = module.default || module;
        }
      });

      await Promise.all(promises);
    },

    /**
     * Preload specific components
     */
    preload: async (keys: string[]) => {
      const promises = keys.map(async (key) => {
        if (!loadedComponents[key] && components[key]) {
          const module = await components[key]();
          loadedComponents[key] = module.default || module;
        }
      });

      await Promise.all(promises);
    },

    /**
     * Check if a component is loaded
     */
    isLoaded: (key: string) => {
      return !!loadedComponents[key];
    },

    /**
     * Get loaded components count
     */
    getLoadedCount: () => {
      return Object.keys(loadedComponents).length;
    },
  };
}

/**
 * Chunk loading priority
 */
export enum ChunkPriority {
  HIGH = 'high',
  LOW = 'low',
  AUTO = 'auto',
}

/**
 * Load a chunk with priority
 */
export async function loadChunk(
  importFn: () => Promise<any>,
  priority: ChunkPriority = ChunkPriority.AUTO
): Promise<any> {
  // In browsers that support it, we can hint the priority
  if (typeof document !== 'undefined' && 'scheduler' in window) {
    const scheduler = (window as any).scheduler;
    
    if (priority === ChunkPriority.HIGH && scheduler.postTask) {
      return scheduler.postTask(importFn, { priority: 'user-blocking' });
    } else if (priority === ChunkPriority.LOW && scheduler.postTask) {
      return scheduler.postTask(importFn, { priority: 'background' });
    }
  }

  // Fallback to regular import
  return importFn();
}

/**
 * Defer loading until idle
 */
export function loadWhenIdle<T>(
  importFn: () => Promise<T>,
  timeout: number = 5000
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      importFn().then(resolve).catch(reject);
      return;
    }

    if ('requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(
        () => {
          importFn().then(resolve).catch(reject);
        },
        { timeout }
      );

      // Cleanup if component unmounts
      return () => {
        window.cancelIdleCallback(idleCallback);
      };
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        importFn().then(resolve).catch(reject);
      }, 0);
    }
  });
}

/**
 * Load component on interaction (hover, click, focus)
 */
export function loadOnInteraction<T>(
  importFn: () => Promise<T>,
  element: HTMLElement,
  events: string[] = ['mouseenter', 'focus']
): () => void {
  let loaded = false;
  let cleanup: (() => void) | null = null;

  const load = () => {
    if (loaded) return;
    loaded = true;

    importFn();

    // Remove event listeners after loading
    if (cleanup) cleanup();
  };

  const listeners = events.map((event) => {
    const listener = () => load();
    element.addEventListener(event, listener, { once: true });
    return () => element.removeEventListener(event, listener);
  });

  cleanup = () => {
    listeners.forEach((remove) => remove());
  };

  return cleanup;
}

/**
 * Load component when visible (Intersection Observer)
 */
export function loadOnVisible<T>(
  importFn: () => Promise<T>,
  element: HTMLElement,
  options?: IntersectionObserverInit
): () => void {
  let loaded = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loaded) {
          loaded = true;
          importFn();
          observer.disconnect();
        }
      });
    },
    {
      rootMargin: '50px',
      ...options,
    }
  );

  observer.observe(element);

  return () => {
    observer.disconnect();
  };
}

/**
 * Batch load multiple chunks
 */
export async function batchLoadChunks(
  importFns: Array<() => Promise<any>>,
  options?: {
    parallel?: boolean;
    delay?: number;
  }
): Promise<any[]> {
  const { parallel = true, delay = 0 } = options || {};

  if (parallel) {
    return Promise.all(importFns.map((fn) => fn()));
  }

  const results: any[] = [];
  for (const fn of importFns) {
    const result = await fn();
    results.push(result);

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return results;
}
