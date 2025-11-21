import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { z } from 'zod';

// Validation schema for donation request
const donationSchema = z.object({
  amount: z.number().min(1, 'Donation amount must be at least $1'),
  donorName: z.string().min(1, 'Donor name is required'),
  donorEmail: z.string().email('Valid email is required'),
  allocation: z.enum(['FOUNDATIONS', 'SPONSOR_A_CLIENT'], {
    errorMap: () => ({ message: 'Please select a donation allocation' }),
  }),
  isRecurring: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = donationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const { amount, donorName, donorEmail, allocation, isRecurring } = validationResult.data;
    
    // Convert amount to cents for Stripe
    const amountInCents = Math.round(amount * 100);
    
    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        donorName,
        donorEmail,
        allocation,
        isRecurring: isRecurring.toString(),
        type: 'donation',
      },
      description: `Donation to AFYA - ${allocation === 'FOUNDATIONS' ? 'Foundations & Donations' : 'Sponsor-A-Client Program'}`,
      receipt_email: donorEmail,
    });
    
    // Create donation record in database
    const donation = await prisma.donation.create({
      data: {
        donorName,
        donorEmail,
        amount,
        allocation,
        isRecurring,
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'PENDING',
      },
    });
    
    // Update community stats (will be finalized on payment confirmation)
    // This is a placeholder - actual update happens in webhook
    
    return NextResponse.json({
      donationId: donation.id,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Donation creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process donation' },
      { status: 500 }
    );
  }
}
