'use client';

/**
 * Page Transition Provider
 * 
 * Wraps the application to provide seamless page transitions,
 * scroll restoration, and navigation feedback.
 * Requirements: 7.1, 7.3, 7.4, 7.5
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PageTransitionIndicator } from './PageTransitionIndicator';
import { NavigationFeedback } from './NavigationFeedback';
import { useScrollRestoration } from '@/lib/performance/useNavigation';
import { transitionManager } from '@/lib/performance/transitions';

interface PageTransitionProviderProps {
  children: React.ReactNode;
  enableScrollRestoration?: boolean;
  enableTransitionIndicator?: boolean;
  enableNavigationFeedback?: boolean;
}

/**
 * Provider component that enables all page transition features
 */
export function PageTransitionProvider({
  children,
  enableScrollRestoration = true,
  enableTransitionIndicator = true,
  enableNavigationFeedback = true,
}: PageTransitionProviderProps) {
  const pathname = usePathname();

  // Enable scroll restoration
  useScrollRestoration(enableScrollRestoration);

  // Complete transition when pathname changes
  useEffect(() => {
    transitionManager.completeTransition();
  }, [pathname]);

  return (
    <>
      {enableTransitionIndicator && <PageTransitionIndicator />}
      {enableNavigationFeedback && <NavigationFeedback />}
      {children}
    </>
  );
}

/**
 * Hook to enable page transitions in a layout
 */
export function usePageTransitions(options: {
  scrollRestoration?: boolean;
} = {}) {
  const { scrollRestoration = true } = options;
  const pathname = usePathname();

  // Enable scroll restoration
  useScrollRestoration(scrollRestoration);

  // Complete transition when pathname changes
  useEffect(() => {
    transitionManager.completeTransition();
  }, [pathname]);
}
