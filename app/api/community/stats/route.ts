import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cachedFetch } from '@/lib/cache';

// Cache for 10 minutes - stats don't need real-time updates on impact page
export const revalidate = 600;

const IMPACT_STATS_CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

export async function GET() {
  try {
    const stats = await cachedFetch(
      'community:stats',
      async () => {
        // Get or create community stats
        let data = await prisma.communityStats.findFirst();
        
        if (!data) {
          // Initialize with default values if not exists
          data = await prisma.communityStats.create({
            data: {
              totalMinutesMoved: 0,
              totalClientsServed: 0,
              totalDonationsRaised: 0,
              totalGearDonated: 0,
            },
          });
        }

        return {
          totalMinutesMoved: data.totalMinutesMoved,
          totalClientsServed: data.totalClientsServed,
          totalDonationsRaised: data.totalDonationsRaised,
          totalGearDonated: data.totalGearDonated,
          lastUpdated: data.lastUpdated,
        };
      },
      IMPACT_STATS_CACHE_TTL // 10 minutes cache for impact page
    );

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error) {
    console.error('Error fetching community stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community stats' },
      { status: 500 }
    );
  }
}
