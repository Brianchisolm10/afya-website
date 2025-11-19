/**
 * API Route: Packet management by ID
 * GET /api/packets/[id] - Get packet content
 * DELETE /api/packets/[id] - Delete packet (Admin/Coach only)
 * 
 * Returns packet content for authenticated users.
 * Clients can only access their own packets.
 * Admins and coaches can access any packet.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { PDFExportService } from '@/lib/intake/pdf-export-service';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const { requireAuth, canAccessPacket } = await import('@/lib/authorization');
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return authResult.response;
    }
    const session = authResult.session!;

    const packetId = params.id;

    // Check authorization to access this packet
    const accessCheck = await canAccessPacket(
      session.user.id,
      session.user.role,
      packetId,
      request.headers.get("x-forwarded-for")
    );

    if (!accessCheck.authorized) {
      return NextResponse.json(
        { error: `Forbidden - ${accessCheck.reason}` },
        { status: 403 }
      );
    }

    // Fetch packet with client data
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            userId: true,
            email: true,
          }
        }
      }
    });

    if (!packet) {
      return NextResponse.json(
        { error: 'Packet not found' },
        { status: 404 }
      );
    }

    // Return packet data
    return NextResponse.json({
      id: packet.id,
      type: packet.type,
      status: packet.status,
      content: packet.content,
      docUrl: packet.docUrl,
      pdfUrl: packet.pdfUrl,
      version: packet.version,
      createdAt: packet.createdAt,
      updatedAt: packet.updatedAt,
      client: {
        id: packet.client.id,
        fullName: packet.client.fullName,
        email: packet.client.email,
      }
    });

  } catch (error) {
    console.error('Error fetching packet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packet' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate and authorize - only admins and coaches can delete
    const { requireRole } = await import('@/lib/authorization');
    const authResult = await requireRole(request, ['ADMIN', 'COACH']);
    if (!authResult.authorized) {
      return authResult.response;
    }

    const packetId = params.id;

    // Fetch packet to get file URLs
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      include: {
        client: {
          select: {
            userId: true,
          }
        }
      }
    });

    if (!packet) {
      return NextResponse.json(
        { error: 'Packet not found' },
        { status: 404 }
      );
    }

    console.log('[API] Deleting packet:', packetId, 'Type:', packet.type);

    // Delete PDF file if exists
    if (packet.pdfUrl) {
      try {
        await PDFExportService.deletePDF(packet.pdfUrl);
        console.log('[API] Deleted PDF file');
      } catch (error) {
        console.error('[API] Error deleting PDF file:', error);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete packet from database
    await prisma.packet.delete({
      where: { id: packetId },
    });

    console.log('[API] Packet deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Packet deleted successfully',
    });

  } catch (error) {
    console.error('[API] Error deleting packet:', error);
    return NextResponse.json(
      { error: 'Failed to delete packet' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
