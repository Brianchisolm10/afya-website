import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import prisma from '@/lib/db';
import { z } from 'zod';

const impactSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  stats: z.any().nullable().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  isActive: z.boolean(),
  comingSoon: z.boolean(),
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

    const sections = await prisma.impactSectionContent.findMany({
      orderBy: { order: 'asc' }
    });

    const formattedSections = sections.map(section => ({
      ...section,
      stats: section.stats ? JSON.parse(section.stats) : null
    }));

    return NextResponse.json({ sections: formattedSections });
  } catch (error) {
    console.error('Error fetching impact sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const validatedData = impactSchema.parse(body);

    const section = await prisma.impactSectionContent.create({
      data: {
        ...validatedData,
        stats: validatedData.stats ? JSON.stringify(validatedData.stats) : null
      }
    });

    return NextResponse.json({
      section: {
        ...section,
        stats: section.stats ? JSON.parse(section.stats) : null
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating impact section:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}
