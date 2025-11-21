'use client';

import { useState, useEffect } from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  generateProductBlurDataURL, 
  getProductImageSizes, 
  getProductImageQuality 
} from '@/lib/shop/image-utils';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  inventory: number;
  isDrop?: boolean;
  dropStartDate?: Date;
  dropEndDate?: Date;
  slug: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  priority?: boolean; // For above-the-fold images
}

export default function ProductCard({ product, onAddToCart, priority = false }: ProductCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Calculate countdown timer for drops
  useEffect(() => {
    if (!product.isDrop || !product.dropEndDate) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const endTime = new Date(product.dropEndDate!).getTime();
      const distance = endTime - now;

      if (distance < 0) {
        setTimeRemaining('Ended');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [product.isDrop, product.dropEndDate]);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  const isOutOfStock = product.inventory === 0;
  const primaryImage = product.images[0] || '/placeholder-product.png';

  return (
    <Card variant="hover" padding="none" className="overflow-hidden h-full flex flex-col">
      {/* Product Image - Progressive loading with blur placeholder (Requirement 4.2, 4.3) */}
      <div className="relative aspect-square bg-gray-100">
        <OptimizedImage
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover"
          sizes={getProductImageSizes()}
          fallbackSrc="/placeholder-product.png"
          priority={priority}
          quality={getProductImageQuality()}
          useBlurPlaceholder={true}
          blurDataURL={generateProductBlurDataURL()}
          lazyLoad={!priority}
          rootMargin="100px"
        />
        
        {/* Drop Badge */}
        {product.isDrop && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-br from-[#40E0D0] to-[#9370DB] text-white shadow-md">
              DROP
            </span>
          </div>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-white text-gray-900 font-semibold rounded-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-2xl font-bold text-gray-900 mb-3">
          ${product.price.toFixed(2)}
        </p>

        {/* Countdown Timer for Drops */}
        {product.isDrop && timeRemaining && (
          <div className="mb-3">
            <p className="text-sm text-gray-600">
              {timeRemaining === 'Ended' ? (
                <span className="text-red-600 font-semibold">Drop Ended</span>
              ) : (
                <>
                  <span className="font-semibold text-[#9370DB]">Ends in:</span>{' '}
                  <span className="font-mono font-semibold">{timeRemaining}</span>
                </>
              )}
            </p>
          </div>
        )}

        {/* Available Sizes/Colors Info */}
        {(product.sizes && product.sizes.length > 0) && (
          <p className="text-xs text-gray-500 mb-3">
            Sizes: {product.sizes.join(', ')}
          </p>
        )}

        {/* Add to Cart Button */}
        <div className="mt-auto">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleAddToCart}
            disabled={isOutOfStock || (product.isDrop && timeRemaining === 'Ended')}
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
