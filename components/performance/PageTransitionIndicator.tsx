'use client';

/**
 * Page Transition Loading Indicator
 * 
 * Visual indicator for page transitions with progress bar.
 * Requirements: 7.1, 7.4
 */

import { useEffect, useState } from 'react';
import { usePageTransition } from '@/lib/performance/usePageTransition';

export function PageTransitionIndicator() {
  const { state } = usePageTransition();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state.isTransitioning) {
      // Show indicator after a small delay to avoid flashing for fast transitions
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [state.isTransitioning]);

  if (!visible) return null;

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 transition-all duration-300 ease-out"
        style={{
          width: `${state.progress}%`,
          opacity: state.isTransitioning ? 1 : 0,
        }}
        role="progressbar"
        aria-valuenow={state.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page loading progress"
      />
      
      {/* Optional: Overlay for transition effect */}
      <div
        className="fixed inset-0 bg-white/50 dark:bg-gray-900/50 pointer-events-none transition-opacity duration-200 z-40"
        style={{
          opacity: state.isTransitioning ? 0.3 : 0,
        }}
        aria-hidden="true"
      />
    </>
  );
}

/**
 * Minimal loading spinner for transitions
 */
export function TransitionSpinner() {
  const { isTransitioning } = usePageTransition();

  if (!isTransitioning) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
    </div>
  );
}
