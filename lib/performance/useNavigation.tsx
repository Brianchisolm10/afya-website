'use client';

/**
 * React Hooks for Navigation Management
 * 
 * Provides hooks for optimized navigation with scroll restoration
 * and instant feedback.
 * Requirements: 7.3, 7.5
 */

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getNavigationManager } from './navigation-manager';

/**
 * Hook to manage scroll position restoration on navigation
 */
export function useScrollRestoration(enabled: boolean = true) {
  const pathname = usePathname();
  const navigationManager = getNavigationManager();
  const previousPathname = useRef<string>(pathname);

  useEffect(() => {
    if (!enabled) return;

    // Save scroll position when pathname changes
    if (previousPathname.current !== pathname) {
      navigationManager.saveScrollPosition(previousPathname.current);
      previousPathname.current = pathname;
    }

    // Restore scroll position for current path
    const timer = setTimeout(() => {
      navigationManager.restoreScrollPosition(pathname);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, enabled, navigationManager]);

  return {
    saveScrollPosition: useCallback(() => {
      navigationManager.saveScrollPosition(pathname);
    }, [pathname, navigationManager]),
    restoreScrollPosition: useCallback(() => {
      navigationManager.restoreScrollPosition(pathname);
    }, [pathname, navigationManager]),
    scrollToTop: useCallback((behavior?: ScrollBehavior) => {
      navigationManager.scrollToTop(behavior);
    }, [navigationManager]),
  };
}

/**
 * Hook to provide instant feedback on navigation
 */
export function useInstantFeedback() {
  const navigationManager = getNavigationManager();

  const provideFeedback = useCallback((element: HTMLElement | null) => {
    if (element) {
      navigationManager.provideInstantFeedback(element);
    }
  }, [navigationManager]);

  return { provideFeedback };
}

/**
 * Hook for optimistic navigation updates
 */
export function useOptimisticNavigation() {
  const pathname = usePathname();
  const pendingNavigation = useRef<string | null>(null);

  const startOptimisticNavigation = useCallback((to: string) => {
    pendingNavigation.current = to;
  }, []);

  const completeOptimisticNavigation = useCallback(() => {
    pendingNavigation.current = null;
  }, []);

  useEffect(() => {
    if (pendingNavigation.current === pathname) {
      completeOptimisticNavigation();
    }
  }, [pathname, completeOptimisticNavigation]);

  return {
    isPending: pendingNavigation.current !== null,
    pendingPath: pendingNavigation.current,
    startOptimisticNavigation,
    completeOptimisticNavigation,
  };
}

/**
 * Hook to scroll to element on mount
 */
export function useScrollToElement(
  elementId: string | null,
  options: { offset?: number; behavior?: ScrollBehavior; delay?: number } = {}
) {
  const { offset = 80, behavior = 'smooth', delay = 100 } = options;
  const navigationManager = getNavigationManager();

  useEffect(() => {
    if (!elementId) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        navigationManager.scrollToElement(element, { offset, behavior });
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [elementId, offset, behavior, delay, navigationManager]);
}

/**
 * Hook to handle back navigation with scroll restoration
 */
export function useBackNavigation() {
  const navigationManager = getNavigationManager();

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Save current position before going back
      navigationManager.saveScrollPosition();
      window.history.back();
    }
  }, [navigationManager]);

  return { goBack };
}

/**
 * Hook to track navigation history
 */
export function useNavigationHistory() {
  const navigationManager = getNavigationManager();

  return {
    history: navigationManager.getHistory(),
    stats: navigationManager.getStats(),
  };
}
