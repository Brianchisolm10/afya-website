/**
 * API Route: Send Packet to Client
 * POST /api/packets/[id]/send
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate and authorize - only admins and coaches can send
    const { requireRole } = await import('@/lib/authorization');
    const authResult = await requireRole(request, ['ADMIN', 'COACH']);
    if (!authResult.authorized) {
      return authResult.response;
    }

    const packetId = params.id;

    // Fetch packet with client info
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      include: {
        client: {
          include: {
            user: {
              select: {
                email: true,
              }
            }
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

    // Check if packet is approved
    if (packet.status !== 'APPROVED' && packet.status !== 'READY') {
      return NextResponse.json(
        { error: 'Packet must be approved before sending' },
        { status: 400 }
      );
    }

    // Update packet status to SENT
    await prisma.packet.update({
      where: { id: packetId },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        updatedAt: new Date(),
      }
    });

    // Send email notification to client
    const clientEmail = packet.client.email || packet.client.user?.email;
    
    if (clientEmail) {
      try {
        await sendEmail({
          to: clientEmail,
          subject: `Your ${formatPacketType(packet.type)} Plan is Ready!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #14b8a6;">Your Personalized Plan is Ready!</h2>
              
              <p>Hi ${packet.client.fullName},</p>
              
              <p>Great news! Your personalized ${formatPacketType(packet.type)} plan has been completed and is now available in your dashboard.</p>
              
              <div style="background-color: #f0fdfa; border-left: 4px solid #14b8a6; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; font-weight: bold;">What's included:</p>
                <ul style="margin: 8px 0 0 0; padding-left: 20px;">
                  <li>Personalized recommendations based on your goals</li>
                  <li>Detailed guidance and instructions</li>
                  <li>Downloadable PDF for offline access</li>
                  <li>Interactive viewer with helpful tooltips</li>
                </ul>
              </div>
              
              <p>
                <a href="${process.env.NEXTAUTH_URL}/dashboard" 
                   style="display: inline-block; background-color: #14b8a6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  View Your Plan
                </a>
              </p>
              
              <p>If you have any questions or need clarification on anything in your plan, please don't hesitate to reach out.</p>
              
              <p>Let's get started on your journey!</p>
              
              <p style="margin-top: 32px;">
                Best regards,<br>
                <strong>Afya Performance Team</strong>
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
              
              <p style="font-size: 12px; color: #6b7280;">
                This email was sent to ${clientEmail}. If you didn't request this plan, please contact us immediately.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Packet sent to client successfully'
    });

  } catch (error) {
    console.error('Error sending packet:', error);
    return NextResponse.json(
      { error: 'Failed to send packet' },
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
