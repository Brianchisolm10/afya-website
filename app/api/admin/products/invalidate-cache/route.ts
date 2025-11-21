import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { invalidateCache } from '@/lib/cache';
import { revalidatePath } from 'next/cache';

// Cache invalidation endpoint for shop products (Requirement 12.3)
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { productId, category } = body;
    
    // Invalidate specific product cache
    if (productId) {
      invalidateCache(`product:${productId}`);
    }
    
    // Invalidate category cache
    if (category) {
      invalidateCache(`products:list:category:${category}`);
    }
    
    // Invalidate all products cache
    invalidateCache('products:list:category:all');
    
    // Revalidate shop page
    revalidatePath('/shop');
    
    return NextResponse.json({
      success: true,
      message: 'Product cache invalidated successfully',
    });
  } catch (error) {
    console.error('Error invalidating product cache:', error);
    return NextResponse.json(
      { error: 'Failed to invalidate cache' },
      { status: 500 }
    );
  }
}
