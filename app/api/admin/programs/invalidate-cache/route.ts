import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { invalidateProgramsCache } from '@/lib/programs/cache';

/**
 * POST /api/admin/programs/invalidate-cache
 * 
 * Invalidate programs cache when data is updated
 * Admin only
 */
export async function POST() {
  try {
    // Check authentication
    const session = await getServerSession(authConfig);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Invalidate cache
    invalidateProgramsCache();

    return NextResponse.json({
      success: true,
      message: 'Programs cache invalidated successfully',
    });
  } catch (error) {
    console.error('Error invalidating programs cache:', error);
    return NextResponse.json(
      { error: 'Failed to invalidate cache' },
      { status: 500 }
    );
  }
}
