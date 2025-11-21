import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * POST /api/admin/performance/metrics
 * Public endpoint - receives performance metrics from client-side tracking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      pageName,
      url,
      metrics,
      deviceType,
      connectionType,
      userAgent,
    } = body;

    // Validate required fields
    if (!pageName || !url || !metrics) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create performance metric entry
    const metric = await db.performanceMetric.create({
      data: {
        pageName,
        url,
        fcp: metrics.fcp || null,
        lcp: metrics.lcp || null,
        fid: metrics.fid || null,
        cls: metrics.cls || null,
        ttfb: metrics.ttfb || null,
        pageLoadTime: metrics.pageLoadTime || null,
        deviceType: deviceType || null,
        connectionType: connectionType || null,
        userAgent: userAgent || null,
      },
    });

    return NextResponse.json({ success: true, id: metric.id });
  } catch (error) {
    console.error('Error saving performance metric:', error);
    return NextResponse.json(
      { error: 'Failed to save performance metric' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/performance/metrics
 * Admin endpoint - retrieves aggregated performance metrics
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
    const timeRange = searchParams.get('timeRange') || '7d';
    const page = searchParams.get('page');
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
      timestamp: {
        gte: startDate,
      },
    };

    if (page) {
      where.pageName = page;
    }

    if (deviceType) {
      where.deviceType = deviceType;
    }

    // Fetch metrics
    const metrics = await db.performanceMetric.findMany({
      where,
      orderBy: {
        timestamp: 'desc',
      },
      take: 1000, // Limit to prevent large responses
    });

    // Calculate aggregated statistics
    const aggregated = calculateAggregatedMetrics(metrics);

    return NextResponse.json({
      metrics,
      aggregated,
      timeRange,
      count: metrics.length,
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance metrics' },
      { status: 500 }
    );
  }
}

/**
 * Calculate aggregated metrics from raw data
 */
function calculateAggregatedMetrics(metrics: any[]) {
  if (metrics.length === 0) {
    return {
      avgFCP: 0,
      avgLCP: 0,
      avgFID: 0,
      avgCLS: 0,
      avgTTFB: 0,
      avgPageLoadTime: 0,
      p50LCP: 0,
      p75LCP: 0,
      p95LCP: 0,
      passingVitals: 0,
    };
  }

  // Filter out null values and calculate averages
  const fcpValues = metrics.filter(m => m.fcp !== null).map(m => m.fcp);
  const lcpValues = metrics.filter(m => m.lcp !== null).map(m => m.lcp);
  const fidValues = metrics.filter(m => m.fid !== null).map(m => m.fid);
  const clsValues = metrics.filter(m => m.cls !== null).map(m => m.cls);
  const ttfbValues = metrics.filter(m => m.ttfb !== null).map(m => m.ttfb);
  const pageLoadValues = metrics.filter(m => m.pageLoadTime !== null).map(m => m.pageLoadTime);

  const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const percentile = (arr: number[], p: number) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  };

  // Calculate passing vitals percentage
  const passingCount = metrics.filter(m => {
    const lcpPass = !m.lcp || m.lcp <= 2500;
    const fidPass = !m.fid || m.fid <= 100;
    const clsPass = !m.cls || m.cls <= 0.1;
    return lcpPass && fidPass && clsPass;
  }).length;

  return {
    avgFCP: Math.round(avg(fcpValues)),
    avgLCP: Math.round(avg(lcpValues)),
    avgFID: Math.round(avg(fidValues)),
    avgCLS: parseFloat(avg(clsValues).toFixed(3)),
    avgTTFB: Math.round(avg(ttfbValues)),
    avgPageLoadTime: Math.round(avg(pageLoadValues)),
    p50LCP: Math.round(percentile(lcpValues, 50)),
    p75LCP: Math.round(percentile(lcpValues, 75)),
    p95LCP: Math.round(percentile(lcpValues, 95)),
    passingVitals: Math.round((passingCount / metrics.length) * 100),
  };
}
