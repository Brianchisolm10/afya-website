import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/authorization';

export async function GET(request: NextRequest) {
  try {
    // Verify ADMIN role authorization
    const authResult = await requireRole(request, 'ADMIN');
    if (!authResult.authorized) {
      return authResult.response;
    }
    const session = authResult.session!;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const roleFilter = searchParams.get('role');
    const statusFilter = searchParams.get('status');

    // Build where clause
    const where: any = {};

    // Add search filter (name or email)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add role filter
    if (roleFilter && ['CLIENT', 'COACH', 'ADMIN'].includes(roleFilter)) {
      where.role = roleFilter;
    }

    // Add status filter
    if (statusFilter && ['ACTIVE', 'SUSPENDED', 'DEACTIVATED'].includes(statusFilter)) {
      where.status = statusFilter;
    }

    // Fetch users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data for response
    const usersData = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
    }));

    return NextResponse.json({ users: usersData });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
