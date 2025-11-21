import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ProductCategory } from '@prisma/client';
import { cachedFetch, generateCacheKey, CACHE_TTL } from '@/lib/cache';

// Enable ISR with 5 minute revalidation
export const revalidate = 300;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const category = searchParams.get('category') as ProductCategory | null;
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Generate cache key based on query parameters
    const cacheKey = generateCacheKey('products:list', {
      category: category || 'all',
      search: search || '',
      limit,
      offset,
    });
    
    // Fetch with caching
    const result = await cachedFetch(
      cacheKey,
      async () => {
        // Build where clause
        const where: any = {
          isActive: true,
        };
        
        // Filter by category if provided
        if (category && Object.values(ProductCategory).includes(category)) {
          where.category = category;
        }
        
        // Search by name or description if provided
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ];
        }
        
        // Get total count for pagination
        const total = await prisma.product.count({ where });
        
        // Get products with pagination
        const products = await prisma.product.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: [
            { isDrop: 'desc' }, // Show drops first
            { createdAt: 'desc' },
          ],
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
          },
        });
        
        // Parse JSON fields
        const parsedProducts = products.map(product => ({
          ...product,
          images: product.images ? JSON.parse(product.images) : [],
          sizes: product.sizes ? JSON.parse(product.sizes) : [],
          colors: product.colors ? JSON.parse(product.colors) : [],
        }));
        
        return {
          products: parsedProducts,
          total,
          hasMore: offset + limit < total,
          limit,
          offset,
        };
      },
      CACHE_TTL.MEDIUM // 5 minutes cache
    );
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
