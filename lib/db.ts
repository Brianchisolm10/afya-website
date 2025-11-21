import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Add performance monitoring middleware for production
if (process.env.NODE_ENV === 'production') {
  prisma.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    const duration = after - before;

    // Log slow queries (> 1 second)
    if (duration > 1000) {
      console.warn('[Slow Query]', {
        model: params.model,
        action: params.action,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      });
    }

    // Log very slow queries (> 5 seconds)
    if (duration > 5000) {
      console.error('[Very Slow Query]', {
        model: params.model,
        action: params.action,
        duration: `${duration}ms`,
        args: params.args,
        timestamp: new Date().toISOString(),
      });
    }

    return result;
  });
}
