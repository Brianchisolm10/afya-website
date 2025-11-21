/**
 * Dynamic Intake Submission API
 * 
 * Handles submission of the new dynamic intake system with path-based routing
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/get-session';
import { IntakeService } from '@/lib/intake/intake-service';
import { PacketRoutingService } from '@/lib/intake/packet-routing-service';
import { IntakeResponses } from '@/types/intake';
import {
  ValidationError,
  formatErrorResponse,
  getErrorStatusCode,
  logError,
} from '@/lib/utils';
import { sanitizeIntakeResponses } from '@/lib/validation';

// Define ClientType locally
type ClientType = 
  | 'NUTRITION_ONLY'
  | 'WORKOUT_ONLY'
  | 'FULL_PROGRAM'
  | 'ATHLETE_PERFORMANCE'
  | 'YOUTH'
  | 'GENERAL_WELLNESS'
  | 'SPECIAL_SITUATION';

interface DynamicIntakeSubmissionRequest {
  clientType: ClientType;
  responses: IntakeResponses;
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user using requireAuth
    const { requireAuth } = await import('@/lib/authorization');
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return authResult.response;
    }
    const session = authResult.session!;

    // Parse request body
    const body: DynamicIntakeSubmissionRequest = await request.json();

    // Validate required fields
    if (!body.clientType) {
      throw new ValidationError('Client type is required', 'clientType');
    }

    if (!body.responses || typeof body.responses !== 'object') {
      throw new ValidationError('Intake responses are required', 'responses');
    }

    // Validate client type
    const validClientTypes: ClientType[] = [
      'NUTRITION_ONLY',
      'WORKOUT_ONLY',
      'FULL_PROGRAM',
      'ATHLETE_PERFORMANCE',
      'YOUTH',
      'GENERAL_WELLNESS',
      'SPECIAL_SITUATION'
    ];

    if (!validClientTypes.includes(body.clientType)) {
      throw new ValidationError(
        `Invalid client type. Must be one of: ${validClientTypes.join(', ')}`,
        'clientType'
      );
    }

    // Sanitize intake responses to prevent XSS
    const sanitizedResponses = sanitizeIntakeResponses(body.responses);

    // Submit intake and generate client profile with sanitized data
    const { client } = await IntakeService.submitIntake(
      session.user.id,
      body.clientType,
      sanitizedResponses
    );

    // Route packets based on client type with sanitized data
    const { packetIds, packetTypes } = await PacketRoutingService.routePacketsForClient(
      client.id,
      body.clientType,
      sanitizedResponses
    );

    // Track intake completion (analytics)
    try {
      const { prisma } = await import('@/lib/db');
      
      // Find the most recent incomplete analytics record for this client type
      const analyticsRecord = await prisma.intakeAnalytics.findFirst({
        where: {
          clientType: body.clientType,
          completedAt: null,
          abandonedAt: null
        },
        orderBy: {
          startedAt: 'desc'
        }
      });

      if (analyticsRecord) {
        const completionTime = Math.floor(
          (new Date().getTime() - new Date(analyticsRecord.startedAt).getTime()) / 1000
        );

        await prisma.intakeAnalytics.update({
          where: { id: analyticsRecord.id },
          data: {
            completedAt: new Date(),
            completionTime
          }
        });
      }
    } catch (analyticsError) {
      // Log but don't fail the request if analytics tracking fails
      console.error('Failed to track intake completion:', analyticsError);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        fullName: client.fullName,
        email: client.email,
        clientType: client.clientType
      },
      packets: packetIds.map((id, index) => ({
        id,
        type: packetTypes[index],
        status: 'PENDING'
      })),
      message: 'Intake submitted successfully. Your personalized packets are being generated.'
    });

  } catch (error: any) {
    // Log error with context
    logError(error, {
      endpoint: '/api/intake/submit-dynamic',
      userId: error?.userId || 'unknown',
    });

    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json(
        formatErrorResponse(error),
        { status: getErrorStatusCode(error) }
      );
    }

    // Handle other errors
    return NextResponse.json(
      formatErrorResponse(new Error(error.message || 'Failed to process intake submission')),
      { status: 500 }
    );
  }
}
