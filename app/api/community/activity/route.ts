import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/authorization';
import { sanitizeString, sanitizeNumber } from '@/lib/validation';
import { logAuditEvent } from '@/lib/audit';

export const dynamic = 'force-dynamic';

interface ActivityLogRequest {
  clientId: string;
  activityType: string;
  durationMinutes: number;
  date: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authCheck = await requireAuth(request);
    if (!authCheck.authorized || !authCheck.session) {
      return authCheck.response;
    }

    const session = authCheck.session;
    const body = await request.json();

    // Validate required fields
    if (!body.clientId || !body.activityType || !body.durationMinutes || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields: clientId, activityType, durationMinutes, date' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const clientId = sanitizeString(body.clientId);
    const activityType = sanitizeString(body.activityType);
    const durationMinutes = sanitizeNumber(body.durationMinutes);
    const notes = body.notes ? sanitizeString(body.notes) : undefined;

    // Validate duration is positive
    if (!durationMinutes || durationMinutes <= 0) {
      return NextResponse.json(
        { error: 'Duration must be a positive number' },
        { status: 400 }
      );
    }

    // Validate date format
    const activityDate = new Date(body.date);
    if (isNaN(activityDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Verify the client exists and belongs to the authenticated user
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, userId: true },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Ensure the user can only log activities for their own client profile
    if (client.userId !== session.user.id && session.user.role !== 'ADMIN') {
      await logAuditEvent(
        'UNAUTHORIZED_ACTIVITY_LOG_ATTEMPT',
        session.user.id,
        {
          attemptedClientId: clientId,
          actualUserId: client.userId,
        },
        request.headers.get('x-forwarded-for')
      );

      return NextResponse.json(
        { error: 'Unauthorized - You can only log activities for your own profile' },
        { status: 403 }
      );
    }

    // Create the activity log entry
    const activityLog = await prisma.activityLog.create({
      data: {
        clientId,
        activityType,
        durationMinutes,
        date: activityDate,
        notes,
      },
    });

    // Update community stats aggregate
    await updateCommunityStats(durationMinutes);

    // Log the successful activity logging
    await logAuditEvent(
      'ACTIVITY_LOGGED',
      session.user.id,
      {
        activityLogId: activityLog.id,
        activityType,
        durationMinutes,
      },
      request.headers.get('x-forwarded-for')
    );

    return NextResponse.json({
      success: true,
      activityLog: {
        id: activityLog.id,
        activityType: activityLog.activityType,
        durationMinutes: activityLog.durationMinutes,
        date: activityLog.date,
        createdAt: activityLog.createdAt,
      },
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    return NextResponse.json(
      { error: 'Failed to log activity' },
      { status: 500 }
    );
  }
}

/**
 * Update the community stats aggregate with new activity minutes
 */
async function updateCommunityStats(minutesToAdd: number): Promise<void> {
  try {
    // Get or create community stats
    let stats = await prisma.communityStats.findFirst();

    if (!stats) {
      // Initialize with the new minutes if not exists
      await prisma.communityStats.create({
        data: {
          totalMinutesMoved: minutesToAdd,
          totalClientsServed: 0,
          totalDonationsRaised: 0,
          totalGearDonated: 0,
        },
      });
    } else {
      // Increment the total minutes moved
      await prisma.communityStats.update({
        where: { id: stats.id },
        data: {
          totalMinutesMoved: {
            increment: minutesToAdd,
          },
          lastUpdated: new Date(),
        },
      });
    }
  } catch (error) {
    console.error('Error updating community stats:', error);
    // Don't throw - we don't want to fail the activity log if stats update fails
  }
}
