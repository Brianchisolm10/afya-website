/**
 * API Route: Regenerate PDF for existing packet
 * POST /api/packets/[id]/regenerate-pdf
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { PDFExportService } from '@/lib/intake/pdf-export-service';
import { PopulatedContent } from '@/types/intake';

const prisma = new PrismaClient();

export async function POST(
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

    // Check if packet has content
    if (!packet.content) {
      return NextResponse.json(
        { error: 'Packet content not available' },
        { status: 400 }
      );
    }

    // Delete old PDF if exists
    if (packet.pdfUrl) {
      try {
        await PDFExportService.deletePDF(packet.pdfUrl);
      } catch (error) {
        console.error('Error deleting old PDF:', error);
        // Continue anyway
      }
    }

    // Generate new PDF
    const pdfUrl = await PDFExportService.generatePDF(
      packetId,
      packet.content as PopulatedContent,
      packet.client.fullName,
      packet.type,
      {
        title: `${formatPacketType(packet.type)} Plan - ${packet.client.fullName}`,
        author: 'Afya Performance',
        subject: `Personalized ${formatPacketType(packet.type)} Plan`,
        keywords: [packet.type, 'fitness', 'nutrition', 'training'],
      }
    );

    // Update packet with new PDF URL
    await prisma.packet.update({
      where: { id: packetId },
      data: {
        pdfUrl: pdfUrl,
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      pdfUrl: pdfUrl,
      message: 'PDF regenerated successfully'
    });

  } catch (error) {
    console.error('Error regenerating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate PDF' },
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
