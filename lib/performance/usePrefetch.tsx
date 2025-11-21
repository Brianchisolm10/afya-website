'use client';

/**
 * React Hooks for Resource Prefetching
 * 
 * Provides hooks for prefetching routes with different strategies.
 * Requirements: 7.2
 */

import { useEffect, useRef, useCallback } from 'react';
import { getPrefetcher } from './prefetch';

/**
 * Hook to prefetch a route on component mount
 */
export function usePrefetch(
  route: string | string[],
  options: { enabled?: boolean; priority?: 'high' | 'low' } = {}
) {
  const { enabled = true, priority = 'low' } = options;

  useEffect(() => {
    if (!enabled) return;

    const prefetcher = getPrefetcher();
    const routes = Array.isArray(route) ? route : [route];

    routes.forEach((r) => {
      prefetcher.prefetchRoute(r, { priority });
    });
  }, [route, enabled, priority]);
}

/**
 * Hook to prefetch on hover
 */
export function usePrefetchOnHover(priority: 'high' | 'low' = 'high') {
  const prefetcher = getPrefetcher();

  const handleMouseEnter = useCallback((href: string) => {
    prefetcher.onLinkHover(href);
  }, [prefetcher]);

  return { onMouseEnter: handleMouseEnter };
}

/**
 * Hook to prefetch when element is visible
 */
export function usePrefetchOnVisible(href: string, enabled: boolean = true) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const prefetcher = getPrefetcher();
    const element = elementRef.current;

    prefetcher.onLinkVisible(element);

    return () => {
      prefetcher.unobserveLink(element);
    };
  }, [href, enabled]);

  return elementRef;
}

/**
 * Hook to prefetch on user interaction (any interaction)
 */
export function usePrefetchOnInteraction(
  route: string | string[],
  options: { priority?: 'high' | 'low'; once?: boolean } = {}
) {
  const { priority = 'high', once = true } = options;
  const hasPrefetched = useRef(false);

  useEffect(() => {
    const prefetcher = getPrefetcher();
    const routes = Array.isArray(route) ? route : [route];

    const handleInteraction = () => {
      if (once && hasPrefetched.current) return;

      routes.forEach((r) => {
        prefetcher.prefetchRoute(r, { priority });
      });

      hasPrefetched.current = true;
    };

    // Listen for any user interaction
    const options = once ? { once: true } : {};
    window.addEventListener('mousemove', handleInteraction, options);
    window.addEventListener('touchstart', handleInteraction, options);
    window.addEventListener('keydown', handleInteraction, options);
    window.addEventListener('scroll', handleInteraction, options);

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, [route, priority, once]);
}

/**
 * Hook to prefetch with delay (useful for likely next pages)
 */
export function usePrefetchWithDelay(
  route: string | string[],
  delay: number = 2000,
  options: { enabled?: boolean; priority?: 'high' | 'low' } = {}
) {
  const { enabled = true, priority = 'low' } = options;

  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      const prefetcher = getPrefetcher();
      const routes = Array.isArray(route) ? route : [route];

      routes.forEach((r) => {
        prefetcher.prefetchRoute(r, { priority });
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [route, delay, enabled, priority]);
}
