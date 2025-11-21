import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * Monitoring Dashboard API
 * 
 * Provides system metrics and health information for admin monitoring dashboard.
 * Requires admin authentication.
 */
export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get system metrics
    const [
      totalClients,
      totalPackets,
      pendingPackets,
      generatingPackets,
      readyPackets,
      failedPackets,
      recentErrors,
      recentCompletions,
      intakeStats,
    ] = await Promise.all([
      // Total clients
      prisma.client.count(),
      
      // Total packets
      prisma.packet.count(),
      
      // Packets by status
      prisma.packet.count({ where: { status: 'PENDING' } }),
      prisma.packet.count({ where: { status: 'GENERATING' } }),
      prisma.packet.count({ where: { status: 'READY' } }),
      prisma.packet.count({ where: { status: 'FAILED' } }),
      
      // Recent errors (last 10)
      prisma.packet.findMany({
        where: { status: 'FAILED' },
        take: 10,
        orderBy: { updatedAt: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              fullName: true,
              email: true,
              clientType: true,
            },
          },
        },
      }),
      
      // Recent completions (last 10)
      prisma.packet.findMany({
        where: { status: 'READY' },
        take: 10,
        orderBy: { updatedAt: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              fullName: true,
              clientType: true,
            },
          },
        },
      }),
      
      // Intake statistics
      prisma.intakeAnalytics.aggregate({
        _count: true,
        _avg: {
          completionTime: true,
        },
      }),
    ]);

    // Calculate success rate
    const successRate = totalPackets > 0
      ? ((readyPackets / totalPackets) * 100).toFixed(2)
      : 100;

    // Calculate failure rate
    const failureRate = totalPackets > 0
      ? ((failedPackets / totalPackets) * 100).toFixed(2)
      : 0;

    // Calculate average packet generation time (estimate based on recent completions)
    const avgGenerationTime = recentCompletions.length > 0
      ? recentCompletions.reduce((sum, packet) => {
          const duration = packet.updatedAt.getTime() - packet.createdAt.getTime();
          return sum + duration;
        }, 0) / recentCompletions.length / 1000 // Convert to seconds
      : 0;

    // Get memory usage
    const memoryUsage = process.memoryUsage();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      system: {
        status: 'healthy',
        uptime: `${Math.floor(process.uptime())}s`,
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          unit: 'MB',
        },
        environment: process.env.NODE_ENV || 'development',
      },
      clients: {
        total: totalClients,
      },
      packets: {
        total: totalPackets,
        byStatus: {
          pending: pendingPackets,
          generating: generatingPackets,
          ready: readyPackets,
          failed: failedPackets,
        },
        metrics: {
          successRate: `${successRate}%`,
          failureRate: `${failureRate}%`,
          avgGenerationTime: `${avgGenerationTime.toFixed(2)}s`,
        },
      },
      intake: {
        totalCompletions: intakeStats._count,
        avgCompletionTime: intakeStats._avg.completionTime
          ? `${Math.round(intakeStats._avg.completionTime / 60)}min`
          : 'N/A',
      },
      recentErrors: recentErrors.map(packet => ({
        id: packet.id,
        type: packet.type,
        client: {
          id: packet.client.id,
          name: packet.client.fullName,
          email: packet.client.email,
          type: packet.client.clientType,
        },
        error: packet.lastError,
        retryCount: packet.retryCount,
        timestamp: packet.updatedAt.toISOString(),
      })),
      recentCompletions: recentCompletions.map(packet => ({
        id: packet.id,
        type: packet.type,
        client: {
          id: packet.client.id,
          name: packet.client.fullName,
          type: packet.client.clientType,
        },
        generationTime: `${((packet.updatedAt.getTime() - packet.createdAt.getTime()) / 1000).toFixed(2)}s`,
        timestamp: packet.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('[Monitoring Dashboard] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch monitoring data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
