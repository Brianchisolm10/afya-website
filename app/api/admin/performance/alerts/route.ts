import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * Performance thresholds for alerts
 */
const THRESHOLDS = {
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

interface Alert {
  type: 'warning' | 'error';
  message: string;
  page: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

/**
 * GET /api/admin/performance/alerts
 * Admin endpoint - retrieves performance alerts
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '1h':
        startDate.setHours(now.getHours() - 1);
        break;
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      default:
        startDate.setHours(now.getHours() - 24);
    }

    // Fetch recent metrics
    const metrics = await db.performanceMetric.findMany({
      where: {
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Detect alerts
    const alerts = detectAlerts(metrics);

    // Get summary statistics
    const summary = getAlertSummary(alerts);

    return NextResponse.json({
      alerts,
      summary,
      timeRange,
      count: alerts.length,
    });
  } catch (error) {
    console.error('Error fetching performance alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance alerts' },
      { status: 500 }
    );
  }
}

/**
 * Detect performance alerts from metrics
 */
function detectAlerts(metrics: any[]): Alert[] {
  const alerts: Alert[] = [];

  // Group metrics by page
  const byPage = new Map<string, any[]>();
  for (const metric of metrics) {
    if (!byPage.has(metric.pageName)) {
      byPage.set(metric.pageName, []);
    }
    byPage.get(metric.pageName)!.push(metric);
  }

  // Check each page
  for (const [pageName, pageMetrics] of byPage.entries()) {
    // Calculate averages for the page
    const avgMetrics = calculateAverages(pageMetrics);

    // Check LCP
    if (avgMetrics.lcp) {
      if (avgMetrics.lcp >= THRESHOLDS.lcp.critical) {
        alerts.push({
          type: 'error',
          message: `LCP is critically slow on ${pageName}`,
          page: pageName,
          metric: 'lcp',
          value: avgMetrics.lcp,
          threshold: THRESHOLDS.lcp.critical,
          timestamp: new Date(),
          severity: 'high',
        });
      } else if (avgMetrics.lcp >= THRESHOLDS.lcp.warning) {
        alerts.push({
          type: 'warning',
          message: `LCP is slower than recommended on ${pageName}`,
          page: pageName,
          metric: 'lcp',
          value: avgMetrics.lcp,
          threshold: THRESHOLDS.lcp.warning,
          timestamp: new Date(),
          severity: 'medium',
        });
      }
    }

    // Check FCP
    if (avgMetrics.fcp) {
      if (avgMetrics.fcp >= THRESHOLDS.fcp.critical) {
        alerts.push({
          type: 'error',
          message: `FCP is critically slow on ${pageName}`,
          page: pageName,
          metric: 'fcp',
          value: avgMetrics.fcp,
          threshold: THRESHOLDS.fcp.critical,
          timestamp: new Date(),
          severity: 'high',
        });
      } else if (avgMetrics.fcp >= THRESHOLDS.fcp.warning) {
        alerts.push({
          type: 'warning',
          message: `FCP is slower than recommended on ${pageName}`,
          page: pageName,
          metric: 'fcp',
          value: avgMetrics.fcp,
          threshold: THRESHOLDS.fcp.warning,
          timestamp: new Date(),
          severity: 'medium',
        });
      }
    }

    // Check FID
    if (avgMetrics.fid) {
      if (avgMetrics.fid >= THRESHOLDS.fid.critical) {
        alerts.push({
          type: 'error',
          message: `FID is critically high on ${pageName}`,
          page: pageName,
          metric: 'fid',
          value: avgMetrics.fid,
          threshold: THRESHOLDS.fid.critical,
          timestamp: new Date(),
          severity: 'high',
        });
      } else if (avgMetrics.fid >= THRESHOLDS.fid.warning) {
        alerts.push({
          type: 'warning',
          message: `FID is higher than recommended on ${pageName}`,
          page: pageName,
          metric: 'fid',
          value: avgMetrics.fid,
          threshold: THRESHOLDS.fid.warning,
          timestamp: new Date(),
          severity: 'medium',
        });
      }
    }

    // Check CLS
    if (avgMetrics.cls) {
      if (avgMetrics.cls >= THRESHOLDS.cls.critical) {
        alerts.push({
          type: 'error',
          message: `CLS is critically high on ${pageName}`,
          page: pageName,
          metric: 'cls',
          value: avgMetrics.cls,
          threshold: THRESHOLDS.cls.critical,
          timestamp: new Date(),
          severity: 'high',
        });
      } else if (avgMetrics.cls >= THRESHOLDS.cls.warning) {
        alerts.push({
          type: 'warning',
          message: `CLS is higher than recommended on ${pageName}`,
          page: pageName,
          metric: 'cls',
          value: avgMetrics.cls,
          threshold: THRESHOLDS.cls.warning,
          timestamp: new Date(),
          severity: 'medium',
        });
      }
    }

    // Check TTFB
    if (avgMetrics.ttfb) {
      if (avgMetrics.ttfb >= THRESHOLDS.ttfb.critical) {
        alerts.push({
          type: 'error',
          message: `TTFB is critically slow on ${pageName}`,
          page: pageName,
          metric: 'ttfb',
          value: avgMetrics.ttfb,
          threshold: THRESHOLDS.ttfb.critical,
          timestamp: new Date(),
          severity: 'high',
        });
      } else if (avgMetrics.ttfb >= THRESHOLDS.ttfb.warning) {
        alerts.push({
          type: 'warning',
          message: `TTFB is slower than recommended on ${pageName}`,
          page: pageName,
          metric: 'ttfb',
          value: avgMetrics.ttfb,
          threshold: THRESHOLDS.ttfb.warning,
          timestamp: new Date(),
          severity: 'low',
        });
      }
    }

    // Check Page Load Time
    if (avgMetrics.pageLoadTime) {
      if (avgMetrics.pageLoadTime >= THRESHOLDS.pageLoadTime.critical) {
        alerts.push({
          type: 'error',
          message: `Page load time is critically slow on ${pageName}`,
          page: pageName,
          metric: 'pageLoadTime',
          value: avgMetrics.pageLoadTime,
          threshold: THRESHOLDS.pageLoadTime.critical,
          timestamp: new Date(),
          severity: 'high',
        });
      } else if (avgMetrics.pageLoadTime >= THRESHOLDS.pageLoadTime.warning) {
        alerts.push({
          type: 'warning',
          message: `Page load time is slower than recommended on ${pageName}`,
          page: pageName,
          metric: 'pageLoadTime',
          value: avgMetrics.pageLoadTime,
          threshold: THRESHOLDS.pageLoadTime.warning,
          timestamp: new Date(),
          severity: 'medium',
        });
      }
    }
  }

  // Sort by severity
  return alerts.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
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
 * Get alert summary statistics
 */
function getAlertSummary(alerts: Alert[]) {
  return {
    total: alerts.length,
    critical: alerts.filter(a => a.type === 'error').length,
    warnings: alerts.filter(a => a.type === 'warning').length,
    byPage: getAlertsByPage(alerts),
    bySeverity: {
      high: alerts.filter(a => a.severity === 'high').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      low: alerts.filter(a => a.severity === 'low').length,
    },
  };
}

/**
 * Group alerts by page
 */
function getAlertsByPage(alerts: Alert[]) {
  const byPage = new Map<string, number>();
  
  for (const alert of alerts) {
    byPage.set(alert.page, (byPage.get(alert.page) || 0) + 1);
  }

  return Object.fromEntries(byPage);
}
