/**
 * Queue Monitor
 * 
 * Monitors job queue health and performance.
 */

import { jobQueue } from '@/lib/intake/job-queue';
import { logger } from './logger';
import { alertQueueBackup, alertHighFailureRate } from './alerts';

interface QueueStats {
  pending: number;
  active: number;
  completed: number;
  failed: number;
}

export class QueueMonitor {
  private checkInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  /**
   * Start monitoring the queue
   */
  start(intervalMs: number = 60000): void {
    if (this.isRunning) {
      logger.warn('Queue monitor is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting queue monitor', { interval: `${intervalMs}ms` });

    // Initial check
    this.checkQueueHealth();

    // Schedule periodic checks
    this.checkInterval = setInterval(() => {
      this.checkQueueHealth();
    }, intervalMs);
  }

  /**
   * Stop monitoring the queue
   */
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isRunning = false;
    logger.info('Stopped queue monitor');
  }

  /**
   * Check queue health and send alerts if needed
   */
  private async checkQueueHealth(): Promise<void> {
    try {
      const stats = await jobQueue.getStats();
      
      // Log current stats
      logger.info('Queue health check', stats);

      // Check for backed up queue
      if (stats.pending > 50) {
        await alertQueueBackup(stats.pending, {
          active: stats.active,
          completed: stats.completed,
          failed: stats.failed,
        });
      }

      // Check for high failure rate
      const totalJobs = stats.completed + stats.failed;
      if (totalJobs > 0) {
        const failureRate = (stats.failed / totalJobs) * 100;
        if (failureRate > 10) {
          await alertHighFailureRate(failureRate, {
            failed: stats.failed,
            completed: stats.completed,
            total: totalJobs,
          });
        }
      }

      // Check for stalled workers
      if (stats.active === 0 && stats.pending > 0) {
        logger.warn('No active workers but jobs are pending', {
          pending: stats.pending,
        });
      }
    } catch (error) {
      logger.error('Queue health check failed', error);
    }
  }

  /**
   * Get current queue metrics
   */
  async getMetrics(): Promise<QueueStats> {
    return await jobQueue.getStats();
  }

  /**
   * Get queue health status
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    stats: QueueStats;
  }> {
    const stats = await this.getMetrics();
    const issues: string[] = [];
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    // Check for backed up queue
    if (stats.pending > 100) {
      status = 'critical';
      issues.push('Queue is critically backed up (>100 pending jobs)');
    } else if (stats.pending > 50) {
      status = status === 'critical' ? 'critical' : 'warning';
      issues.push('Queue is backed up (>50 pending jobs)');
    }

    // Check for high failure rate
    const totalJobs = stats.completed + stats.failed;
    if (totalJobs > 0) {
      const failureRate = (stats.failed / totalJobs) * 100;
      if (failureRate > 20) {
        status = 'critical';
        issues.push(`Very high failure rate (${failureRate.toFixed(2)}%)`);
      } else if (failureRate > 10) {
        status = status === 'critical' ? 'critical' : 'warning';
        issues.push(`High failure rate (${failureRate.toFixed(2)}%)`);
      }
    }

    // Check for stalled workers
    if (stats.active === 0 && stats.pending > 0) {
      status = status === 'critical' ? 'critical' : 'warning';
      issues.push('No active workers processing pending jobs');
    }

    if (issues.length === 0) {
      issues.push('Queue is operating normally');
    }

    return { status, issues, stats };
  }
}

// Export singleton instance
export const queueMonitor = new QueueMonitor();

// Auto-start in production
if (process.env.NODE_ENV === 'production') {
  queueMonitor.start();
}
