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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const validatedData = programSchema.parse(body);

    const program = await prisma.programContent.update({
      where: { id: params.id },
      data: validatedData
    });

    return NextResponse.json({ program });
  } catch (error) {
    console.error('Error updating program:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await prisma.programContent.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Program deleted' });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 });
  }
}
