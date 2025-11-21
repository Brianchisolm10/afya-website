/**
 * Navigation Manager
 * 
 * Manages navigation experience with scroll position restoration,
 * optimistic UI updates, and instant feedback.
 * Requirements: 7.3, 7.5
 */

interface ScrollPosition {
  x: number;
  y: number;
}

interface NavigationState {
  path: string;
  scrollPosition: ScrollPosition;
  timestamp: number;
}

class NavigationManager {
  private scrollPositions: Map<string, ScrollPosition> = new Map();
  private navigationHistory: NavigationState[] = [];
  private isRestoringScroll: boolean = false;
  private maxHistorySize: number = 50;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initScrollTracking();
      this.initPopStateHandler();
    }
  }

  /**
   * Initialize scroll position tracking
   */
  private initScrollTracking(): void {
    // Save scroll position before navigation
    window.addEventListener('beforeunload', () => {
      this.saveScrollPosition();
    });

    // Track scroll position periodically
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.saveScrollPosition();
      }, 100);
    }, { passive: true });
  }

  /**
   * Initialize popstate handler for back/forward navigation
   */
  private initPopStateHandler(): void {
    window.addEventListener('popstate', () => {
      // Restore scroll position on back/forward navigation
      this.restoreScrollPosition();
    });
  }

  /**
   * Save current scroll position
   */
  public saveScrollPosition(path?: string): void {
    if (typeof window === 'undefined') return;

    const currentPath = path || window.location.pathname;
    const scrollPosition: ScrollPosition = {
      x: window.scrollX,
      y: window.scrollY,
    };

    this.scrollPositions.set(currentPath, scrollPosition);

    // Add to navigation history
    this.navigationHistory.push({
      path: currentPath,
      scrollPosition,
      timestamp: Date.now(),
    });

    // Limit history size
    if (this.navigationHistory.length > this.maxHistorySize) {
      this.navigationHistory.shift();
    }
  }

  /**
   * Restore scroll position for current path
   */
  public restoreScrollPosition(path?: string): void {
    if (typeof window === 'undefined' || this.isRestoringScroll) return;

    const currentPath = path || window.location.pathname;
    const savedPosition = this.scrollPositions.get(currentPath);

    if (savedPosition) {
      this.isRestoringScroll = true;

      // Use requestAnimationFrame for smooth restoration
      requestAnimationFrame(() => {
        window.scrollTo({
          left: savedPosition.x,
          top: savedPosition.y,
          behavior: 'instant' as ScrollBehavior,
        });

        // Reset flag after a short delay
        setTimeout(() => {
          this.isRestoringScroll = false;
        }, 100);
      });
    }
  }

  /**
   * Clear scroll position for a path
   */
  public clearScrollPosition(path: string): void {
    this.scrollPositions.delete(path);
  }

  /**
   * Clear all scroll positions
   */
  public clearAllScrollPositions(): void {
    this.scrollPositions.clear();
    this.navigationHistory = [];
  }

  /**
   * Get scroll position for a path
   */
  public getScrollPosition(path: string): ScrollPosition | undefined {
    return this.scrollPositions.get(path);
  }

  /**
   * Check if scroll position exists for path
   */
  public hasScrollPosition(path: string): boolean {
    return this.scrollPositions.has(path);
  }

  /**
   * Get navigation history
   */
  public getHistory(): NavigationState[] {
    return [...this.navigationHistory];
  }

  /**
   * Scroll to top smoothly
   */
  public scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
    if (typeof window === 'undefined') return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  }

  /**
   * Scroll to element smoothly
   */
  public scrollToElement(
    element: HTMLElement | string,
    options: { offset?: number; behavior?: ScrollBehavior } = {}
  ): void {
    if (typeof window === 'undefined') return;

    const { offset = 0, behavior = 'smooth' } = options;
    const targetElement = typeof element === 'string'
      ? document.querySelector(element) as HTMLElement
      : element;

    if (!targetElement) return;

    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior,
    });
  }

  /**
   * Provide instant visual feedback for navigation
   */
  public provideInstantFeedback(element: HTMLElement): void {
    if (!element) return;

    // Add active class for instant feedback
    element.classList.add('navigation-active');

    // Remove after a short delay
    setTimeout(() => {
      element.classList.remove('navigation-active');
    }, 150);
  }

  /**
   * Get statistics
   */
  public getStats(): {
    savedPositions: number;
    historySize: number;
  } {
    return {
      savedPositions: this.scrollPositions.size,
      historySize: this.navigationHistory.length,
    };
  }
}

// Singleton instance
let navigationManagerInstance: NavigationManager | null = null;

export function getNavigationManager(): NavigationManager {
  if (!navigationManagerInstance) {
    navigationManagerInstance = new NavigationManager();
  }
  return navigationManagerInstance;
}

export { NavigationManager };
export type { ScrollPosition, NavigationState };
