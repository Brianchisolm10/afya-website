import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { AuthOptions } from 'next-auth';
import { sanitizeObject, sanitizeString } from '@/lib/validation';

// Validation helper
function validateProgressData(data: any): {
  valid: boolean;
  error?: string;
  data?: {
    selectedPath?: string;
    currentStep: number;
    totalSteps?: number;
    responses: Record<string, any>;
    isComplete?: boolean;
  };
} {
  if (typeof data.currentStep !== 'number' || data.currentStep < 0) {
    return { valid: false, error: 'currentStep must be a non-negative number' };
  }
  
  if (data.totalSteps !== undefined && (typeof data.totalSteps !== 'number' || data.totalSteps < 0)) {
    return { valid: false, error: 'totalSteps must be a non-negative number' };
  }
  
  if (!data.responses || typeof data.responses !== 'object') {
    return { valid: false, error: 'responses must be an object' };
  }
  
  return {
    valid: true,
    data: {
      selectedPath: data.selectedPath,
      currentStep: data.currentStep,
      totalSteps: data.totalSteps,
      responses: data.responses,
      isComplete: data.isComplete
    }
  };
}

/**
 * GET /api/intake/progress
 * Retrieve saved intake progress for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/authorization');
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return authResult.response;
    }
    const session = authResult.session!;

    // Find client record for this user
    const client = await prisma.client.findUnique({
      where: { userId: session.user.id },
      include: {
        intakeProgress: true
      }
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client record not found' },
        { status: 404 }
      );
    }

    // Return progress if it exists
    if (client.intakeProgress) {
      return NextResponse.json({
        progress: {
          selectedPath: client.intakeProgress.selectedPath,
          currentStep: client.intakeProgress.currentStep,
          totalSteps: client.intakeProgress.totalSteps,
          responses: client.intakeProgress.responses,
          isComplete: client.intakeProgress.isComplete,
          lastSavedAt: client.intakeProgress.lastSavedAt
        }
      });
    }

    // No progress found
    return NextResponse.json({ progress: null });
    
  } catch (error) {
    console.error('Error retrieving intake progress:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve progress' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/intake/progress
 * Save intake progress for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/authorization');
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return authResult.response;
    }
    const session = authResult.session!;

    const body = await request.json();
    
    // Validate request body
    const validation = validateProgressData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error },
        { status: 400 }
      );
    }

    const { selectedPath, currentStep, totalSteps, responses, isComplete } = validation.data!;

    // Sanitize responses to prevent XSS
    const sanitizedResponses = sanitizeObject(responses);

    // Find or create client record
    let client = await prisma.client.findUnique({
      where: { userId: session.user.id }
    });

    if (!client) {
      // Create client record if it doesn't exist
      client = await prisma.client.create({
        data: {
          userId: session.user.id,
          fullName: sanitizeString(session.user.name || ''),
          email: session.user.email || '',
          clientType: selectedPath as any || 'FULL_PROGRAM'
        }
      });
    }

    // Check if this is a new intake (for analytics tracking)
    const existingProgress = await prisma.intakeProgress.findUnique({
      where: { clientId: client.id }
    });

    const isNewIntake = !existingProgress;

    // Update or create intake progress with sanitized data
    const progress = await prisma.intakeProgress.upsert({
      where: { clientId: client.id },
      update: {
        selectedPath,
        currentStep,
        totalSteps,
        responses: sanitizedResponses,
        isComplete: isComplete || false,
        lastSavedAt: new Date()
      },
      create: {
        clientId: client.id,
        selectedPath,
        currentStep,
        totalSteps,
        responses: sanitizedResponses,
        isComplete: isComplete || false,
        lastSavedAt: new Date()
      }
    });

    // Track analytics for new intakes
    if (isNewIntake && selectedPath) {
      await prisma.intakeAnalytics.create({
        data: {
          clientType: selectedPath as any,
          startedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      success: true,
      progress: {
        selectedPath: progress.selectedPath,
        currentStep: progress.currentStep,
        totalSteps: progress.totalSteps,
        responses: progress.responses,
        isComplete: progress.isComplete,
        lastSavedAt: progress.lastSavedAt
      }
    });
    
  } catch (error) {
    console.error('Error saving intake progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}
