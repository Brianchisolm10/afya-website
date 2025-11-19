/**
 * Packet Generation Worker
 * 
 * This module initializes and manages the background job processing
 * for packet generation. It connects the job queue with the packet
 * generation service.
 */

import { initializeJobQueue, JobData, getJobQueue } from './job-queue';
import { PacketGenerationService } from './packet-generation-service';
import { getRetryService } from './packet-retry-service';
import { PacketNotificationService } from './packet-notification-service';

/**
 * Process a packet generation job
 */
async function processPacketGenerationJob(job: JobData): Promise<void> {
  const { clientId, packetId, packetType } = job;
  
  console.log(`[PacketWorker] Processing packet generation job:`, {
    clientId,
    packetId,
    packetType
  });
  
  // Call the orchestration method
  await PacketGenerationService.orchestratePacketGeneration(
    clientId,
    packetId,
    packetType
  );
}

/**
 * Initialize the packet generation worker
 * This should be called once when the application starts
 */
export function initializePacketWorker(): void {
  console.log('[PacketWorker] Initializing packet generation worker...');
  
  initializeJobQueue(processPacketGenerationJob, {
    maxAttempts: 3,
    retryDelayMs: 5000,
    processingTimeoutMs: 300000 // 5 minutes
  });
  
  console.log('[PacketWorker] Packet generation worker initialized');
}

/**
 * Manually trigger packet generation for a specific packet
 * Useful for admin actions or testing
 */
export async function triggerPacketGeneration(
  clientId: string,
  packetId: string,
  packetType: string
): Promise<void> {
  const queue = getJobQueue();
  
  await queue.enqueue('PACKET_GENERATION', {
    clientId,
    packetId,
    packetType
  });
  
  console.log(`[PacketWorker] Enqueued packet generation for packet ${packetId}`);
}

/**
 * Get job queue statistics
 */
export async function getWorkerStats() {
  const queue = getJobQueue();
  return await queue.getStats();
}

/**
 * Retry a failed packet generation
 */
export async function retryPacketGeneration(
  packetId: string,
  resetRetryCount: boolean = false
): Promise<void> {
  const retryService = getRetryService();
  await retryService.retryNow(packetId, resetRetryCount);
  console.log(`[PacketWorker] Retrying packet generation for packet ${packetId}`);
}

/**
 * Get retry statistics
 */
export async function getRetryStats() {
  const retryService = getRetryService();
  return await retryService.getRetryStats();
}

/**
 * Process all retryable packets
 */
export async function processRetryablePackets(): Promise<void> {
  const retryService = getRetryService();
  await retryService.processRetryablePackets();
}

/**
 * Process pending admin notifications
 */
export async function processPendingNotifications(): Promise<void> {
  await PacketNotificationService.processPendingNotifications();
}

/**
 * Send test notification to admins
 */
export async function sendTestNotification(): Promise<void> {
  await PacketNotificationService.sendTestNotification();
}
