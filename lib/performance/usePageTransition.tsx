'use client';

/**
 * React Hook for Page Transitions
 * 
 * Provides React integration for the page transition manager.
 * Requirements: 7.1, 7.4
 */

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { transitionManager, TransitionState, TransitionOptions } from './transitions';

export function usePageTransition() {
  const [state, setState] = useState<TransitionState>(transitionManager.getState());
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Subscribe to transition events
    const unsubscribeStart = transitionManager.onTransitionStart(setState);
    const unsubscribeEnd = transitionManager.onTransitionEnd(setState);
    const unsubscribeProgress = transitionManager.onTransitionProgress(setState);

    return () => {
      unsubscribeStart();
      unsubscribeEnd();
      unsubscribeProgress();
    };
  }, []);

  useEffect(() => {
    // Complete transition when pathname changes
    if (state.isTransitioning && state.to === pathname) {
      transitionManager.completeTransition();
    }
  }, [pathname, state.isTransitioning, state.to]);

  const navigate = useCallback((to: string, options?: TransitionOptions) => {
    transitionManager.startTransition(to, options);
    router.push(to);
  }, [router]);

  return {
    state,
    navigate,
    isTransitioning: state.isTransitioning,
  };
}

/**
 * Hook for transition-aware navigation
 */
export function useTransitionRouter() {
  const router = useRouter();

  const push = useCallback((href: string, options?: TransitionOptions) => {
    transitionManager.startTransition(href, options);
    router.push(href);
  }, [router]);

  const replace = useCallback((href: string, options?: TransitionOptions) => {
    transitionManager.startTransition(href, options);
    router.replace(href);
  }, [router]);

  const back = useCallback(() => {
    router.back();
  }, [router]);

  return {
    push,
    replace,
    back,
  };
}
