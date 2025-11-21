/**
 * Intake Analytics Start API
 * 
 * Tracks when a user starts an intake form
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ClientType } from '@prisma/client';

/**
 * POST /api/intake/analytics/start
 * Track intake start
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientType } = body;

    if (!clientType) {
      return NextResponse.json(
        { error: 'clientType is required' },
        { status: 400 }
      );
    }

    // Validate clientType
    const validClientTypes = Object.values(ClientType);
    if (!validClientTypes.includes(clientType)) {
      return NextResponse.json(
        { error: 'Invalid clientType' },
        { status: 400 }
      );
    }

    // Create analytics record
    const analyticsRecord = await prisma.intakeAnalytics.create({
      data: {
        clientType: clientType as ClientType,
        startedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true,
      analyticsId: analyticsRecord.id
    });
    
  } catch (error) {
    console.error('Error tracking intake start:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}
