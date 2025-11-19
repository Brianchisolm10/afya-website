import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/authorization';

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    console.log('[API] Fetching client details for ID:', params.clientId);
    
    // Verify ADMIN or COACH role authorization
    const authResult = await requireRole(request, ['ADMIN', 'COACH']);
    console.log('[API] Auth result:', { authorized: authResult.authorized });
    
    if (!authResult.authorized) {
      console.log('[API] Authorization failed');
      return authResult.response;
    }
    const session = authResult.session!;

    const { clientId } = params;
    console.log('[API] Looking up client:', clientId);

    // Fetch client with packets
    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
      include: {
        packets: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!client) {
      console.log('[API] Client not found');
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    console.log('[API] Client found:', client.fullName);

    // Transform data for response
    const clientDetails = {
      id: client.id,
      fullName: client.fullName,
      email: client.email,
      goal: client.goal,
      createdAt: client.createdAt.toISOString(),
      packets: client.packets.map((packet) => ({
        id: packet.id,
        type: packet.type,
        status: packet.status,
        docUrl: packet.docUrl,
        pdfUrl: packet.pdfUrl,
        lastError: packet.lastError,
        version: packet.version,
        createdAt: packet.createdAt.toISOString(),
        updatedAt: packet.updatedAt.toISOString(),
      })),
    };

    console.log('[API] Returning client details');
    return NextResponse.json({ client: clientDetails });
  } catch (error) {
    console.error('[API] Error fetching client details:', error);
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
