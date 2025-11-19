/**
 * Background Job Queue System
 * 
 * A simple database-backed job queue for packet generation.
 * Uses Prisma to store and manage jobs with retry logic and monitoring.
 */

import { PrismaClient } from '@prisma/client';
import { getRetryService } from './packet-retry-service';
import { PacketNotificationService } from './packet-notification-service';

const prisma = new PrismaClient();

export type JobType = 'PACKET_GENERATION';

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface JobData {
  clientId: string;
  packetId: string;
  packetType: string;
  [key: string]: any;
}

export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  data: JobData;
  attempts: number;
  maxAttempts: number;
  lastError?: string | null;
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date | null;
}

export interface JobQueueConfig {
  maxAttempts?: number;
  retryDelayMs?: number;
  processingTimeoutMs?: number;
}

const DEFAULT_CONFIG: Required<JobQueueConfig> = {
  maxAttempts: 3,
  retryDelayMs: 5000, // 5 seconds
  processingTimeoutMs: 300000 // 5 minutes
};

/**
 * Job Queue Service
 * Manages background job processing with retry logic
 */
export class JobQueue {
  private config: Required<JobQueueConfig>;
  private isProcessing: boolean = false;
  private processingInterval?: NodeJS.Timeout;

  constructor(config: JobQueueConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Add a new job to the queue
   */
  async enqueue(type: JobType, data: JobData): Promise<string> {
    // Create job record in database
    // Note: We'll need to add a Job model to Prisma schema
    // For now, we'll use the Packet model's status to track jobs
    
    console.log(`[JobQueue] Enqueuing job: ${type}`, data);
    
    // Update packet status to PENDING if not already
    await prisma.packet.update({
      where: { id: data.packetId },
      data: {
        status: 'PENDING',
        updatedAt: new Date()
      }
    });
    
    return data.packetId;
  }

  /**
   * Process pending jobs
   * This should be called periodically or triggered by events
   */
  async processPendingJobs(processor: (job: JobData) => Promise<void>): Promise<void> {
    if (this.isProcessing) {
      console.log('[JobQueue] Already processing jobs, skipping...');
      return;
    }

    this.isProcessing = true;

    try {
      // Find pending packets that need generation
      const pendingPackets = await prisma.packet.findMany({
        where: {
          status: 'PENDING',
          retryCount: {
            lt: this.config.maxAttempts
          }
        },
        include: {
          client: true
        },
        take: 10, // Process up to 10 jobs at a time
        orderBy: {
          createdAt: 'asc'
        }
      });

      console.log(`[JobQueue] Found ${pendingPackets.length} pending jobs`);

      for (const packet of pendingPackets) {
        try {
          // Update status to GENERATING
          await prisma.packet.update({
            where: { id: packet.id },
            data: {
              status: 'GENERATING',
              updatedAt: new Date()
            }
          });

          // Process the job
          const jobData: JobData = {
            clientId: packet.clientId,
            packetId: packet.id,
            packetType: packet.type
          };

          await processor(jobData);

          console.log(`[JobQueue] Successfully processed job: ${packet.id}`);
        } catch (error) {
          console.error(`[JobQueue] Error processing job ${packet.id}:`, error);
          
          // Error is already handled by PacketErrorHandler in the generation service
          // Now handle retry logic
          const retryService = getRetryService({
            maxRetries: this.config.maxAttempts,
            baseDelayMs: this.config.retryDelayMs
          });
          
          // Check if we should retry
          const shouldRetry = await retryService.shouldRetry(packet.id);
          
          if (shouldRetry) {
            // Schedule retry with exponential backoff
            await retryService.scheduleRetry(packet.id);
          } else {
            console.error(`[JobQueue] Job ${packet.id} will not be retried`);
            
            // Notify admins if max retries exceeded
            await PacketNotificationService.notifyAdminsOfFailure(
              packet.id,
              this.config.maxAttempts
            );
          }
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Start automatic job processing
   * Polls for pending jobs at regular intervals
   */
  startProcessing(processor: (job: JobData) => Promise<void>, intervalMs: number = 10000): void {
    if (this.processingInterval) {
      console.log('[JobQueue] Processing already started');
      return;
    }

    console.log(`[JobQueue] Starting job processing (interval: ${intervalMs}ms)`);
    
    // Process immediately
    this.processPendingJobs(processor).catch(error => {
      console.error('[JobQueue] Error in initial processing:', error);
    });

    // Then process at intervals
    this.processingInterval = setInterval(() => {
      this.processPendingJobs(processor).catch(error => {
        console.error('[JobQueue] Error in interval processing:', error);
      });
    }, intervalMs);
  }

  /**
   * Stop automatic job processing
   */
  stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = undefined;
      console.log('[JobQueue] Stopped job processing');
    }
  }

  /**
   * Get job statistics
   */
  async getStats(): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  }> {
    const [pending, processing, completed, failed] = await Promise.all([
      prisma.packet.count({ where: { status: 'PENDING' } }),
      prisma.packet.count({ where: { status: 'GENERATING' } }),
      prisma.packet.count({ where: { status: 'READY' } }),
      prisma.packet.count({ 
        where: { 
          status: 'FAILED',
          retryCount: { gte: this.config.maxAttempts }
        } 
      })
    ]);

    return { pending, processing, completed, failed };
  }

  /**
   * Retry a failed job
   */
  async retryJob(packetId: string): Promise<void> {
    await prisma.packet.update({
      where: { id: packetId },
      data: {
        status: 'PENDING',
        retryCount: 0,
        lastError: null,
        updatedAt: new Date()
      }
    });

    console.log(`[JobQueue] Reset job ${packetId} for retry`);
  }

  /**
   * Clean up old completed jobs
   */
  async cleanupOldJobs(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // Note: We don't actually delete packets, just log what would be cleaned
    const oldPackets = await prisma.packet.count({
      where: {
        status: 'READY',
        updatedAt: {
          lt: cutoffDate
        }
      }
    });

    console.log(`[JobQueue] Found ${oldPackets} old completed jobs (older than ${daysOld} days)`);
    
    return oldPackets;
  }
}

// Singleton instance
let jobQueueInstance: JobQueue | null = null;

/**
 * Get the global job queue instance
 */
export function getJobQueue(config?: JobQueueConfig): JobQueue {
  if (!jobQueueInstance) {
    jobQueueInstance = new JobQueue(config);
  }
  return jobQueueInstance;
}

/**
 * Initialize job queue processing
 * Call this once when the application starts
 */
export function initializeJobQueue(
  processor: (job: JobData) => Promise<void>,
  config?: JobQueueConfig
): JobQueue {
  const queue = getJobQueue(config);
  
  // Start processing in development/production
  if (process.env.NODE_ENV !== 'test') {
    queue.startProcessing(processor);
  }
  
  return queue;
}
