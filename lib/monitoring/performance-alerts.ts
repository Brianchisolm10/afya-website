/**
 * Performance Alert Service
 * 
 * Monitors performance metrics and sends alerts when thresholds are exceeded
 */

import { prisma as db } from '@/lib/db';
import {
  alertPerformanceDegradation,
  alertCriticalWebVitals,
  alertHighPageLoadTime,
} from './alerts';

/**
 * Performance thresholds for alerts
 */
export const PERFORMANCE_THRESHOLDS = {
  lcp: {
    warning: 2500,  // 2.5s
    critical: 4000, // 4s
  },
  fcp: {
    warning: 1800,  // 1.8s
    critical: 3000, // 3s
  },
  fid: {
    warning: 100,   // 100ms
    critical: 300,  // 300ms
  },
  cls: {
    warning: 0.1,
    critical: 0.25,
  },
  ttfb: {
    warning: 800,   // 800ms
    critical: 1800, // 1.8s
  },
  pageLoadTime: {
    warning: 3000,  // 3s
    critical: 5000, // 5s
  },
};

/**
 * Check performance metrics and send alerts if needed
 */
export async function checkPerformanceMetrics(): Promise<void> {
  try {
    // Get metrics from the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const metrics = await db.performanceMetric.findMany({
      where: {
        timestamp: {
          gte: oneHourAgo,
        },
      },
    });

    if (metrics.length === 0) {
      return;
    }

    // Group by page
    const byPage = new Map<string, any[]>();
    for (const metric of metrics) {
      if (!byPage.has(metric.pageName)) {
        byPage.set(metric.pageName, []);
      }
      byPage.get(metric.pageName)!.push(metric);
    }

    // Check each page
    const pages = Array.from(byPage.entries());
    for (const [pageName, pageMetrics] of pages) {
      await checkPagePerformance(pageName, pageMetrics);
    }
  } catch (error) {
    console.error('Error checking performance metrics:', error);
  }
}

/**
 * Check performance for a specific page
 */
async function checkPagePerformance(pageName: string, metrics: any[]): Promise<void> {
  const avgMetrics = calculateAverages(metrics);
  const failingMetrics: string[] = [];

  // Check LCP
  if (avgMetrics.lcp && avgMetrics.lcp >= PERFORMANCE_THRESHOLDS.lcp.critical) {
    failingMetrics.push('LCP');
    await alertPerformanceDegradation(
      pageName,
      'lcp',
      avgMetrics.lcp,
      PERFORMANCE_THRESHOLDS.lcp.critical,
      {
        sampleSize: metrics.length,
        deviceBreakdown: getDeviceBreakdown(metrics, 'lcp'),
      }
    );
  }

  // Check FCP
  if (avgMetrics.fcp && avgMetrics.fcp >= PERFORMANCE_THRESHOLDS.fcp.critical) {
    failingMetrics.push('FCP');
    await alertPerformanceDegradation(
      pageName,
      'fcp',
      avgMetrics.fcp,
      PERFORMANCE_THRESHOLDS.fcp.critical,
      {
        sampleSize: metrics.length,
        deviceBreakdown: getDeviceBreakdown(metrics, 'fcp'),
      }
    );
  }

  // Check FID
  if (avgMetrics.fid && avgMetrics.fid >= PERFORMANCE_THRESHOLDS.fid.critical) {
    failingMetrics.push('FID');
    await alertPerformanceDegradation(
      pageName,
      'fid',
      avgMetrics.fid,
      PERFORMANCE_THRESHOLDS.fid.critical,
      {
        sampleSize: metrics.length,
        deviceBreakdown: getDeviceBreakdown(metrics, 'fid'),
      }
    );
  }

  // Check CLS
  if (avgMetrics.cls && avgMetrics.cls >= PERFORMANCE_THRESHOLDS.cls.critical) {
    failingMetrics.push('CLS');
    await alertPerformanceDegradation(
      pageName,
      'cls',
      avgMetrics.cls,
      PERFORMANCE_THRESHOLDS.cls.critical,
      {
        sampleSize: metrics.length,
        deviceBreakdown: getDeviceBreakdown(metrics, 'cls'),
      }
    );
  }

  // Check Page Load Time
  if (avgMetrics.pageLoadTime && avgMetrics.pageLoadTime >= PERFORMANCE_THRESHOLDS.pageLoadTime.critical) {
    await alertHighPageLoadTime(
      pageName,
      avgMetrics.pageLoadTime,
      {
        sampleSize: metrics.length,
        deviceBreakdown: getDeviceBreakdown(metrics, 'pageLoadTime'),
      }
    );
  }

  // Send critical alert if multiple metrics are failing
  if (failingMetrics.length >= 2) {
    await alertCriticalWebVitals(pageName, failingMetrics, {
      sampleSize: metrics.length,
      avgLCP: avgMetrics.lcp,
      avgFCP: avgMetrics.fcp,
      avgFID: avgMetrics.fid,
      avgCLS: avgMetrics.cls,
    });
  }
}

/**
 * Calculate average metrics
 */
function calculateAverages(metrics: any[]) {
  const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return {
    lcp: avg(metrics.filter(m => m.lcp !== null).map(m => m.lcp)),
    fcp: avg(metrics.filter(m => m.fcp !== null).map(m => m.fcp)),
    fid: avg(metrics.filter(m => m.fid !== null).map(m => m.fid)),
    cls: avg(metrics.filter(m => m.cls !== null).map(m => m.cls)),
    ttfb: avg(metrics.filter(m => m.ttfb !== null).map(m => m.ttfb)),
    pageLoadTime: avg(metrics.filter(m => m.pageLoadTime !== null).map(m => m.pageLoadTime)),
  };
}

/**
 * Get device breakdown for a metric
 */
function getDeviceBreakdown(metrics: any[], metricName: string): string {
  const devices = ['mobile', 'tablet', 'desktop'];
  const breakdown: string[] = [];

  for (const device of devices) {
    const deviceMetrics = metrics.filter(m => m.deviceType === device && m[metricName] !== null);
    if (deviceMetrics.length > 0) {
      const avg = deviceMetrics.reduce((sum, m) => sum + m[metricName], 0) / deviceMetrics.length;
      breakdown.push(`${device}: ${Math.round(avg)}${metricName === 'cls' ? '' : 'ms'}`);
    }
  }

  return breakdown.join(', ');
}

/**
 * Schedule periodic performance checks
 * This should be called from a cron job or scheduled task
 */
export function schedulePerformanceChecks(): void {
  // Check every hour
  const interval = 60 * 60 * 1000; // 1 hour

  setInterval(async () => {
    await checkPerformanceMetrics();
  }, interval);

  // Run immediately on startup
  checkPerformanceMetrics();
}
