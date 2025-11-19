/**
 * Admin API: Packet Error Management
 * 
 * Endpoints for viewing error statistics and managing failed packets
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/authorization';
import { PacketErrorHandler } from '@/lib/intake/packet-error-handler';
import { getRetryStats } from '@/lib/intake/packet-worker';
import { PacketNotificationService } from '@/lib/intake/packet-notification-service';

/**
 * GET /api/admin/packets/errors
 * Get error statistics and failed packets
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization
    const authResult = await requireRole(request, ['ADMIN']);
    if (!authResult.authorized) {
      return authResult.response;
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const timeRangeHours = parseInt(searchParams.get('timeRange') || '24');
    
    // Get error statistics
    const errorStats = await PacketErrorHandler.getErrorStats(timeRangeHours);
    
    // Get retry statistics
    const retryStats = await getRetryStats();
    
    // Get failed packets needing attention
    const failedPackets = await PacketErrorHandler.getFailedPacketsNeedingAttention();
    
    // Get packets needing notification
    const packetsNeedingNotification = await PacketNotificationService.getPacketsNeedingNotification();
    
    return NextResponse.json({
      success: true,
      data: {
        errorStats,
        retryStats,
        failedPackets,
        packetsNeedingNotification: packetsNeedingNotification.length,
        timeRangeHours
      }
    });
  } catch (error) {
    console.error('[API] Error fetching packet error stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch error statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/packets/errors/notify
 * Manually trigger admin notifications for failed packets
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const authResult = await requireRole(request, ['ADMIN']);
    if (!authResult.authorized) {
      return authResult.response;
    }
    
    const body = await request.json();
    const { packetId, test } = body;
    
    if (test) {
      // Send test notification
      await PacketNotificationService.sendTestNotification();
      
      return NextResponse.json({
        success: true,
        message: 'Test notification sent to all admins'
      });
    }
    
    if (packetId) {
      // Send notification for specific packet
      await PacketNotificationService.notifyAdminsOfFailure(packetId);
      
      return NextResponse.json({
        success: true,
        message: `Notification sent for packet ${packetId}`
      });
    }
    
    // Process all pending notifications
    await PacketNotificationService.processPendingNotifications();
    
    return NextResponse.json({
      success: true,
      message: 'Processed all pending notifications'
    });
  } catch (error) {
    console.error('[API] Error sending notifications:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send notifications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
