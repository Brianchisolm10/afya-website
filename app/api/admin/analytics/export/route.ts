/**
 * Admin Analytics Export API
 * 
 * Exports analytics data as CSV
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/get-session';
import { prisma } from '@/lib/db';

/**
 * GET /api/admin/analytics/export
 * Export analytics data as CSV
 */
export async function GET(request: NextRequest) {
  try {
    // Verify ADMIN or COACH role authorization
    const { requireRole } = await import('@/lib/authorization');
    const authResult = await requireRole(request, ['ADMIN', 'COACH']);
    if (!authResult.authorized) {
      return authResult.response;
    }

    // Get all analytics records
    const analytics = await prisma.intakeAnalytics.findMany({
      orderBy: { startedAt: 'desc' }
    });

    // Generate CSV
    const headers = [
      'ID',
      'Client Type',
      'Started At',
      'Completed At',
      'Abandoned At',
      'Completion Time (seconds)',
      'Drop Off Step',
      'Status'
    ];

    const rows = analytics.map((record: any) => {
      const status = record.completedAt 
        ? 'Completed' 
        : record.abandonedAt 
        ? 'Abandoned' 
        : 'In Progress';

      return [
        record.id,
        record.clientType,
        record.startedAt.toISOString(),
        record.completedAt?.toISOString() || '',
        record.abandonedAt?.toISOString() || '',
        record.completionTime?.toString() || '',
        record.dropOffStep?.toString() || '',
        status
      ];
    });

    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(','))
    ].join('\n');

    // Return CSV response
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="intake-analytics-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
    
  } catch (error) {
    console.error('Error exporting analytics:', error);
    return NextResponse.json(
      { error: 'Failed to export analytics' },
      { status: 500 }
    );
  }
}
