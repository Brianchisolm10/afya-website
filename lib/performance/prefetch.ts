/**
 * Resource Prefetching Service
 * 
 * Intelligently prefetches resources based on user behavior:
 * - Hover-based prefetching for links
 * - Intersection Observer for visible links
 * - Priority-based prefetch queue
 */

interface PrefetchOptions {
  priority?: 'high' | 'low';
  as?: 'document' | 'script' | 'style' | 'image' | 'fetch';
  crossOrigin?: 'anonymous' | 'use-credentials';
}

interface PrefetchQueueItem {
  url: string;
  priority: 'high' | 'low';
  timestamp: number;
}

class ResourcePrefetcher {
  private prefetchedRoutes: Set<string> = new Set();
  private prefetchQueue: PrefetchQueueItem[] = [];
  private isProcessing: boolean = false;
  private observer: IntersectionObserver | null = null;
  private hoverTimeout: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initIntersectionObserver();
    }
  }

  /**
   * Initialize Intersection Observer for viewport-based prefetching
   */
  private initIntersectionObserver(): void {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLAnchorElement;
              const href = target.getAttribute('href');
              if (href && this.isValidUrl(href)) {
                this.prefetchRoute(href, { priority: 'low' });
              }
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );
    }
  }

  /**
   * Check if URL is valid for prefetching
   */
  private isValidUrl(url: string): boolean {
    // Only prefetch internal routes
    if (url.startsWith('http') && !url.startsWith(window.location.origin)) {
      return false;
    }
    // Skip hash links and external URLs
    if (url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) {
      return false;
    }
    return true;
  }

  /**
   * Prefetch a route/page
   */
  public prefetchRoute(path: string, options: PrefetchOptions = {}): void {
    if (this.prefetchedRoutes.has(path)) {
      return;
    }

    const priority = options.priority || 'low';
    this.addToQueue(path, priority);
    this.processQueue();
  }

  /**
   * Prefetch an image
   */
  public prefetchImage(src: string): void {
    if (this.prefetchedRoutes.has(src)) {
      return;
    }

    this.createPrefetchLink(src, { as: 'image', priority: 'low' });
    this.prefetchedRoutes.add(src);
  }

  /**
   * Prefetch data from an API endpoint
   */
  public async prefetchData(url: string): Promise<void> {
    if (this.prefetchedRoutes.has(url)) {
      return;
    }

    try {
      // Use fetch with low priority
      await fetch(url, {
        method: 'GET',
        priority: 'low' as RequestPriority,
      });
      this.prefetchedRoutes.add(url);
    } catch (error) {
      console.warn('Failed to prefetch data:', url, error);
    }
  }

  /**
   * Handle link hover event
   */
  public onLinkHover(href: string): void {
    if (!this.isValidUrl(href)) {
      return;
    }

    // Debounce hover events
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    this.hoverTimeout = setTimeout(() => {
      this.prefetchRoute(href, { priority: 'high' });
    }, 50);
  }

  /**
   * Observe a link for viewport-based prefetching
   */
  public onLinkVisible(element: HTMLElement): void {
    if (this.observer) {
      this.observer.observe(element);
    }
  }

  /**
   * Stop observing a link
   */
  public unobserveLink(element: HTMLElement): void {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  /**
   * Add URL to prefetch queue
   */
  private addToQueue(url: string, priority: 'high' | 'low'): void {
    // Check if already in queue
    const existingIndex = this.prefetchQueue.findIndex((item) => item.url === url);
    
    if (existingIndex !== -1) {
      // Update priority if higher
      if (priority === 'high' && this.prefetchQueue[existingIndex].priority === 'low') {
        this.prefetchQueue[existingIndex].priority = 'high';
        // Re-sort queue
        this.sortQueue();
      }
      return;
    }

    this.prefetchQueue.push({
      url,
      priority,
      timestamp: Date.now(),
    });

    this.sortQueue();
  }

  /**
   * Sort queue by priority (high first) and timestamp
   */
  private sortQueue(): void {
    this.prefetchQueue.sort((a, b) => {
      if (a.priority === b.priority) {
        return a.timestamp - b.timestamp;
      }
      return a.priority === 'high' ? -1 : 1;
    });
  }

  /**
   * Process prefetch queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.prefetchQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.prefetchQueue.length > 0) {
      const item = this.prefetchQueue.shift();
      if (!item) break;

      if (!this.prefetchedRoutes.has(item.url)) {
        await this.executePrefetch(item.url, item.priority);
        // Small delay between prefetches to avoid overwhelming the browser
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    this.isProcessing = false;
  }

  /**
   * Execute the actual prefetch
   */
  private async executePrefetch(url: string, priority: 'high' | 'low'): Promise<void> {
    try {
      this.createPrefetchLink(url, { priority, as: 'document' });
      this.prefetchedRoutes.add(url);
    } catch (error) {
      console.warn('Failed to prefetch:', url, error);
    }
  }

  /**
   * Create a prefetch link element
   */
  private createPrefetchLink(href: string, options: PrefetchOptions): void {
    if (typeof document === 'undefined') {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;

    if (options.as) {
      link.as = options.as;
    }

    if (options.crossOrigin) {
      link.crossOrigin = options.crossOrigin;
    }

    // Add to document head
    document.head.appendChild(link);
  }

  /**
   * Clear all prefetched routes (useful for testing)
   */
  public clear(): void {
    this.prefetchedRoutes.clear();
    this.prefetchQueue = [];
  }

  /**
   * Get prefetch statistics
   */
  public getStats(): { prefetched: number; queued: number } {
    return {
      prefetched: this.prefetchedRoutes.size,
      queued: this.prefetchQueue.length,
    };
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    this.clear();
  }
}

// Singleton instance
let prefetcherInstance: ResourcePrefetcher | null = null;

export function getPrefetcher(): ResourcePrefetcher {
  if (!prefetcherInstance) {
    prefetcherInstance = new ResourcePrefetcher();
  }
  return prefetcherInstance;
}

// Convenience exports
export const prefetchRoute = (path: string, options?: PrefetchOptions) => {
  getPrefetcher().prefetchRoute(path, options);
};

export const prefetchImage = (src: string) => {
  getPrefetcher().prefetchImage(src);
};

export const prefetchData = (url: string) => {
  return getPrefetcher().prefetchData(url);
};

export const onLinkHover = (href: string) => {
  getPrefetcher().onLinkHover(href);
};

export const onLinkVisible = (element: HTMLElement) => {
  getPrefetcher().onLinkVisible(element);
};

export default ResourcePrefetcher;
