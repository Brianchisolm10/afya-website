/**
 * Packet Status API
 * GET /api/packets/status - Get status of all packets for authenticated user
 * 
 * Returns real-time status updates for packet generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { requireAuth } = await import('@/lib/authorization');
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return authResult.response;
    }
    const session = authResult.session!;

    // Find client record for this user
    const client = await prisma.client.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client record not found' },
        { status: 404 }
      );
    }

    // Get all packets for this client with status info
    const packets = await prisma.packet.findMany({
      where: { clientId: client.id },
      select: {
        id: true,
        type: true,
        status: true,
        retryCount: true,
        lastError: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate overall progress
    const total = packets.length;
    const completed = packets.filter(p => p.status === 'READY').length;
    const failed = packets.filter(p => p.status === 'FAILED').length;
    const generating = packets.filter(p => p.status === 'GENERATING').length;
    const pending = packets.filter(p => p.status === 'PENDING').length;

    return NextResponse.json({
      packets: packets.map(packet => ({
        id: packet.id,
        type: packet.type,
        status: packet.status,
        retryCount: packet.retryCount,
        hasError: !!packet.lastError,
        errorMessage: packet.lastError,
        createdAt: packet.createdAt,
        updatedAt: packet.updatedAt
      })),
      summary: {
        total,
        completed,
        failed,
        generating,
        pending,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0
      }
    });

  } catch (error) {
    console.error('Error fetching packet status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packet status' },
      { status: 500 }
    );
  }
}
