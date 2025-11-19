/**
 * Packet Retry Service
 * 
 * Manages automatic retry logic for failed packet generation
 * with exponential backoff and retry limits.
 */

import { PrismaClient } from '@prisma/client';
import { PacketErrorHandler } from './packet-error-handler';

const prisma = new PrismaClient();

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  exponentialBase: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 5000, // 5 seconds
  maxDelayMs: 300000, // 5 minutes
  exponentialBase: 2
};

export class PacketRetryService {
  private config: RetryConfig;
  
  constructor(config: Partial<RetryConfig> = {}) {
    this.config = { ...DEFAULT_RETRY_CONFIG, ...config };
  }
  
  /**
   * Check if a packet should be retried
   */
  async shouldRetry(packetId: string): Promise<boolean> {
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      select: {
        retryCount: true,
        status: true,
        lastError: true
      }
    });
    
    if (!packet) {
      return false;
    }
    
    // Don't retry if already succeeded
    if (packet.status === 'READY') {
      return false;
    }
    
    // Check if under retry limit
    if (packet.retryCount >= this.config.maxRetries) {
      console.log(`[RetryService] Packet ${packetId} has exceeded max retries (${packet.retryCount}/${this.config.maxRetries})`);
      return false;
    }
    
    // Check if error is retryable (non-retryable errors like template/data errors shouldn't be retried)
    if (packet.lastError) {
      const isNonRetryable = 
        packet.lastError.includes('Template not found') ||
        packet.lastError.includes('Client not found') ||
        packet.lastError.includes('template') ||
        packet.lastError.includes('data');
      
      if (isNonRetryable) {
        console.log(`[RetryService] Packet ${packetId} has non-retryable error: ${packet.lastError}`);
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Calculate retry delay with exponential backoff
   */
  calculateRetryDelay(retryCount: number): number {
    // Exponential backoff: baseDelay * (exponentialBase ^ retryCount)
    const delay = this.config.baseDelayMs * Math.pow(this.config.exponentialBase, retryCount);
    
    // Cap at max delay
    return Math.min(delay, this.config.maxDelayMs);
  }
  
  /**
   * Schedule a packet for retry
   */
  async scheduleRetry(packetId: string): Promise<void> {
    const shouldRetry = await this.shouldRetry(packetId);
    
    if (!shouldRetry) {
      console.log(`[RetryService] Packet ${packetId} should not be retried`);
      return;
    }
    
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      select: { retryCount: true }
    });
    
    if (!packet) {
      throw new Error(`Packet not found: ${packetId}`);
    }
    
    const retryDelay = this.calculateRetryDelay(packet.retryCount);
    
    console.log(`[RetryService] Scheduling retry for packet ${packetId} in ${retryDelay}ms (attempt ${packet.retryCount + 1}/${this.config.maxRetries})`);
    
    // Schedule retry by resetting status to PENDING after delay
    setTimeout(async () => {
      try {
        await prisma.packet.update({
          where: { id: packetId },
          data: {
            status: 'PENDING',
            updatedAt: new Date()
          }
        });
        
        console.log(`[RetryService] Packet ${packetId} reset to PENDING for retry`);
      } catch (error) {
        console.error(`[RetryService] Failed to schedule retry for packet ${packetId}:`, error);
      }
    }, retryDelay);
  }
  
  /**
   * Retry a failed packet immediately (manual retry)
   */
  async retryNow(packetId: string, resetRetryCount: boolean = false): Promise<void> {
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      select: {
        status: true,
        retryCount: true
      }
    });
    
    if (!packet) {
      throw new Error(`Packet not found: ${packetId}`);
    }
    
    if (packet.status === 'READY') {
      throw new Error(`Packet ${packetId} is already completed`);
    }
    
    console.log(`[RetryService] Manually retrying packet ${packetId}`);
    
    await prisma.packet.update({
      where: { id: packetId },
      data: {
        status: 'PENDING',
        retryCount: resetRetryCount ? 0 : packet.retryCount,
        lastError: null,
        updatedAt: new Date()
      }
    });
  }
  
  /**
   * Get packets that are eligible for retry
   */
  async getRetryablePackets(): Promise<Array<{
    id: string;
    clientId: string;
    type: string;
    retryCount: number;
    lastError: string | null;
    updatedAt: Date;
  }>> {
    const failedPackets = await prisma.packet.findMany({
      where: {
        status: 'FAILED',
        retryCount: {
          lt: this.config.maxRetries
        }
      },
      select: {
        id: true,
        clientId: true,
        type: true,
        retryCount: true,
        lastError: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'asc'
      }
    });
    
    // Filter out non-retryable errors
    return failedPackets.filter((packet: { lastError: string | null }) => {
      if (!packet.lastError) {
        return true;
      }
      
      const isNonRetryable = 
        packet.lastError.includes('Template not found') ||
        packet.lastError.includes('Client not found') ||
        packet.lastError.includes('template') ||
        packet.lastError.includes('data');
      
      return !isNonRetryable;
    });
  }
  
  /**
   * Process all retryable packets
   */
  async processRetryablePackets(): Promise<void> {
    const retryablePackets = await this.getRetryablePackets();
    
    console.log(`[RetryService] Found ${retryablePackets.length} retryable packets`);
    
    for (const packet of retryablePackets) {
      try {
        await this.scheduleRetry(packet.id);
      } catch (error) {
        console.error(`[RetryService] Error scheduling retry for packet ${packet.id}:`, error);
      }
    }
  }
  
  /**
   * Get retry statistics
   */
  async getRetryStats(): Promise<{
    totalFailed: number;
    retryable: number;
    nonRetryable: number;
    exceededMaxRetries: number;
    averageRetryCount: number;
  }> {
    const failedPackets = await prisma.packet.findMany({
      where: {
        status: 'FAILED'
      },
      select: {
        id: true,
        retryCount: true,
        lastError: true
      }
    });
    
    let retryable = 0;
    let nonRetryable = 0;
    let exceededMaxRetries = 0;
    let totalRetryCount = 0;
    
    for (const packet of failedPackets) {
      totalRetryCount += packet.retryCount;
      
      if (packet.retryCount >= this.config.maxRetries) {
        exceededMaxRetries++;
      } else {
        const isNonRetryable = packet.lastError && (
          packet.lastError.includes('Template not found') ||
          packet.lastError.includes('Client not found') ||
          packet.lastError.includes('template') ||
          packet.lastError.includes('data')
        );
        
        if (isNonRetryable) {
          nonRetryable++;
        } else {
          retryable++;
        }
      }
    }
    
    return {
      totalFailed: failedPackets.length,
      retryable,
      nonRetryable,
      exceededMaxRetries,
      averageRetryCount: failedPackets.length > 0 
        ? totalRetryCount / failedPackets.length 
        : 0
    };
  }
}

// Singleton instance
let retryServiceInstance: PacketRetryService | null = null;

/**
 * Get the global retry service instance
 */
export function getRetryService(config?: Partial<RetryConfig>): PacketRetryService {
  if (!retryServiceInstance) {
    retryServiceInstance = new PacketRetryService(config);
  }
  return retryServiceInstance;
}
