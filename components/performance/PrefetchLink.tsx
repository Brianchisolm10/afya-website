'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { getPrefetcher } from '@/lib/performance/prefetch';

interface PrefetchLinkProps {
  href: string;
  children: React.ReactNode;
  prefetchOn?: 'hover' | 'visible' | 'mount' | 'none';
  priority?: 'high' | 'low';
  className?: string;
  [key: string]: any;
}

/**
 * Enhanced Link component with intelligent prefetching
 */
export function PrefetchLink({
  href,
  children,
  prefetchOn = 'hover',
  priority = 'low',
  className,
  ...props
}: PrefetchLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const prefetcher = getPrefetcher();

  // Prefetch on mount
  useEffect(() => {
    if (prefetchOn === 'mount') {
      prefetcher.prefetchRoute(href, { priority });
    }
  }, [href, prefetchOn, priority]);

  // Prefetch on visible
  useEffect(() => {
    if (prefetchOn === 'visible' && linkRef.current) {
      prefetcher.onLinkVisible(linkRef.current);

      return () => {
        if (linkRef.current) {
          prefetcher.unobserveLink(linkRef.current);
        }
      };
    }
  }, [href, prefetchOn]);

  // Prefetch on hover
  const handleMouseEnter = () => {
    if (prefetchOn === 'hover') {
      prefetcher.onLinkHover(href);
    }
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      onMouseEnter={handleMouseEnter}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}
