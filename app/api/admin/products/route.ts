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

// GET /api/admin/products - List all products
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Parse JSON fields
    const formattedProducts = products.map(product => ({
      ...product,
      images: JSON.parse(product.images as string),
      sizes: product.sizes ? JSON.parse(product.sizes) : null,
      colors: product.colors ? JSON.parse(product.colors) : null
    }));

    return NextResponse.json({
      products: formattedProducts
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: validatedData.slug }
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
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
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
