import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { sendOrderConfirmationEmail } from '@/lib/email';

interface ConfirmRequest {
  orderId: string;
  paymentIntentId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ConfirmRequest = await request.json();
    const { orderId, paymentIntentId } = body;

    if (!orderId || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify payment intent status with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'COMPLETED',
      },
    });

    // Send order confirmation email
    try {
      const orderUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shop/order/${order.id}`;
      
      await sendOrderConfirmationEmail(
        order.customerEmail,
        order.customerName,
        order.orderNumber,
        order.total,
        order.donationAmount,
        order.donationAllocation,
        orderUrl
      );
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the confirmation if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error('Confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm order' },
      { status: 500 }
    );
  }
}
