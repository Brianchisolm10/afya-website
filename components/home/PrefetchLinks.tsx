/**
 * PrefetchLinks Component
 * 
 * Prefetches specified routes for faster navigation
 * Used to improve perceived performance by loading likely next pages
 */

'use client';

import { useEffect } from 'react';
import { getPrefetcher } from '@/lib/performance/prefetch';

interface PrefetchLinksProps {
  routes: string[];
  priority?: 'high' | 'low';
  delay?: number; // Delay before prefetching (ms)
}

export function PrefetchLinks({ 
  routes, 
  priority = 'low',
  delay = 1000 
}: PrefetchLinksProps) {
  useEffect(() => {
    // Delay prefetching to not interfere with initial page load
    const timer = setTimeout(() => {
      const prefetcher = getPrefetcher();
      routes.forEach((route) => {
        prefetcher.prefetchRoute(route, { priority });
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [routes, priority, delay]);

  return null; // This component doesn't render anything
}

export default PrefetchLinks;
