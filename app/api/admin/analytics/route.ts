/**
 * Admin Analytics API
 * 
 * Provides intake analytics data for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/get-session';
import { prisma } from '@/lib/db';

/**
 * GET /api/admin/analytics
 * Fetch intake analytics data
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
    const allAnalytics = await prisma.intakeAnalytics.findMany({
      orderBy: { startedAt: 'desc' }
    });

    // Calculate completion rates by client type
    const completionRates: Record<string, { total: number; completed: number; rate: number }> = {};
    
    const clientTypes = [
      'NUTRITION_ONLY',
      'WORKOUT_ONLY',
      'FULL_PROGRAM',
      'ATHLETE_PERFORMANCE',
      'YOUTH',
      'GENERAL_WELLNESS',
      'SPECIAL_SITUATION'
    ];
    
    for (const clientType of clientTypes) {
      const records = allAnalytics.filter((a: any) => a.clientType === clientType);
      const completed = records.filter((a: any) => a.completedAt !== null).length;
      const total = records.length;
      
      completionRates[clientType] = {
        total,
        completed,
        rate: total > 0 ? (completed / total) * 100 : 0
      };
    }

    // Calculate average completion times by client type
    const avgCompletionTimes: Record<string, number> = {};
    
    for (const clientType of clientTypes) {
      const completedRecords = allAnalytics.filter(
        (a: any) => a.clientType === clientType && a.completionTime !== null
      );
      
      if (completedRecords.length > 0) {
        const totalTime = completedRecords.reduce(
          (sum: number, record: any) => sum + (record.completionTime || 0),
          0
        );
        avgCompletionTimes[clientType] = Math.round(totalTime / completedRecords.length);
      } else {
        avgCompletionTimes[clientType] = 0;
      }
    }

    // Identify high-abandonment steps
    const abandonmentByStep: Record<number, number> = {};
    const abandonedRecords = allAnalytics.filter((a: any) => a.dropOffStep !== null);
    
    for (const record of abandonedRecords) {
      const step = record.dropOffStep!;
      abandonmentByStep[step] = (abandonmentByStep[step] || 0) + 1;
    }

    // Sort by frequency
    const highAbandonmentSteps = Object.entries(abandonmentByStep)
      .map(([step, count]) => ({ step: parseInt(step), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get demographic and goal distributions from clients
    const clients = await prisma.client.findMany({
      where: {
        intakeCompletedAt: { not: null }
      },
      select: {
        clientType: true,
        goal: true,
        gender: true,
        activityLevel: true,
        trainingExperience: true
      }
    });

    // Calculate distributions
    const clientTypeDistribution: Record<string, number> = {};
    const goalDistribution: Record<string, number> = {};
    const genderDistribution: Record<string, number> = {};
    const activityLevelDistribution: Record<string, number> = {};
    const experienceDistribution: Record<string, number> = {};

    for (const client of clients) {
      // Client type
      if (client.clientType) {
        clientTypeDistribution[client.clientType] = 
          (clientTypeDistribution[client.clientType] || 0) + 1;
      }
      
      // Goal
      if (client.goal) {
        goalDistribution[client.goal] = (goalDistribution[client.goal] || 0) + 1;
      }
      
      // Gender
      if (client.gender) {
        genderDistribution[client.gender] = (genderDistribution[client.gender] || 0) + 1;
      }
      
      // Activity level
      if (client.activityLevel) {
        activityLevelDistribution[client.activityLevel] = 
          (activityLevelDistribution[client.activityLevel] || 0) + 1;
      }
      
      // Experience
      if (client.trainingExperience) {
        experienceDistribution[client.trainingExperience] = 
          (experienceDistribution[client.trainingExperience] || 0) + 1;
      }
    }

    // Calculate overall stats
    const totalIntakes = allAnalytics.length;
    const completedIntakes = allAnalytics.filter(a => a.completedAt !== null).length;
    const abandonedIntakes = allAnalytics.filter(a => a.abandonedAt !== null).length;
    const overallCompletionRate = totalIntakes > 0 ? (completedIntakes / totalIntakes) * 100 : 0;

    return NextResponse.json({
      overview: {
        totalIntakes,
        completedIntakes,
        abandonedIntakes,
        overallCompletionRate: Math.round(overallCompletionRate * 100) / 100
      },
      completionRates,
      avgCompletionTimes,
      highAbandonmentSteps,
      distributions: {
        clientType: clientTypeDistribution,
        goal: goalDistribution,
        gender: genderDistribution,
        activityLevel: activityLevelDistribution,
        experience: experienceDistribution
      }
    });
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
