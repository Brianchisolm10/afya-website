// Performance monitoring utilities for tracking Core Web Vitals and custom metrics

export interface PerformanceMetrics {
  fcp?: number;  // First Contentful Paint
  lcp?: number;  // Largest Contentful Paint
  fid?: number;  // First Input Delay
  cls?: number;  // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  pageLoadTime?: number;
}

export interface PerformanceEntry {
  pageName: string;
  url: string;
  metrics: PerformanceMetrics;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  connectionType: string;
  userAgent: string;
  timestamp: Date;
}

class PerformanceMonitorService {
  private metrics: Map<string, number> = new Map();
  private reportingEnabled: boolean = true;
  private batchQueue: PerformanceEntry[] = [];
  private batchSize: number = 10;
  private batchTimeout: number = 30000; // 30 seconds
  private batchTimer: NodeJS.Timeout | null = null;

  /**
   * Track a custom metric
   */
  trackMetric(name: string, value: number): void {
    this.metrics.set(name, value);
  }

  /**
   * Get device type based on screen width
   */
  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * Get connection type from Network Information API
   */
  private getConnectionType(): string {
    if (typeof navigator === 'undefined') return 'unknown';
    
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (connection) {
      return connection.effectiveType || connection.type || 'unknown';
    }
    
    return 'unknown';
  }

  /**
   * Report Web Vitals to API endpoint
   */
  async reportWebVitals(
    metricName: string,
    value: number,
    pathname: string
  ): Promise<void> {
    if (!this.reportingEnabled) return;

    // Store metric
    this.trackMetric(metricName, value);

    // Create entry
    const entry: PerformanceEntry = {
      pageName: this.getPageName(pathname),
      url: pathname,
      metrics: {
        [metricName]: value,
      },
      deviceType: this.getDeviceType(),
      connectionType: this.getConnectionType(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date(),
    };

    // Add to batch queue
    this.batchQueue.push(entry);

    // Send batch if size reached
    if (this.batchQueue.length >= this.batchSize) {
      await this.sendBatch();
    } else {
      // Set timer to send batch after timeout
      this.scheduleBatchSend();
    }
  }

  /**
   * Schedule batch send after timeout
   */
  private scheduleBatchSend(): void {
    if (this.batchTimer) return;

    this.batchTimer = setTimeout(() => {
      this.sendBatch();
    }, this.batchTimeout);
  }

  /**
   * Send batched metrics to API
   */
  private async sendBatch(): Promise<void> {
    if (this.batchQueue.length === 0) return;

    // Clear timer
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    // Get batch to send
    const batch = [...this.batchQueue];
    this.batchQueue = [];

    try {
      // Aggregate metrics by page
      const aggregated = this.aggregateMetrics(batch);

      // Send each aggregated entry
      for (const entry of aggregated) {
        await fetch('/api/admin/performance/metrics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry),
          // Use keepalive to ensure request completes even if page unloads
          keepalive: true,
        }).catch((error) => {
          console.error('Failed to report performance metrics:', error);
        });
      }
    } catch (error) {
      console.error('Error sending performance batch:', error);
    }
  }

  /**
   * Aggregate metrics by page
   */
  private aggregateMetrics(entries: PerformanceEntry[]): PerformanceEntry[] {
    const grouped = new Map<string, PerformanceEntry>();

    for (const entry of entries) {
      const key = `${entry.pageName}-${entry.deviceType}`;
      
      if (grouped.has(key)) {
        const existing = grouped.get(key)!;
        // Merge metrics
        existing.metrics = {
          ...existing.metrics,
          ...entry.metrics,
        };
      } else {
        grouped.set(key, entry);
      }
    }

    return Array.from(grouped.values());
  }

  /**
   * Get page name from pathname
   */
  private getPageName(pathname: string): string {
    // Remove leading/trailing slashes
    const clean = pathname.replace(/^\/|\/$/g, '');
    
    // Handle home page
    if (!clean) return 'home';
    
    // Get first segment
    const segments = clean.split('/');
    return segments[0] || 'home';
  }

  /**
   * Track page load time
   */
  trackPageLoad(pageName: string): void {
    if (typeof window === 'undefined') return;

    // Use Navigation Timing API
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        this.reportWebVitals('pageLoadTime', pageLoadTime, window.location.pathname);
      }, 0);
    });
  }

  /**
   * Enable or disable reporting
   */
  setReportingEnabled(enabled: boolean): void {
    this.reportingEnabled = enabled;
  }

  /**
   * Get all tracked metrics
   */
  getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Flush any pending batched metrics
   */
  async flush(): Promise<void> {
    await this.sendBatch();
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitorService();

/**
 * Hook to track Web Vitals in React components
 */
export function usePerformanceMonitoring(pageName: string) {
  if (typeof window === 'undefined') return;

  // Track page load
  performanceMonitor.trackPageLoad(pageName);

  // Flush metrics on page unload
  const handleUnload = () => {
    performanceMonitor.flush();
  };

  window.addEventListener('beforeunload', handleUnload);

  return () => {
    window.removeEventListener('beforeunload', handleUnload);
  };
}

/**
 * Report a single Web Vital metric
 */
export async function reportWebVitals(
  name: string,
  value: number,
  pathname: string
): Promise<void> {
  await performanceMonitor.reportWebVitals(name, value, pathname);
}
