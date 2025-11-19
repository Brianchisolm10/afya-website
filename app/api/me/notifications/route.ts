/**
 * API Route: /api/me/notifications
 * 
 * GET - Fetch user's notifications
 * PATCH - Mark notifications as read
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { AuthOptions } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/me/notifications
 * Fetch user's notifications
 */
export async function GET(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/authorization');
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return authResult.response;
    }
    const session = authResult.session!;
    
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // Fetch notifications
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        ...(unreadOnly ? { isRead: false } : {})
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
    
    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false
      }
    });
    
    return NextResponse.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('[API] Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/me/notifications
 * Mark notifications as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/authorization');
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return authResult.response;
    }
    const session = authResult.session!;
    
    const body = await request.json();
    const { notificationIds, markAllAsRead } = body;
    
    if (markAllAsRead) {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          isRead: false
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      });
    }
    
    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: 'Invalid request: notificationIds must be an array' },
        { status: 400 }
      );
    }
    
    // Mark specific notifications as read
    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: session.user.id // Ensure user owns these notifications
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      message: `${notificationIds.length} notification(s) marked as read`
    });
  } catch (error) {
    console.error('[API] Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/me/notifications
 * Delete notifications
 */
export async function DELETE(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/authorization');
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return authResult.response;
    }
    const session = authResult.session!;
    
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    
    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }
    
    // Delete notification (ensure user owns it)
    const deleted = await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId: session.user.id
      }
    });
    
    if (deleted.count === 0) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('[API] Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
