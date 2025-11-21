import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface Cart {
  items: CartItem[];
}

// Helper to get cart from cookies
function getCartFromCookies(request: NextRequest): Cart {
  const cartCookie = request.cookies.get('cart');
  if (!cartCookie) {
    return { items: [] };
  }
  
  try {
    return JSON.parse(cartCookie.value);
  } catch {
    return { items: [] };
  }
}

// Helper to set cart cookie
function setCartCookie(response: NextResponse, cart: Cart) {
  response.cookies.set('cart', JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// GET /api/shop/cart - Get current cart with product details
export async function GET(request: NextRequest) {
  try {
    const cart = getCartFromCookies(request);
    
    if (cart.items.length === 0) {
      return NextResponse.json({
        items: [],
        subtotal: 0,
        itemCount: 0,
      });
    }
    
    // Get product details for all items in cart
    const productIds = cart.items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        slug: true,
        inventory: true,
        sizes: true,
        colors: true,
      },
    });
    
    // Build cart items with product details
    const cartItems = cart.items.map(item => {
      const product = products.find((p: any) => p.id === item.productId);
      if (!product) return null;
      
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        images: product.images ? JSON.parse(product.images) : [],
        slug: product.slug,
        inventory: product.inventory,
        subtotal: product.price * item.quantity,
      };
    }).filter(Boolean);
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item?.subtotal || 0), 0);
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    return NextResponse.json({
      items: cartItems,
      subtotal,
      itemCount,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/shop/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity, size, color } = body;
    
    // Validate input
    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid product or quantity' },
        { status: 400 }
      );
    }
    
    // Verify product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      select: { id: true, inventory: true, name: true },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Get current cart
    const cart = getCartFromCookies(request);
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => 
        item.productId === productId &&
        item.size === size &&
        item.color === color
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      // Check inventory
      if (newQuantity > product.inventory) {
        return NextResponse.json(
          { error: 'Insufficient inventory' },
          { status: 400 }
        );
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Check inventory
      if (quantity > product.inventory) {
        return NextResponse.json(
          { error: 'Insufficient inventory' },
          { status: 400 }
        );
      }
      
      // Add new item
      cart.items.push({
        productId,
        quantity,
        size,
        color,
      });
    }
    
    // Create response and set cookie
    const response = NextResponse.json({
      message: 'Item added to cart',
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    });
    
    setCartCookie(response, cart);
    
    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}
