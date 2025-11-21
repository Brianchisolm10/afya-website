import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { DonationAllocation } from '@prisma/client';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { stripe } from '@/lib/stripe';

interface CheckoutRequest {
  items: Array<{
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
    price: number;
  }>;
  donationAllocation: DonationAllocation;
  subtotal: number;
  donationAmount: number;
  tax: number;
  shipping: number;
  total: number;
  customerEmail?: string;
  customerName?: string;
  shippingAddress?: any;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    
    const {
      items,
      donationAllocation,
      subtotal,
      donationAmount,
      tax,
      shipping,
      total,
      customerEmail = 'guest@example.com',
      customerName = 'Guest Customer',
      shippingAddress = {},
    } = body;
    
    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    if (!donationAllocation) {
      return NextResponse.json(
        { error: 'Donation allocation is required' },
        { status: 400 }
      );
    }
    
    // Validate donation allocation value
    if (!['FOUNDATIONS', 'SPONSOR_A_CLIENT'].includes(donationAllocation)) {
      return NextResponse.json(
        { error: 'Invalid donation allocation' },
        { status: 400 }
      );
    }
    
    // Generate order number
    const orderNumber = `AFYA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Create order with donation allocation
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail,
        customerName,
        shippingAddress,
        subtotal,
        tax,
        shipping,
        total,
        donationAmount,
        donationAllocation, // Store the allocation choice
        paymentStatus: 'PENDING',
        fulfillmentStatus: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            priceAtPurchase: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        donationAllocation: order.donationAllocation,
        donationAmount: donationAmount.toString(),
      },
      automatic_payment_methods: {
        enabled: true, // Enables Apple Pay, Google Pay, and cards
      },
    });
    
    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'PROCESSING',
      },
    });
    
    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      donationAllocation: order.donationAllocation,
      donationAmount: order.donationAmount,
      total: order.total,
      clientSecret: paymentIntent.client_secret,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}
