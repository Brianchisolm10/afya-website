/**
 * API Route: Regenerate packet
 * POST /api/admin/packets/[id]/regenerate
 * 
 * Queues a packet for regeneration with incremented version.
 * Admin/Coach only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/authorization';
import { prisma } from '@/lib/db';
import { PacketGenerationService } from '@/lib/intake/packet-generation-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[API] Regenerating packet:', params.id);
    
    // Verify ADMIN or COACH role authorization
    const authResult = await requireRole(request, ['ADMIN', 'COACH']);
    
    if (!authResult.authorized) {
      console.log('[API] Authorization failed');
      return authResult.response;
    }

    const packetId = params.id;

    // Fetch packet with client data
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      include: {
        client: true,
      },
    });

    if (!packet) {
      console.log('[API] Packet not found');
      return NextResponse.json(
        { error: 'Packet not found' },
        { status: 404 }
      );
    }

    console.log('[API] Found packet:', packet.type, 'for client:', packet.client.fullName);

    // Update packet status to PENDING and increment version
    const updatedPacket = await prisma.packet.update({
      where: { id: packetId },
      data: {
        status: 'PENDING',
        version: packet.version + 1,
        previousVersionId: packetId,
        lastError: null,
        retryCount: 0,
        updatedAt: new Date(),
      },
    });

    console.log('[API] Updated packet status to PENDING, version:', updatedPacket.version);

    // Queue packet for regeneration in background
    // Note: In a production environment, this would use a proper job queue
    // For now, we'll trigger generation directly but asynchronously
    PacketGenerationService.generatePacket(packet.client, packet.type, packetId)
      .then(() => {
        console.log('[API] Packet regeneration completed successfully');
      })
      .catch((error) => {
        console.error('[API] Packet regeneration failed:', error);
      });

    return NextResponse.json({
      success: true,
      message: 'Packet regeneration has been queued',
      packet: {
        id: updatedPacket.id,
        status: updatedPacket.status,
        version: updatedPacket.version,
      },
    });

  } catch (error) {
    console.error('[API] Error regenerating packet:', error);
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'Failed to regenerate packet' },
      { status: 500 }
    );
  }
}
