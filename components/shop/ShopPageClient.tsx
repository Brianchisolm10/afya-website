'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Section from '@/components/ui/Section';
import ProductGrid from '@/components/shop/ProductGrid';
import { Product } from '@/components/shop/ProductCard';
import Button from '@/components/ui/Button';
import { 
  createOptimizedObserver, 
  saveScrollPosition, 
  restoreScrollPosition 
} from '@/lib/shop/scroll-utils';

type ProductCategory = 'all' | 'apparel' | 'accessories' | 'drops' | 'collections';

const categories: { value: ProductCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'drops', label: 'Drops' },
  { value: 'collections', label: 'Collections' },
];

interface ShopPageClientProps {
  initialProducts: Product[];
  initialCategory: string;
  totalCount: number;
}

export default function ShopPageClient({
  initialProducts,
  initialCategory,
  totalCount,
}: ShopPageClientProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(
    initialCategory as ProductCategory
  );
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length < totalCount);
  const [cartItemCount, setCartItemCount] = useState(0);
  
  // Intersection observer ref for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch cart count on mount
  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/shop/cart');
      if (response.ok) {
        const data = await response.json();
        setCartItemCount(data.itemCount || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/shop/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCartItemCount(data.itemCount);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleCategoryChange = async (category: ProductCategory) => {
    setSelectedCategory(category);
    setIsLoading(true);
    
    // Update URL
    const params = new URLSearchParams();
    if (category !== 'all') {
      params.set('category', category);
    }
    const newUrl = params.toString() ? `/shop?${params.toString()}` : '/shop';
    router.push(newUrl, { scroll: false });
    
    // Fetch products for new category
    try {
      const response = await fetch(`/api/shop/products?category=${category}&limit=12`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more products (infinite scroll) - Optimized with performance tracking
  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    const startTime = performance.now();
    
    try {
      const offset = products.length;
      const categoryParam = selectedCategory === 'all' ? '' : `&category=${selectedCategory}`;
      const response = await fetch(`/api/shop/products?limit=12&offset=${offset}${categoryParam}`);
      
      if (response.ok) {
        const data = await response.json();
        setProducts(prev => [...prev, ...data.products]);
        setHasMore(data.hasMore);
        
        // Track load time for monitoring
        const loadTime = performance.now() - startTime;
        if (loadTime > 1000) {
          console.warn(`Slow product load: ${loadTime}ms`);
        }
      }
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [products.length, selectedCategory, hasMore, isLoadingMore]);

  // Save/restore scroll position on navigation
  useEffect(() => {
    // Restore scroll position if returning to page
    restoreScrollPosition('shop-scroll-position');
    
    // Save scroll position before leaving
    return () => {
      saveScrollPosition('shop-scroll-position');
    };
  }, []);

  // Optimized intersection observer for infinite scroll (Requirement 4.4)
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = createOptimizedObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreProducts();
        }
      },
      {
        rootMargin: '200px', // Load before user reaches bottom
        threshold: 0.1,
      }
    );

    const currentRef = loadMoreRef.current;
    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, loadMoreProducts]);

  return (
    <>
      {/* Cart Button - Fixed position */}
      {cartItemCount > 0 && (
        <div className="fixed top-20 right-4 z-50">
          <button
            onClick={() => router.push('/shop/checkout')}
            className="relative bg-gradient-to-r from-[#40E0D0] to-[#9370DB] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
            aria-label={`View cart with ${cartItemCount} items`}
          >
            View Cart
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {cartItemCount}
            </span>
          </button>
        </div>
      )}

      {/* Category Filter Tabs */}
      <Section variant="default" spacing="md">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              disabled={isLoading}
              className={`
                px-6 py-3 min-h-[44px] rounded-lg font-semibold transition-all duration-200 flex items-center justify-center
                ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-br from-[#40E0D0] to-[#9370DB] text-white shadow-md'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#40E0D0] hover:text-[#40E0D0]'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              aria-pressed={selectedCategory === category.value}
              aria-label={`Filter by ${category.label}`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Product Grid */}
      <Section variant="default" spacing="lg">
        <ProductGrid
          products={products}
          isLoading={isLoading}
          onAddToCart={handleAddToCart}
        />
        
        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="mt-8 flex justify-center">
            {isLoadingMore && (
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#40E0D0] rounded-full animate-spin" />
                <span>Loading more products...</span>
              </div>
            )}
          </div>
        )}
        
        {/* Manual load more button (fallback) */}
        {hasMore && !isLoadingMore && products.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={loadMoreProducts}
              disabled={isLoadingMore}
            >
              Load More Products
            </Button>
          </div>
        )}
        
        {/* End of products message */}
        {!hasMore && products.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p>You've reached the end of our collection</p>
          </div>
        )}
      </Section>
    </>
  );
}
