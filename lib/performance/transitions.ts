/**
 * Page Transition Manager
 * 
 * Manages smooth transitions between pages with loading states and animations.
 * Requirements: 7.1, 7.4
 */

export interface TransitionOptions {
  duration?: number;
  showLoader?: boolean;
  prefetch?: boolean;
}

export interface TransitionState {
  isTransitioning: boolean;
  from: string | null;
  to: string | null;
  progress: number;
}

type TransitionCallback = (state: TransitionState) => void;

class PageTransitionManager {
  private isTransitioning: boolean = false;
  private currentTransition: string | null = null;
  private transitionStartTime: number = 0;
  private transitionDuration: number = 300;
  private callbacks: {
    start: TransitionCallback[];
    end: TransitionCallback[];
    progress: TransitionCallback[];
  } = {
    start: [],
    end: [],
    progress: [],
  };

  /**
   * Start a page transition
   */
  startTransition(to: string, options: TransitionOptions = {}): void {
    if (this.isTransitioning) {
      this.cancelTransition();
    }

    const {
      duration = 300,
      showLoader = true,
      prefetch = true,
    } = options;

    this.isTransitioning = true;
    this.currentTransition = to;
    this.transitionStartTime = Date.now();
    this.transitionDuration = duration;

    const state: TransitionState = {
      isTransitioning: true,
      from: typeof window !== 'undefined' ? window.location.pathname : null,
      to,
      progress: 0,
    };

    // Notify start callbacks
    this.callbacks.start.forEach(callback => callback(state));

    // Show loading indicator if requested
    if (showLoader) {
      this.showLoadingIndicator();
    }

    // Prefetch the target page if requested
    if (prefetch && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = to;
      document.head.appendChild(link);
    }

    // Start progress animation
    this.animateProgress();
  }

  /**
   * Complete the current transition
   */
  completeTransition(): void {
    if (!this.isTransitioning) return;

    const state: TransitionState = {
      isTransitioning: false,
      from: this.currentTransition,
      to: typeof window !== 'undefined' ? window.location.pathname : null,
      progress: 100,
    };

    this.isTransitioning = false;
    this.currentTransition = null;
    this.hideLoadingIndicator();

    // Notify end callbacks
    this.callbacks.end.forEach(callback => callback(state));
  }

  /**
   * Cancel the current transition
   */
  cancelTransition(): void {
    if (!this.isTransitioning) return;

    this.isTransitioning = false;
    this.currentTransition = null;
    this.hideLoadingIndicator();
  }

  /**
   * Register a callback for transition start
   */
  onTransitionStart(callback: TransitionCallback): () => void {
    this.callbacks.start.push(callback);
    return () => {
      this.callbacks.start = this.callbacks.start.filter(cb => cb !== callback);
    };
  }

  /**
   * Register a callback for transition end
   */
  onTransitionEnd(callback: TransitionCallback): () => void {
    this.callbacks.end.push(callback);
    return () => {
      this.callbacks.end = this.callbacks.end.filter(cb => cb !== callback);
    };
  }

  /**
   * Register a callback for transition progress
   */
  onTransitionProgress(callback: TransitionCallback): () => void {
    this.callbacks.progress.push(callback);
    return () => {
      this.callbacks.progress = this.callbacks.progress.filter(cb => cb !== callback);
    };
  }

  /**
   * Get current transition state
   */
  getState(): TransitionState {
    return {
      isTransitioning: this.isTransitioning,
      from: typeof window !== 'undefined' ? window.location.pathname : null,
      to: this.currentTransition,
      progress: this.calculateProgress(),
    };
  }

  /**
   * Animate transition progress
   */
  private animateProgress(): void {
    if (!this.isTransitioning) return;

    const progress = this.calculateProgress();
    const state: TransitionState = {
      isTransitioning: true,
      from: typeof window !== 'undefined' ? window.location.pathname : null,
      to: this.currentTransition,
      progress,
    };

    this.callbacks.progress.forEach(callback => callback(state));

    if (progress < 90) {
      requestAnimationFrame(() => this.animateProgress());
    }
  }

  /**
   * Calculate current progress (0-100)
   */
  private calculateProgress(): number {
    if (!this.isTransitioning) return 0;

    const elapsed = Date.now() - this.transitionStartTime;
    const progress = Math.min((elapsed / this.transitionDuration) * 90, 90);
    return progress;
  }

  /**
   * Show loading indicator
   */
  private showLoadingIndicator(): void {
    if (typeof window === 'undefined') return;

    let indicator = document.getElementById('page-transition-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'page-transition-indicator';
      indicator.className = 'page-transition-indicator';
      document.body.appendChild(indicator);
    }

    indicator.classList.add('active');
  }

  /**
   * Hide loading indicator
   */
  private hideLoadingIndicator(): void {
    if (typeof window === 'undefined') return;

    const indicator = document.getElementById('page-transition-indicator');
    if (indicator) {
      indicator.classList.remove('active');
      // Remove after animation completes
      setTimeout(() => {
        if (!this.isTransitioning) {
          indicator.remove();
        }
      }, 300);
    }
  }
}

// Singleton instance
export const transitionManager = new PageTransitionManager();

// Export for testing
export { PageTransitionManager };
