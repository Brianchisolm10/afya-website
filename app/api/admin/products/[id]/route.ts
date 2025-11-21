import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import prisma from '@/lib/db';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['APPAREL', 'ACCESSORIES', 'DROPS', 'COLLECTIONS']),
  images: z.array(z.string().url()).default([]),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  inventory: z.number().int().min(0, 'Inventory cannot be negative'),
  isActive: z.boolean().default(true),
  isDrop: z.boolean().default(false),
  dropStartDate: z.string().datetime().nullable().optional(),
  dropEndDate: z.string().datetime().nullable().optional(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only')
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
    return { authorized: false, status: 403, error: 'Forbidden - Admin access required' };
  }

  return { authorized: true };
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if slug is taken by another product
    if (validatedData.slug !== existingProduct.slug) {
      const slugTaken = await prisma.product.findUnique({
        where: { slug: validatedData.slug }
      });

      if (slugTaken) {
        return NextResponse.json(
          { error: 'A product with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        category: validatedData.category,
        images: JSON.stringify(validatedData.images),
        sizes: validatedData.sizes ? JSON.stringify(validatedData.sizes) : null,
        colors: validatedData.colors ? JSON.stringify(validatedData.colors) : null,
        inventory: validatedData.inventory,
        isActive: validatedData.isActive,
        isDrop: validatedData.isDrop,
        dropStartDate: validatedData.dropStartDate ? new Date(validatedData.dropStartDate) : null,
        dropEndDate: validatedData.dropEndDate ? new Date(validatedData.dropEndDate) : null,
        slug: validatedData.slug
      }
    });

    return NextResponse.json({
      product: {
        ...product,
        images: JSON.parse(product.images as string),
        sizes: product.sizes ? JSON.parse(product.sizes) : null,
        colors: product.colors ? JSON.parse(product.colors) : null
      }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
