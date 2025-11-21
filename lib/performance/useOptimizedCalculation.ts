/**
 * Optimized Calculation Hook
 * 
 * Provides debouncing and memoization for tool calculations
 * to ensure 60fps interactions and prevent unnecessary re-renders
 */

import { useCallback, useRef, useEffect } from 'react';

/**
 * Debounce a calculation function
 * Delays execution until user stops typing/interacting
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );
}

/**
 * Throttle a function to limit execution rate
 * Ensures function runs at most once per specified interval
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number = 100
): T {
  const inThrottle = useRef(false);
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callbackRef.current(...args);
        inThrottle.current = true;

        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    }) as T,
    [limit]
  );
}

/**
 * Request animation frame wrapper for smooth animations
 * Ensures updates happen at 60fps
 */
export function useAnimationFrame<T extends (...args: any[]) => any>(
  callback: T
): T {
  const rafRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        callbackRef.current(...args);
      });
    }) as T,
    []
  );
}

/**
 * Optimize input changes with debouncing
 * Prevents excessive re-renders during typing
 */
export function useOptimizedInput<T>(
  initialValue: T,
  onChange: (value: T) => void,
  delay: number = 300
): [T, (value: T) => void] {
  const [localValue, setLocalValue] = React.useState(initialValue);
  const debouncedOnChange = useDebounce(onChange, delay);

  const handleChange = useCallback(
    (value: T) => {
      setLocalValue(value);
      debouncedOnChange(value);
    },
    [debouncedOnChange]
  );

  return [localValue, handleChange];
}

/**
 * Memoize expensive calculations
 * Only recalculates when dependencies change
 */
export function useMemoizedCalculation<T, D extends any[]>(
  calculation: (...deps: D) => T,
  dependencies: D
): T {
  const memoRef = useRef<{ deps: D; result: T } | null>(null);

  // Check if dependencies have changed
  const depsChanged =
    !memoRef.current ||
    dependencies.some((dep, i) => !Object.is(dep, memoRef.current!.deps[i]));

  if (depsChanged) {
    const result = calculation(...dependencies);
    memoRef.current = { deps: dependencies, result };
  }

  return memoRef.current!.result;
}

/**
 * Batch state updates to prevent multiple re-renders
 */
export function useBatchedUpdates() {
  const pendingUpdates = useRef<Array<() => void>>([]);
  const rafRef = useRef<number | null>(null);

  const flush = useCallback(() => {
    const updates = pendingUpdates.current;
    pendingUpdates.current = [];

    // Execute all pending updates in a single batch
    updates.forEach((update) => update());
  }, []);

  const scheduleUpdate = useCallback(
    (update: () => void) => {
      pendingUpdates.current.push(update);

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          flush();
          rafRef.current = null;
        });
      }
    },
    [flush]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return scheduleUpdate;
}

/**
 * Optimize scroll performance with passive listeners
 */
export function useOptimizedScroll(
  callback: (event: Event) => void,
  element?: HTMLElement | Window
) {
  const throttledCallback = useThrottle(callback, 16); // ~60fps

  useEffect(() => {
    const target = element || window;

    target.addEventListener('scroll', throttledCallback, { passive: true });

    return () => {
      target.removeEventListener('scroll', throttledCallback as EventListener);
    };
  }, [throttledCallback, element]);
}

/**
 * Optimize resize performance
 */
export function useOptimizedResize(
  callback: (event: Event) => void,
  delay: number = 150
) {
  const debouncedCallback = useDebounce(callback, delay);

  useEffect(() => {
    window.addEventListener('resize', debouncedCallback, { passive: true });

    return () => {
      window.removeEventListener('resize', debouncedCallback as EventListener);
    };
  }, [debouncedCallback]);
}

// Fix import issue
import React from 'react';
