'use client';

/**
 * Transition Link Component
 * 
 * Enhanced link component that combines prefetching with smooth page transitions.
 * Requirements: 7.2, 7.4
 */

import Link from 'next/link';
import { useRef, useEffect, MouseEvent } from 'react';
import { getPrefetcher } from '@/lib/performance/prefetch';
import { useTransitionRouter } from '@/lib/performance/usePageTransition';

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  prefetchOn?: 'hover' | 'visible' | 'mount' | 'none';
  priority?: 'high' | 'low';
  showTransition?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: any;
}

/**
 * Link component with prefetching and smooth page transitions
 */
export function TransitionLink({
  href,
  children,
  prefetchOn = 'hover',
  priority = 'low',
  showTransition = true,
  className,
  onClick,
  ...props
}: TransitionLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const prefetcher = getPrefetcher();
  const router = useTransitionRouter();

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

  // Handle click with transition
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }

    // If default prevented, don't navigate
    if (e.defaultPrevented) {
      return;
    }

    // Only handle internal links
    if (href.startsWith('http') || href.startsWith('#')) {
      return;
    }

    // Use transition router if transitions are enabled
    if (showTransition) {
      e.preventDefault();
      router.push(href, {
        duration: 300,
        showLoader: true,
        prefetch: true,
      });
    }
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * Prefetch multiple routes on component mount
 */
export function PrefetchRoutes({ routes, priority = 'low' }: {
  routes: string[];
  priority?: 'high' | 'low';
}) {
  const prefetcher = getPrefetcher();

  useEffect(() => {
    routes.forEach(route => {
      prefetcher.prefetchRoute(route, { priority });
    });
  }, [routes, priority]);

  return null;
}

/**
 * Prefetch route on interaction (focus, hover, etc.)
 */
export function PrefetchOnInteraction({ route, priority = 'high' }: {
  route: string;
  priority?: 'high' | 'low';
}) {
  const prefetcher = getPrefetcher();

  useEffect(() => {
    const handleInteraction = () => {
      prefetcher.prefetchRoute(route, { priority });
    };

    // Listen for any user interaction
    window.addEventListener('mousemove', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [route, priority]);

  return null;
}
