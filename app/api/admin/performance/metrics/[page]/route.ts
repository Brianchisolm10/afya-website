import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * GET /api/admin/performance/metrics/[page]
 * Admin endpoint - retrieves metrics for a specific page
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { page: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { page } = params;
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    const deviceType = searchParams.get('deviceType');

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Build where clause
    const where: any = {
      pageName: page,
      timestamp: {
        gte: startDate,
      },
    };

    if (deviceType) {
      where.deviceType = deviceType;
    }

    // Fetch metrics for this page
    const metrics = await db.performanceMetric.findMany({
      where,
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Calculate statistics
    const stats = calculatePageStats(metrics);

    // Group by device type
    const byDevice = groupByDevice(metrics);

    // Get time series data
    const timeSeries = getTimeSeries(metrics, timeRange);

    return NextResponse.json({
      page,
      stats,
      byDevice,
      timeSeries,
      sampleSize: metrics.length,
      timeRange,
    });
  } catch (error) {
    console.error('Error fetching page metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page metrics' },
      { status: 500 }
    );
  }
}

/**
 * Calculate statistics for a page
 */
function calculatePageStats(metrics: any[]) {
  if (metrics.length === 0) {
    return {
      avgLoadTime: 0,
      p50LoadTime: 0,
      p95LoadTime: 0,
      avgLCP: 0,
      avgFCP: 0,
      avgFID: 0,
      avgCLS: 0,
      passingVitals: 0,
    };
  }

  const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const percentile = (arr: number[], p: number) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  };

  const loadTimes = metrics.filter(m => m.pageLoadTime !== null).map(m => m.pageLoadTime);
  const lcpValues = metrics.filter(m => m.lcp !== null).map(m => m.lcp);
  const fcpValues = metrics.filter(m => m.fcp !== null).map(m => m.fcp);
  const fidValues = metrics.filter(m => m.fid !== null).map(m => m.fid);
  const clsValues = metrics.filter(m => m.cls !== null).map(m => m.cls);

  const passingCount = metrics.filter(m => {
    const lcpPass = !m.lcp || m.lcp <= 2500;
    const fidPass = !m.fid || m.fid <= 100;
    const clsPass = !m.cls || m.cls <= 0.1;
    return lcpPass && fidPass && clsPass;
  }).length;

  return {
    avgLoadTime: Math.round(avg(loadTimes)),
    p50LoadTime: Math.round(percentile(loadTimes, 50)),
    p95LoadTime: Math.round(percentile(loadTimes, 95)),
    avgLCP: Math.round(avg(lcpValues)),
    avgFCP: Math.round(avg(fcpValues)),
    avgFID: Math.round(avg(fidValues)),
    avgCLS: parseFloat(avg(clsValues).toFixed(3)),
    passingVitals: Math.round((passingCount / metrics.length) * 100),
  };
}

/**
 * Group metrics by device type
 */
function groupByDevice(metrics: any[]) {
  const devices = ['mobile', 'tablet', 'desktop'];
  const result: any = {};

  for (const device of devices) {
    const deviceMetrics = metrics.filter(m => m.deviceType === device);
    result[device] = calculatePageStats(deviceMetrics);
  }

  return result;
}

/**
 * Get time series data for charting
 */
function getTimeSeries(metrics: any[], timeRange: string) {
  // Determine bucket size based on time range
  let bucketSize: number;
  switch (timeRange) {
    case '24h':
      bucketSize = 60 * 60 * 1000; // 1 hour
      break;
    case '7d':
      bucketSize = 24 * 60 * 60 * 1000; // 1 day
      break;
    case '30d':
      bucketSize = 24 * 60 * 60 * 1000; // 1 day
      break;
    case '90d':
      bucketSize = 7 * 24 * 60 * 60 * 1000; // 1 week
      break;
    default:
      bucketSize = 24 * 60 * 60 * 1000; // 1 day
  }

  // Group metrics into time buckets
  const buckets = new Map<number, any[]>();
  
  for (const metric of metrics) {
    const timestamp = new Date(metric.timestamp).getTime();
    const bucketKey = Math.floor(timestamp / bucketSize) * bucketSize;
    
    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, []);
    }
    buckets.get(bucketKey)!.push(metric);
  }

  // Calculate averages for each bucket
  const timeSeries = Array.from(buckets.entries())
    .map(([timestamp, bucketMetrics]) => {
      const stats = calculatePageStats(bucketMetrics);
      return {
        timestamp: new Date(timestamp).toISOString(),
        ...stats,
      };
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return timeSeries;
}
