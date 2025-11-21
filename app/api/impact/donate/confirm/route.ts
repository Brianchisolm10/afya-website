import { NextRequest, NextResponse } from 'next/server';
import { sendDonationConfirmationEmail } from '@/lib/email';

interface ConfirmRequest {
  donationId: string;
  donorEmail: string;
  donorName: string;
  amount: number;
  allocation: 'FOUNDATIONS' | 'SPONSOR_A_CLIENT';
  receiptNumber: string;
  isRecurring?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: ConfirmRequest = await request.json();
    const { 
      donationId, 
      donorEmail, 
      donorName, 
      amount, 
      allocation, 
      receiptNumber,
      isRecurring = false 
    } = body;

    if (!donationId || !donorEmail || !donorName || !amount || !allocation || !receiptNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send confirmation email
    await sendDonationConfirmationEmail(
      donorEmail,
      donorName,
      amount,
      allocation,
      receiptNumber,
      isRecurring
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Donation confirmation email error:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}
