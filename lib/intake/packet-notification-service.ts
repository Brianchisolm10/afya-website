/**
 * Packet Notification Service
 * 
 * Handles notifications for packet generation events,
 * including success notifications to clients and failure notifications to admins.
 */

import { PrismaClient } from '@prisma/client';
import { 
  sendPacketFailureNotification, 
  sendPacketReadyEmail,
  sendPacketUpdatedEmail 
} from '@/lib/email';

const prisma = new PrismaClient();

export class PacketNotificationService {
  /**
   * Notify admins about a packet generation failure
   */
  static async notifyAdminsOfFailure(
    packetId: string,
    maxRetries: number = 3
  ): Promise<void> {
    try {
      // Get packet details
      const packet = await prisma.packet.findUnique({
        where: { id: packetId },
        include: {
          client: {
            select: {
              fullName: true,
              email: true
            }
          }
        }
      });
      
      if (!packet) {
        console.error(`[NotificationService] Packet not found: ${packetId}`);
        return;
      }
      
      // Only notify if packet has exceeded max retries
      if (packet.retryCount < maxRetries) {
        return;
      }
      
      // Get all admin users
      const admins = await prisma.user.findMany({
        where: {
          role: 'ADMIN',
          status: 'ACTIVE'
        },
        select: {
          email: true,
          name: true
        }
      });
      
      if (admins.length === 0) {
        console.warn('[NotificationService] No active admins found to notify');
        return;
      }
      
      const adminEmails = admins.map((admin: { email: string; name: string | null }) => admin.email);
      
      // Build admin panel URL
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const adminPanelUrl = `${baseUrl}/admin/packets/${packetId}`;
      
      // Send notification
      await sendPacketFailureNotification(
        adminEmails,
        packetId,
        packet.client.fullName,
        packet.client.email,
        packet.type,
        packet.lastError || 'Unknown error',
        packet.retryCount,
        adminPanelUrl
      );
      
      console.log(`[NotificationService] Sent failure notification for packet ${packetId} to ${adminEmails.length} admins`);
      
      // Log notification in audit log
      await prisma.auditLog.create({
        data: {
          action: 'ADMIN_NOTIFICATION_SENT',
          details: JSON.stringify({
            notificationType: 'PACKET_FAILURE',
            recipientCount: adminEmails.length,
            packetType: packet.type,
            packetId: packetId,
            clientId: packet.clientId,
            retryCount: packet.retryCount,
            error: packet.lastError
          }),
          ipAddress: 'internal'
        }
      });
    } catch (error) {
      console.error('[NotificationService] Error sending admin notification:', error);
      // Don't throw - notification failures shouldn't break the system
    }
  }
  
  /**
   * Notify admins about multiple failures (batch notification)
   */
  static async notifyAdminsOfBatchFailures(
    packetIds: string[],
    maxRetries: number = 3
  ): Promise<void> {
    for (const packetId of packetIds) {
      await this.notifyAdminsOfFailure(packetId, maxRetries);
    }
  }
  
  /**
   * Get packets that need admin notification
   */
  static async getPacketsNeedingNotification(
    maxRetries: number = 3
  ): Promise<string[]> {
    // Find packets that have failed with max retries but haven't been notified yet
    const failedPackets = await prisma.packet.findMany({
      where: {
        status: 'FAILED',
        retryCount: {
          gte: maxRetries
        }
      },
      select: {
        id: true,
        updatedAt: true
      }
    });
    
    // Check which ones haven't had a notification sent
    const packetIds: string[] = [];
    
    for (const packet of failedPackets) {
      // Check if notification was already sent
      const notificationLog = await prisma.auditLog.findFirst({
        where: {
          action: 'ADMIN_NOTIFICATION_SENT',
          createdAt: {
            gte: packet.updatedAt // Only check for notifications after the last update
          }
        }
      });
      
      // Check if the details contain this packet ID
      if (notificationLog) {
        try {
          const details = JSON.parse(notificationLog.details || '{}');
          if (details.packetId === packet.id) {
            continue; // Skip this packet, notification already sent
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      packetIds.push(packet.id);
    }
    
    return packetIds;
  }
  
  /**
   * Process pending notifications
   * Should be called periodically to catch any missed notifications
   */
  static async processPendingNotifications(maxRetries: number = 3): Promise<void> {
    const packetIds = await this.getPacketsNeedingNotification(maxRetries);
    
    if (packetIds.length > 0) {
      console.log(`[NotificationService] Processing ${packetIds.length} pending notifications`);
      await this.notifyAdminsOfBatchFailures(packetIds, maxRetries);
    }
  }
  
  /**
   * Send a test notification to admins
   */
  static async sendTestNotification(): Promise<void> {
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
        status: 'ACTIVE'
      },
      select: {
        email: true
      }
    });
    
    if (admins.length === 0) {
      throw new Error('No active admins found');
    }
    
    const adminEmails = admins.map((admin: { email: string }) => admin.email);
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    await sendPacketFailureNotification(
      adminEmails,
      'test-packet-id',
      'Test Client',
      'test@example.com',
      'NUTRITION',
      'This is a test notification',
      3,
      `${baseUrl}/admin`
    );
    
    console.log(`[NotificationService] Sent test notification to ${adminEmails.length} admins`);
  }
  
  /**
   * Notify client that their packet is ready
   */
  static async notifyClientPacketReady(packetId: string): Promise<void> {
    try {
      // Get packet and client details
      const packet = await prisma.packet.findUnique({
        where: { id: packetId },
        include: {
          client: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  emailNotifications: true,
                  notifyOnPacketReady: true
                }
              }
            }
          }
        }
      });
      
      if (!packet || !packet.client.user) {
        console.error(`[NotificationService] Packet or user not found: ${packetId}`);
        return;
      }
      
      const user = packet.client.user;
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const dashboardUrl = `${baseUrl}/dashboard`;
      
      // Create in-app notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'PACKET_READY',
          title: 'Your packet is ready!',
          message: `Your ${packet.type} packet has been generated and is ready to view.`,
          resourceType: 'PACKET',
          resourceId: packetId
        }
      });
      
      console.log(`[NotificationService] Created in-app notification for user ${user.id}`);
      
      // Send email notification if user has email notifications enabled
      if (user.emailNotifications && user.notifyOnPacketReady) {
        await sendPacketReadyEmail(
          user.email,
          user.name || packet.client.fullName,
          packet.type,
          dashboardUrl
        );
        
        console.log(`[NotificationService] Sent packet ready email to ${user.email}`);
      }
      
      // Log notification in audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'CLIENT_NOTIFICATION_SENT',
          details: JSON.stringify({
            notificationType: 'PACKET_READY',
            packetId: packetId,
            packetType: packet.type,
            emailSent: user.emailNotifications && user.notifyOnPacketReady
          }),
          ipAddress: 'internal'
        }
      });
    } catch (error) {
      console.error('[NotificationService] Error sending packet ready notification:', error);
      // Don't throw - notification failures shouldn't break the system
    }
  }
  
  /**
   * Notify client that their packet has been updated
   */
  static async notifyClientPacketUpdated(packetId: string): Promise<void> {
    try {
      // Get packet and client details
      const packet = await prisma.packet.findUnique({
        where: { id: packetId },
        include: {
          client: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  emailNotifications: true,
                  notifyOnPacketUpdate: true
                }
              }
            }
          }
        }
      });
      
      if (!packet || !packet.client.user) {
        console.error(`[NotificationService] Packet or user not found: ${packetId}`);
        return;
      }
      
      const user = packet.client.user;
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const dashboardUrl = `${baseUrl}/dashboard`;
      
      // Create in-app notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'PACKET_UPDATED',
          title: 'Your packet has been updated',
          message: `Your ${packet.type} packet has been updated with new information.`,
          resourceType: 'PACKET',
          resourceId: packetId
        }
      });
      
      console.log(`[NotificationService] Created in-app notification for user ${user.id}`);
      
      // Send email notification if user has email notifications enabled
      if (user.emailNotifications && user.notifyOnPacketUpdate) {
        await sendPacketUpdatedEmail(
          user.email,
          user.name || packet.client.fullName,
          packet.type,
          dashboardUrl
        );
        
        console.log(`[NotificationService] Sent packet updated email to ${user.email}`);
      }
      
      // Log notification in audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'CLIENT_NOTIFICATION_SENT',
          details: JSON.stringify({
            notificationType: 'PACKET_UPDATED',
            packetId: packetId,
            packetType: packet.type,
            emailSent: user.emailNotifications && user.notifyOnPacketUpdate
          }),
          ipAddress: 'internal'
        }
      });
    } catch (error) {
      console.error('[NotificationService] Error sending packet updated notification:', error);
      // Don't throw - notification failures shouldn't break the system
    }
  }
}
