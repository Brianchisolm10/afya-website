/**
 * API Route: Download packet PDF
 * GET /api/packets/[id]/download
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

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

    // Check if PDF exists
    if (!packet.pdfUrl) {
      return NextResponse.json(
        { error: 'PDF not available for this packet' },
        { status: 404 }
      );
    }

    // Read PDF file
    const storagePath = process.env.PDF_STORAGE_PATH || './public/packets';
    const filename = path.basename(packet.pdfUrl);
    const filepath = path.join(storagePath, filename);

    try {
      const fileBuffer = await fs.readFile(filepath);

      // Return PDF file
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${formatPacketType(packet.type)}-${packet.client.fullName}.pdf"`,
        },
      });
    } catch (fileError) {
      console.error('Error reading PDF file:', fileError);
      return NextResponse.json(
        { error: 'PDF file not found on server' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Error downloading PDF:', error);
    return NextResponse.json(
      { error: 'Failed to download PDF' },
      { status: 500 }
    );
  }
}

/**
 * Format packet type for display
 */
function formatPacketType(type: string): string {
  const typeMap: Record<string, string> = {
    NUTRITION: 'Nutrition',
    WORKOUT: 'Workout',
    PERFORMANCE: 'Performance',
    YOUTH: 'Youth Training',
    RECOVERY: 'Recovery',
    WELLNESS: 'Wellness',
    INTRO: 'Introduction',
  };

  return typeMap[type] || type;
}
