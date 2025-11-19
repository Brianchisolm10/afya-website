/**
 * API Route: /api/me/notification-preferences
 * 
 * GET - Fetch user's notification preferences
 * PATCH - Update user's notification preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { AuthOptions } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/me/notification-preferences
 * Fetch user's notification preferences
 */
export async function GET(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/authorization');
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return authResult.response;
    }
    const session = authResult.session!;
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        emailNotifications: true,
        notifyOnPacketReady: true,
        notifyOnPacketUpdate: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      preferences: user
    });
  } catch (error) {
    console.error('[API] Error fetching notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/me/notification-preferences
 * Update user's notification preferences
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
    const { emailNotifications, notifyOnPacketReady, notifyOnPacketUpdate } = body;
    
    // Validate input
    const updates: any = {};
    
    if (typeof emailNotifications === 'boolean') {
      updates.emailNotifications = emailNotifications;
    }
    
    if (typeof notifyOnPacketReady === 'boolean') {
      updates.notifyOnPacketReady = notifyOnPacketReady;
    }
    
    if (typeof notifyOnPacketUpdate === 'boolean') {
      updates.notifyOnPacketUpdate = notifyOnPacketUpdate;
    }
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid preferences provided' },
        { status: 400 }
      );
    }
    
    // Update preferences
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updates,
      select: {
        emailNotifications: true,
        notifyOnPacketReady: true,
        notifyOnPacketUpdate: true
      }
    });
    
    // Log the change
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'NOTIFICATION_PREFERENCES_UPDATED',
        details: JSON.stringify({
          changes: updates
        }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
      }
    });
    
    return NextResponse.json({
      success: true,
      preferences: updatedUser
    });
  } catch (error) {
    console.error('[API] Error updating notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
}
