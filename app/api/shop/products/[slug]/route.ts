import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cachedFetch, CACHE_TTL } from '@/lib/cache';

// Enable ISR with 10 minute revalidation for product pages
export const revalidate = 600;

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Fetch with caching
    const result = await cachedFetch(
      `product:${slug}`,
      async () => {
        // Get the product by slug
        const product = await prisma.product.findUnique({
          where: {
            slug,
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            category: true,
            images: true,
            sizes: true,
            colors: true,
            inventory: true,
            isDrop: true,
            dropStartDate: true,
            dropEndDate: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        
        if (!product) {
          throw new Error('Product not found');
        }
        
        // Parse JSON fields
        const parsedProduct = {
          ...product,
          images: product.images ? JSON.parse(product.images) : [],
          sizes: product.sizes ? JSON.parse(product.sizes) : [],
          colors: product.colors ? JSON.parse(product.colors) : [],
        };
        
        // Get related products (same category, excluding current product)
        const relatedProducts = await prisma.product.findMany({
          where: {
            category: product.category,
            isActive: true,
            id: { not: product.id },
          },
          take: 4,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true,
            isDrop: true,
            dropEndDate: true,
          },
        });
        
        // Parse JSON fields for related products
        const parsedRelatedProducts = relatedProducts.map((p: any) => ({
          ...p,
          images: p.images ? JSON.parse(p.images) : [],
        }));
        
        return {
          product: parsedProduct,
          relatedProducts: parsedRelatedProducts,
        };
      },
      CACHE_TTL.LONG // 30 minutes cache for product details
    );
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    
    // Check if it's a "not found" error
    if (error instanceof Error && error.message === 'Product not found') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
