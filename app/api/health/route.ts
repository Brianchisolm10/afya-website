import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Health Check Endpoint
 * 
 * Returns the health status of the application and its dependencies.
 * Used by monitoring systems and load balancers.
 */
export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    const dbResponseTime = Date.now() - startTime;
    
    // Get basic system info
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: 'connected',
          responseTime: `${dbResponseTime}ms`,
        },
        application: {
          status: 'running',
          uptime: `${Math.floor(uptime)}s`,
          memory: {
            used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          },
        },
      },
    });
  } catch (error) {
    console.error('[Health Check] Failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 503 });
  }
}
