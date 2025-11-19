/**
 * API Route: Edit Packet Content
 * PUT /api/packets/[id]/edit
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { AuthOptions } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { PDFExportService } from '@/lib/intake/pdf-export-service';
import { PopulatedContent } from '@/types/intake';
import { sanitizeObject } from '@/lib/validation';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate and authorize - only admins and coaches can edit
    const { requireRole } = await import('@/lib/authorization');
    const authResult = await requireRole(request, ['ADMIN', 'COACH']);
    if (!authResult.authorized) {
      return authResult.response;
    }

    const packetId = params.id;
    const body = await request.json();
    const { content, status } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Sanitize content to prevent XSS
    const sanitizedContent = sanitizeObject(content);

    // Fetch packet
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      include: {
        client: {
          select: {
            fullName: true,
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

    // Store previous version reference if this is a significant edit
    const shouldIncrementVersion = status === 'APPROVED' || status === 'READY';
    
    // Update packet content with sanitized data
    const updatedPacket = await prisma.packet.update({
      where: { id: packetId },
      data: {
        content: sanitizedContent as any,
        status: status || packet.status,
        version: shouldIncrementVersion ? packet.version + 1 : packet.version,
        previousVersionId: shouldIncrementVersion ? packetId : packet.previousVersionId,
        updatedAt: new Date(),
      }
    });

    // If approved, regenerate PDF
    if (status === 'APPROVED' || status === 'SENT') {
      try {
        // Delete old PDF
        if (packet.pdfUrl) {
          await PDFExportService.deletePDF(packet.pdfUrl);
        }

        // Generate new PDF with sanitized content
        const pdfUrl = await PDFExportService.generatePDF(
          packetId,
          sanitizedContent as PopulatedContent,
          packet.client.fullName,
          packet.type,
          {
            title: `${formatPacketType(packet.type)} Plan - ${packet.client.fullName}`,
            author: 'Afya Performance',
            subject: `Personalized ${formatPacketType(packet.type)} Plan`,
            keywords: [packet.type, 'fitness', 'nutrition', 'training'],
          }
        );

        // Update with PDF URL
        await prisma.packet.update({
          where: { id: packetId },
          data: {
            pdfUrl: pdfUrl,
          }
        });
      } catch (pdfError) {
        console.error('Error regenerating PDF:', pdfError);
        // Continue anyway - packet content is saved
      }
    }

    // Send notification to client if packet is ready/approved
    if (status === 'READY' || status === 'APPROVED') {
      try {
        const { PacketNotificationService } = await import('@/lib/intake/packet-notification-service');
        await PacketNotificationService.notifyClientPacketUpdated(packetId);
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
        // Don't fail the request if notification fails
      }
    }

    return NextResponse.json({
      success: true,
      packet: updatedPacket,
      message: 'Packet updated successfully'
    });

  } catch (error) {
    console.error('Error updating packet:', error);
    return NextResponse.json(
      { error: 'Failed to update packet' },
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
