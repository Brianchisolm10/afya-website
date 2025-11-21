import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { jobQueue } from '@/lib/intake/job-queue';

/**
 * Job Queue Monitoring API
 * 
 * Provides real-time job queue statistics and health information.
 * Requires admin authentication.
 */
export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get queue statistics
    const stats = await jobQueue.getStats();
    
    // Calculate health metrics
    const totalJobs = stats.pending + stats.active + stats.completed + stats.failed;
    const successRate = totalJobs > 0
      ? ((stats.completed / totalJobs) * 100).toFixed(2)
      : 100;
    const failureRate = totalJobs > 0
      ? ((stats.failed / totalJobs) * 100).toFixed(2)
      : 0;

    // Determine queue health status
    let healthStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    const issues: string[] = [];

    if (stats.pending > 50) {
      healthStatus = 'warning';
      issues.push('Queue is backed up with many pending jobs');
    }

    if (stats.pending > 100) {
      healthStatus = 'critical';
      issues.push('Queue is critically backed up');
    }

    if (stats.failed > stats.completed * 0.1) {
      healthStatus = healthStatus === 'critical' ? 'critical' : 'warning';
      issues.push('High job failure rate detected');
    }

    if (stats.active === 0 && stats.pending > 0) {
      healthStatus = 'warning';
      issues.push('No active workers processing pending jobs');
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      health: {
        status: healthStatus,
        issues: issues.length > 0 ? issues : ['No issues detected'],
      },
      statistics: {
        pending: stats.pending,
        active: stats.active,
        completed: stats.completed,
        failed: stats.failed,
        total: totalJobs,
      },
      metrics: {
        successRate: `${successRate}%`,
        failureRate: `${failureRate}%`,
        throughput: stats.completed,
      },
      recommendations: this.getRecommendations(stats, healthStatus),
    });
  } catch (error) {
    console.error('[Queue Monitoring] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch queue statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function getRecommendations(
  stats: { pending: number; active: number; completed: number; failed: number },
  healthStatus: string
): string[] {
  const recommendations: string[] = [];

  if (healthStatus === 'critical') {
    recommendations.push('Immediate action required: Check worker processes');
    recommendations.push('Consider scaling up worker capacity');
  }

  if (stats.pending > 50) {
    recommendations.push('Monitor queue depth closely');
    recommendations.push('Consider adding more workers or optimizing job processing');
  }

  if (stats.failed > 10) {
    recommendations.push('Review failed jobs in admin panel');
    recommendations.push('Check error logs for common failure patterns');
  }

  if (stats.active === 0 && stats.pending > 0) {
    recommendations.push('Restart worker processes');
    recommendations.push('Check for worker crashes or hangs');
  }

  if (recommendations.length === 0) {
    recommendations.push('Queue is operating normally');
    recommendations.push('Continue monitoring for any changes');
  }

  return recommendations;
}
