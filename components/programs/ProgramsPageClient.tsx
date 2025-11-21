'use client';

import { useEffect } from 'react';
import { prefetchRoute } from '@/lib/performance/prefetch';

interface ProgramsPageClientProps {
  children: React.ReactNode;
}

/**
 * Client-side wrapper for Programs page
 * Handles prefetching of related pages
 */
export default function ProgramsPageClient({ children }: ProgramsPageClientProps) {
  useEffect(() => {
    // Prefetch likely next pages after initial render
    const prefetchTimer = setTimeout(() => {
      // Prefetch book-call page (most likely next action)
      prefetchRoute('/book-call', { priority: 'high' });
      
      // Prefetch other related pages with lower priority
      prefetchRoute('/tools', { priority: 'low' });
      prefetchRoute('/services', { priority: 'low' });
      prefetchRoute('/contact', { priority: 'low' });
    }, 1000); // Wait 1 second after page load

    return () => clearTimeout(prefetchTimer);
  }, []);

  return <>{children}</>;
}
