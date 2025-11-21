'use client';

import { useEffect } from 'react';
import { deferNonCriticalCSS, loadRouteCSS } from '@/lib/performance/css-loading';
import { usePathname } from 'next/navigation';

/**
 * DeferredCSS Component
 * 
 * Handles loading of non-critical CSS after page load
 * and route-specific CSS on navigation
 */
export function DeferredCSS() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Defer non-critical CSS on initial load
    deferNonCriticalCSS();
  }, []);
  
  useEffect(() => {
    // Load route-specific CSS on navigation
    if (pathname) {
      loadRouteCSS(pathname).catch(err => {
        console.warn('Failed to load route CSS:', err);
      });
    }
  }, [pathname]);
  
  return null;
}

/**
 * CSS Preloader Component
 * 
 * Preloads CSS for a specific route (used with prefetching)
 */
interface CSSPreloaderProps {
  route: string;
}

export function CSSPreloader({ route }: CSSPreloaderProps) {
  useEffect(() => {
    // Preload CSS for the route
    const { preloadRouteCSS } = require('@/lib/performance/css-loading');
    preloadRouteCSS(route);
  }, [route]);
  
  return null;
}

/**
 * Component CSS Loader
 * 
 * Loads CSS for a specific component when it mounts
 */
interface ComponentCSSLoaderProps {
  componentName: string;
  href: string;
  children: React.ReactNode;
}

export function ComponentCSSLoader({
  componentName,
  href,
  children,
}: ComponentCSSLoaderProps) {
  useEffect(() => {
    const { loadComponentCSS } = require('@/lib/performance/css-loading');
    loadComponentCSS(componentName, href).catch(err => {
      console.warn(`Failed to load CSS for ${componentName}:`, err);
    });
  }, [componentName, href]);
  
  return <>{children}</>;
}
