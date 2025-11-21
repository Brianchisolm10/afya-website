import { NextRequest, NextResponse } from 'next/server';

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

// DELETE /api/shop/cart/[itemId] - Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    
    // itemId format: productId or productId-size-color
    const cart = getCartFromCookies(request);
    
    // Parse itemId to match cart items
    const [productId, size, color] = itemId.split('-');
    
    // Find and remove the item
    const itemIndex = cart.items.findIndex(item => {
      if (item.productId !== productId) return false;
      if (size && item.size !== size) return false;
      if (color && item.color !== color) return false;
      return true;
    });
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }
    
    // Remove the item
    cart.items.splice(itemIndex, 1);
    
    // Create response and set cookie
    const response = NextResponse.json({
      message: 'Item removed from cart',
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    });
    
    setCartCookie(response, cart);
    
    return response;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}

// PATCH /api/shop/cart/[itemId] - Update item quantity
export async function PATCH(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    const body = await request.json();
    const { quantity } = body;
    
    if (!quantity || quantity < 0) {
      return NextResponse.json(
        { error: 'Invalid quantity' },
        { status: 400 }
      );
    }
    
    const cart = getCartFromCookies(request);
    
    // Parse itemId to match cart items
    const [productId, size, color] = itemId.split('-');
    
    // Find the item
    const itemIndex = cart.items.findIndex(item => {
      if (item.productId !== productId) return false;
      if (size && item.size !== size) return false;
      if (color && item.color !== color) return false;
      return true;
    });
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }
    
    // If quantity is 0, remove the item
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
    
    // Create response and set cookie
    const response = NextResponse.json({
      message: 'Cart updated',
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    });
    
    setCartCookie(response, cart);
    
    return response;
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
