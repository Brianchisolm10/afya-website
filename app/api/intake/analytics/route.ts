/**
 * Intake Analytics API
 * 
 * Tracks intake abandonment and drop-off points
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ClientType } from '@prisma/client';
import type { AuthOptions } from 'next-auth';

/**
 * POST /api/intake/analytics
 * Track intake abandonment
 */
export async function POST(request: NextRequest) {
  try {
    // Parse body - handle both JSON and text (from sendBeacon)
    let body;
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      body = await request.json();
    } else {
      // Handle sendBeacon which sends as text
      const text = await request.text();
      try {
        body = JSON.parse(text);
      } catch {
        return NextResponse.json(
          { error: 'Invalid request format' },
          { status: 400 }
        );
      }
    }

    const { clientType, dropOffStep } = body;

    if (!clientType || typeof dropOffStep !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Find the most recent incomplete analytics record
    const analyticsRecord = await prisma.intakeAnalytics.findFirst({
      where: {
        clientType: clientType as ClientType,
        completedAt: null,
        abandonedAt: null
      },
      orderBy: {
        startedAt: 'desc'
      }
    });

    if (analyticsRecord) {
      await prisma.intakeAnalytics.update({
        where: { id: analyticsRecord.id },
        data: {
          abandonedAt: new Date(),
          dropOffStep
        }
      });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error tracking intake abandonment:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}
