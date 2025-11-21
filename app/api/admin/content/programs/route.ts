import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import prisma from '@/lib/db';
import { z } from 'zod';

const programSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  gradient: z.string().min(1),
  clientType: z.string().min(1),
  isActive: z.boolean(),
  order: z.number().int()
});

async function checkAdminAuth() {
  const session = await getServerSession(authConfig);
  if (!session?.user) {
    return { authorized: false, status: 401, error: 'Unauthorized' };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (user?.role !== 'ADMIN') {
    return { authorized: false, status: 403, error: 'Forbidden' };
  }

  return { authorized: true };
}

export async function GET() {
  try {
    const auth = await checkAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const programs = await prisma.programContent.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ programs });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const validatedData = programSchema.parse(body);

    const program = await prisma.programContent.create({
      data: validatedData
    });

    return NextResponse.json({ program }, { status: 201 });
  } catch (error) {
    console.error('Error creating program:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create program' }, { status: 500 });
  }
}
