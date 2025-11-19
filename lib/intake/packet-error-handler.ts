/**
 * Packet Error Handler
 * 
 * Centralized error handling for packet generation with logging,
 * status updates, and retry management.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type PacketErrorType = 
  | 'TEMPLATE_ERROR'
  | 'DATA_ERROR'
  | 'AI_ERROR'
  | 'EXPORT_ERROR'
  | 'DATABASE_ERROR'
  | 'UNKNOWN_ERROR';

export interface PacketGenerationError {
  packetId: string;
  clientId: string;
  packetType: string;
  errorType: PacketErrorType;
  message: string;
  stack?: string;
  retryable: boolean;
  timestamp: Date;
}

export class PacketErrorHandler {
  /**
   * Handle packet generation error
   * Logs error, updates packet status, and determines retry strategy
   */
  static async handleGenerationError(
    error: Error | unknown,
    packetId: string,
    clientId: string,
    packetType: string
  ): Promise<void> {
    // Classify the error
    const classifiedError = this.classifyError(error, packetId, clientId, packetType);
    
    // Log the error
    await this.logError(classifiedError);
    
    // Update packet status to FAILED
    const updatedPacket = await this.updatePacketStatus(
      packetId,
      classifiedError.message
    );
    
    // Log to console for immediate visibility
    console.error(`[PacketErrorHandler] Packet generation failed:`, {
      packetId,
      clientId,
      packetType,
      errorType: classifiedError.errorType,
      message: classifiedError.message,
      retryCount: updatedPacket.retryCount,
      retryable: classifiedError.retryable
    });
  }
  
  /**
   * Classify error type and determine if retryable
   */
  private static classifyError(
    error: Error | unknown,
    packetId: string,
    clientId: string,
    packetType: string
  ): PacketGenerationError {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    let errorType: PacketErrorType = 'UNKNOWN_ERROR';
    let retryable = true;
    
    // Classify based on error message patterns
    if (errorMessage.includes('template') || errorMessage.includes('Template')) {
      errorType = 'TEMPLATE_ERROR';
      retryable = false; // Template errors need manual fix
    } else if (errorMessage.includes('Client not found') || errorMessage.includes('data')) {
      errorType = 'DATA_ERROR';
      retryable = false; // Data errors need manual fix
    } else if (errorMessage.includes('AI') || errorMessage.includes('API')) {
      errorType = 'AI_ERROR';
      retryable = true; // AI errors can be retried
    } else if (errorMessage.includes('PDF') || errorMessage.includes('export')) {
      errorType = 'EXPORT_ERROR';
      retryable = true; // Export errors can be retried
    } else if (errorMessage.includes('database') || errorMessage.includes('Prisma')) {
      errorType = 'DATABASE_ERROR';
      retryable = true; // Database errors can be retried
    }
    
    return {
      packetId,
      clientId,
      packetType,
      errorType,
      message: errorMessage,
      stack: errorStack,
      retryable,
      timestamp: new Date()
    };
  }
  
  /**
   * Update packet status to FAILED and increment retry count
   */
  private static async updatePacketStatus(
    packetId: string,
    errorMessage: string
  ): Promise<{ retryCount: number }> {
    const updatedPacket = await prisma.packet.update({
      where: { id: packetId },
      data: {
        status: 'FAILED',
        lastError: errorMessage.substring(0, 500), // Limit error message length
        retryCount: { increment: 1 },
        updatedAt: new Date()
      },
      select: {
        retryCount: true
      }
    });
    
    return updatedPacket;
  }
  
  /**
   * Log error to database for audit trail
   */
  private static async logError(error: PacketGenerationError): Promise<void> {
    try {
      // Create audit log entry
      await prisma.auditLog.create({
        data: {
          userId: 'SYSTEM',
          action: 'PACKET_GENERATION_ERROR',
          resourceType: 'PACKET',
          resourceId: error.packetId,
          details: {
            clientId: error.clientId,
            packetType: error.packetType,
            errorType: error.errorType,
            message: error.message,
            stack: error.stack,
            retryable: error.retryable,
            timestamp: error.timestamp.toISOString()
          },
          ipAddress: 'internal',
          userAgent: 'packet-worker'
        }
      });
    } catch (logError) {
      // If logging fails, at least log to console
      console.error('[PacketErrorHandler] Failed to log error to database:', logError);
    }
  }
  
  /**
   * Get error statistics for monitoring
   */
  static async getErrorStats(timeRangeHours: number = 24): Promise<{
    totalErrors: number;
    errorsByType: Record<PacketErrorType, number>;
    errorsByPacketType: Record<string, number>;
    recentErrors: Array<{
      packetId: string;
      clientId: string;
      packetType: string;
      errorType: string;
      message: string;
      timestamp: Date;
    }>;
  }> {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - timeRangeHours);
    
    // Get recent error logs
    const errorLogs = await prisma.auditLog.findMany({
      where: {
        action: 'PACKET_GENERATION_ERROR',
        createdAt: {
          gte: cutoffDate
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });
    
    // Aggregate statistics
    const errorsByType: Record<string, number> = {};
    const errorsByPacketType: Record<string, number> = {};
    const recentErrors: Array<any> = [];
    
    for (const log of errorLogs) {
      const details = log.details as any;
      
      // Count by error type
      const errorType = details.errorType || 'UNKNOWN_ERROR';
      errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;
      
      // Count by packet type
      const packetType = details.packetType || 'UNKNOWN';
      errorsByPacketType[packetType] = (errorsByPacketType[packetType] || 0) + 1;
      
      // Add to recent errors
      if (recentErrors.length < 20) {
        recentErrors.push({
          packetId: details.packetId || log.resourceId,
          clientId: details.clientId,
          packetType: details.packetType,
          errorType: details.errorType,
          message: details.message,
          timestamp: new Date(details.timestamp || log.createdAt)
        });
      }
    }
    
    return {
      totalErrors: errorLogs.length,
      errorsByType: errorsByType as Record<PacketErrorType, number>,
      errorsByPacketType,
      recentErrors
    };
  }
  
  /**
   * Check if a packet has exceeded max retry attempts
   */
  static async hasExceededMaxRetries(
    packetId: string,
    maxRetries: number = 3
  ): Promise<boolean> {
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      select: { retryCount: true }
    });
    
    return packet ? packet.retryCount >= maxRetries : false;
  }
  
  /**
   * Get failed packets that need attention
   */
  static async getFailedPacketsNeedingAttention(maxRetries: number = 3): Promise<Array<{
    id: string;
    clientId: string;
    type: string;
    retryCount: number;
    lastError: string | null;
    updatedAt: Date;
    client: {
      fullName: string;
      email: string;
    };
  }>> {
    const failedPackets = await prisma.packet.findMany({
      where: {
        status: 'FAILED',
        retryCount: {
          gte: maxRetries
        }
      },
      include: {
        client: {
          select: {
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    return failedPackets;
  }
}
