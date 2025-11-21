/**
 * Scroll performance utilities for shop page
 * Implements optimized infinite scroll (Requirement 4.4)
 */

/**
 * Debounce function for scroll events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 */
export function smoothScrollTo(element: HTMLElement, offset: number = 0): void {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}

/**
 * Get scroll position
 */
export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  };
}

/**
 * Save scroll position to session storage
 */
export function saveScrollPosition(key: string): void {
  const position = getScrollPosition();
  sessionStorage.setItem(key, JSON.stringify(position));
}

/**
 * Restore scroll position from session storage
 */
export function restoreScrollPosition(key: string): void {
  const saved = sessionStorage.getItem(key);
  if (saved) {
    const position = JSON.parse(saved);
    window.scrollTo(position.x, position.y);
    sessionStorage.removeItem(key);
  }
}

/**
 * Create intersection observer with optimized settings
 */
export function createOptimizedObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1,
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
}

/**
 * Request animation frame wrapper for scroll performance
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  callback: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function throttled(...args: Parameters<T>) {
    if (rafId !== null) {
      return;
    }

    rafId = requestAnimationFrame(() => {
      callback(...args);
      rafId = null;
    });
  };
}

/**
 * Passive event listener options for better scroll performance
 */
export const passiveEventOptions: AddEventListenerOptions = {
  passive: true,
  capture: false,
};
