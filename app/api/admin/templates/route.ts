import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/authorization';
import { z } from 'zod';

// Validation schema for creating/updating templates
const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  packetType: z.enum(['INTRO', 'NUTRITION', 'WORKOUT', 'PERFORMANCE', 'YOUTH', 'RECOVERY', 'WELLNESS']),
  clientType: z.enum(['NUTRITION_ONLY', 'WORKOUT_ONLY', 'FULL_PROGRAM', 'ATHLETE_PERFORMANCE', 'YOUTH', 'GENERAL_WELLNESS', 'SPECIAL_SITUATION']).optional().nullable(),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    order: z.number(),
    contentBlockIds: z.array(z.string()),
    conditionalDisplay: z.any().optional()
  })),
  contentBlocks: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'table', 'list', 'chart', 'image', 'heading', 'divider']),
    content: z.string(),
    dataSource: z.string().optional(),
    formatting: z.any().optional(),
    conditionalDisplay: z.any().optional(),
    order: z.number()
  })),
  isDefault: z.boolean().default(false)
});

/**
 * GET /api/admin/templates
 * Retrieves all packet templates
 */
export async function GET(request: NextRequest) {
  try {
    // Verify ADMIN or COACH role authorization
    const authResult = await requireRole(request, ['ADMIN', 'COACH']);
    if (!authResult.authorized) {
      return authResult.response;
    }
    
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const packetType = searchParams.get('packetType');
    const clientType = searchParams.get('clientType');
    const isDefault = searchParams.get('isDefault');
    
    // Build filter
    const where: any = {};
    if (packetType) {
      where.packetType = packetType;
    }
    if (clientType) {
      where.clientType = clientType;
    }
    if (isDefault !== null && isDefault !== undefined) {
      where.isDefault = isDefault === 'true';
    }
    
    // Fetch templates
    const templates = await prisma.packetTemplate.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' },
        { packetType: 'asc' },
        { name: 'asc' }
      ]
    });
    
    return NextResponse.json({
      success: true,
      data: templates
    });
    
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/templates
 * Creates a new packet template
 */
export async function POST(request: NextRequest) {
  try {
    // Verify ADMIN role authorization
    const authResult = await requireRole(request, 'ADMIN');
    if (!authResult.authorized) {
      return authResult.response;
    }
    const session = authResult.session!;
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = templateSchema.parse(body);
    
    // Check if a default template already exists for this packet type
    if (validatedData.isDefault) {
      const existingDefault = await prisma.packetTemplate.findFirst({
        where: {
          packetType: validatedData.packetType,
          clientType: validatedData.clientType,
          isDefault: true
        }
      });
      
      if (existingDefault) {
        return NextResponse.json({
          success: false,
          error: `A default template already exists for ${validatedData.packetType}${validatedData.clientType ? ` and ${validatedData.clientType}` : ''}`
        }, { status: 400 });
      }
    }
    
    // Create template
    const template = await prisma.packetTemplate.create({
      data: {
        name: validatedData.name,
        packetType: validatedData.packetType,
        clientType: validatedData.clientType,
        sections: validatedData.sections as any,
        contentBlocks: validatedData.contentBlocks as any,
        isDefault: validatedData.isDefault,
        createdBy: session.user.id
      }
    });
    
    return NextResponse.json({
      success: true,
      data: template,
      message: 'Template created successfully'
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues
      }, { status: 400 });
    }
    console.error('Error creating template:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
