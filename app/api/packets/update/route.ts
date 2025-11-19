import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PacketType, PacketStatus } from '@/types';
import {
  ValidationError,
  AuthenticationError,
  NotFoundError,
  formatErrorResponse,
  getErrorStatusCode,
  logError,
  retryWithBackoff,
} from '@/lib/utils';

interface WebhookRequestBody {
  clientEmail?: string;
  clientId?: string;
  packetType: 'INTRO' | 'NUTRITION' | 'WORKOUT';
  status: 'READY' | 'FAILED';
  docUrl?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const webhookSecret = request.headers.get('X-Webhook-Secret');
    
    if (!webhookSecret || webhookSecret !== process.env.WEBHOOK_SECRET) {
      throw new AuthenticationError('Invalid or missing webhook secret');
    }

    // Parse request body
    const body: WebhookRequestBody = await request.json();

    // Validate required fields
    if (!body.packetType || !body.status) {
      throw new ValidationError('Missing required fields: packetType and status');
    }

    if (!body.clientEmail && !body.clientId) {
      throw new ValidationError('Either clientEmail or clientId must be provided');
    }

    // Validate packet type
    if (!['INTRO', 'NUTRITION', 'WORKOUT'].includes(body.packetType)) {
      throw new ValidationError('Invalid packetType. Must be INTRO, NUTRITION, or WORKOUT', 'packetType');
    }

    // Validate status
    if (!['READY', 'FAILED'].includes(body.status)) {
      throw new ValidationError('Invalid status. Must be READY or FAILED', 'status');
    }

    // Find client by email or id with retry logic
    const client = await retryWithBackoff(async () => {
      if (body.clientId) {
        return await prisma.client.findUnique({
          where: { id: body.clientId },
        });
      } else if (body.clientEmail) {
        return await prisma.client.findUnique({
          where: { email: body.clientEmail.toLowerCase().trim() },
        });
      }
      return null;
    });

    if (!client) {
      throw new NotFoundError(
        'Client not found',
        body.clientEmail || body.clientId
      );
    }

    // Find matching packet by clientId and type
    const packet = await retryWithBackoff(async () => {
      return await prisma.packet.findFirst({
        where: {
          clientId: client.id,
          type: body.packetType as PacketType,
        },
      });
    });

    if (!packet) {
      throw new NotFoundError(
        `Packet not found for client and type ${body.packetType}`,
        `${client.id}:${body.packetType}`
      );
    }

    // Update packet with new status, docUrl, and lastError
    const updatedPacket = await retryWithBackoff(async () => {
      return await prisma.packet.update({
        where: { id: packet.id },
        data: {
          status: body.status as PacketStatus,
          docUrl: body.status === 'READY' ? body.docUrl : null,
          lastError: body.status === 'FAILED' ? body.error : null,
        },
      });
    });

    // Log success
    console.log('Packet updated successfully:', {
      packetId: updatedPacket.id,
      clientId: client.id,
      type: updatedPacket.type,
      status: updatedPacket.status,
    });

    // Return success response
    return NextResponse.json({
      success: true,
      packet: {
        id: updatedPacket.id,
        type: updatedPacket.type,
        status: updatedPacket.status,
        docUrl: updatedPacket.docUrl,
      },
    });
  } catch (error: any) {
    // Log error with context
    logError(error as Error, {
      endpoint: '/api/packets/update',
      clientEmail: error?.clientEmail,
      clientId: error?.clientId,
      packetType: error?.packetType,
    });

    // Handle custom errors
    if (
      error instanceof ValidationError ||
      error instanceof AuthenticationError ||
      error instanceof NotFoundError
    ) {
      return NextResponse.json(
        { success: false, ...formatErrorResponse(error) },
        { status: getErrorStatusCode(error) }
      );
    }

    // Generic error response
    return NextResponse.json(
      { success: false, ...formatErrorResponse(new Error('Failed to process webhook')) },
      { status: 500 }
    );
  }
}
