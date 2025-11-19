import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/authorization');
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return authResult.response;
    }
    const session = authResult.session!;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find or create client record
    let client = await prisma.client.findUnique({
      where: { email: user.email },
      include: {
        packets: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // If no client record exists, create one
    if (!client) {
      client = await prisma.client.create({
        data: {
          fullName: user.name || 'Client',
          email: user.email,
          goal: 'General wellness',
        },
        include: {
          packets: true,
        },
      });
    }

    return NextResponse.json({
      client: {
        id: client.id,
        fullName: client.fullName,
        email: client.email,
        goal: client.goal,
        createdAt: client.createdAt.toISOString(),
      },
      packets: client.packets.map(packet => ({
        id: packet.id,
        type: packet.type,
        status: packet.status,
        docUrl: packet.docUrl,
        createdAt: packet.createdAt.toISOString(),
        updatedAt: packet.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Client fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client data' },
      { status: 500 }
    );
  }
}
