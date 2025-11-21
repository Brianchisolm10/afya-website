import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(paymentIntent);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { orderId, type } = paymentIntent.metadata;

  // Handle donation payments
  if (type === 'donation') {
    const donation = await prisma.donation.findUnique({
      where: { paymentIntentId: paymentIntent.id },
    });

    if (!donation) {
      console.error('No donation found for payment intent');
      return;
    }

    // Update donation status
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        paymentStatus: 'COMPLETED',
        receiptNumber: `DON-${Date.now()}-${donation.id.slice(0, 8).toUpperCase()}`,
      },
    });

    // Update community stats
    await prisma.communityStats.update({
      where: { id: 'singleton' },
      data: {
        totalDonationsRaised: {
          increment: donation.amount,
        },
      },
    });

    console.log(`Donation payment succeeded for donation ${donation.id}`);
    return;
  }

  // Handle order payments
  if (!orderId) {
    console.error('No orderId in payment intent metadata');
    return;
  }

  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: 'COMPLETED',
      paymentIntentId: paymentIntent.id,
    },
  });

  console.log(`Payment succeeded for order ${orderId}`);
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const { orderId, type } = paymentIntent.metadata;

  // Handle donation payment failures
  if (type === 'donation') {
    const donation = await prisma.donation.findUnique({
      where: { paymentIntentId: paymentIntent.id },
    });

    if (donation) {
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          paymentStatus: 'FAILED',
        },
      });
      console.log(`Donation payment failed for donation ${donation.id}`);
    }
    return;
  }

  // Handle order payment failures
  if (!orderId) {
    console.error('No orderId in payment intent metadata');
    return;
  }

  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: 'FAILED',
      paymentIntentId: paymentIntent.id,
    },
  });

  console.log(`Payment failed for order ${orderId}`);
}

async function handleRefund(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent as string;

  if (!paymentIntentId) {
    console.error('No payment intent ID in charge');
    return;
  }

  // Find order by payment intent ID
  const order = await prisma.order.findFirst({
    where: { paymentIntentId },
  });

  if (!order) {
    console.error(`No order found for payment intent ${paymentIntentId}`);
    return;
  }

  // Update order status
  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: 'REFUNDED',
    },
  });

  console.log(`Refund processed for order ${order.id}`);
}
