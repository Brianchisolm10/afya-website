import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/authorization';
import { z } from 'zod';

// Validation schema for updating templates
const updateTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').optional(),
  packetType: z.enum(['INTRO', 'NUTRITION', 'WORKOUT', 'PERFORMANCE', 'YOUTH', 'RECOVERY', 'WELLNESS']).optional(),
  clientType: z.enum(['NUTRITION_ONLY', 'WORKOUT_ONLY', 'FULL_PROGRAM', 'ATHLETE_PERFORMANCE', 'YOUTH', 'GENERAL_WELLNESS', 'SPECIAL_SITUATION']).optional().nullable(),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    order: z.number(),
    contentBlockIds: z.array(z.string()),
    conditionalDisplay: z.any().optional()
  })).optional(),
  contentBlocks: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'table', 'list', 'chart', 'image', 'heading', 'divider']),
    content: z.string(),
    dataSource: z.string().optional(),
    formatting: z.any().optional(),
    conditionalDisplay: z.any().optional(),
    order: z.number()
  })).optional(),
  isDefault: z.boolean().optional()
});

/**
 * GET /api/admin/templates/[id]
 * Retrieves a specific packet template
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify ADMIN or COACH role authorization
    const authResult = await requireRole(request, ['ADMIN', 'COACH']);
    if (!authResult.authorized) {
      return authResult.response;
    }
    
    // Fetch template
    const template = await prisma.packetTemplate.findUnique({
      where: { id: params.id }
    });
    
    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: template
    });
    
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/templates/[id]
 * Updates a packet template
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify ADMIN role authorization
    const authResult = await requireRole(request, 'ADMIN');
    if (!authResult.authorized) {
      return authResult.response;
    }
    
    // Check if template exists
    const existingTemplate = await prisma.packetTemplate.findUnique({
      where: { id: params.id }
    });
    
    if (!existingTemplate) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateTemplateSchema.parse(body);
    
    // Check if trying to set as default when another default exists
    if (validatedData.isDefault === true) {
      const packetType = validatedData.packetType || existingTemplate.packetType;
      const clientType = validatedData.clientType !== undefined ? validatedData.clientType : existingTemplate.clientType;
      
      const existingDefault = await prisma.packetTemplate.findFirst({
        where: {
          id: { not: params.id },
          packetType,
          clientType,
          isDefault: true
        }
      });
      
      if (existingDefault) {
        // Unset the existing default
        await prisma.packetTemplate.update({
          where: { id: existingDefault.id },
          data: { isDefault: false }
        });
      }
    }
    
    // Update template
    const template = await prisma.packetTemplate.update({
      where: { id: params.id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.packetType && { packetType: validatedData.packetType }),
        ...(validatedData.clientType !== undefined && { clientType: validatedData.clientType }),
        ...(validatedData.sections && { sections: validatedData.sections as any }),
        ...(validatedData.contentBlocks && { contentBlocks: validatedData.contentBlocks as any }),
        ...(validatedData.isDefault !== undefined && { isDefault: validatedData.isDefault })
      }
    });
    
    return NextResponse.json({
      success: true,
      data: template,
      message: 'Template updated successfully'
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues
      }, { status: 400 });
    }
    console.error('Error updating template:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/templates/[id]
 * Deletes a packet template
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify ADMIN role authorization
    const authResult = await requireRole(request, 'ADMIN');
    if (!authResult.authorized) {
      return authResult.response;
    }
    
    // Check if template exists
    const template = await prisma.packetTemplate.findUnique({
      where: { id: params.id }
    });
    
    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }
    
    // Check if template is being used by any packets
    const packetsUsingTemplate = await prisma.packet.count({
      where: { templateId: params.id }
    });
    
    if (packetsUsingTemplate > 0) {
      return NextResponse.json({
        success: false,
        error: `Cannot delete template: ${packetsUsingTemplate} packet(s) are using this template`
      }, { status: 400 });
    }
    
    // Delete template
    await prisma.packetTemplate.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
