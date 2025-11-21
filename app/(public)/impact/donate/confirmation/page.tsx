import { Suspense } from 'react';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';

interface DonationConfirmationProps {
  searchParams: {
    payment_intent?: string;
    payment_intent_client_secret?: string;
  };
}

async function getDonationDetails(paymentIntentId: string) {
  try {
    // Get payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return null;
    }
    
    // Get donation from database
    const donation = await prisma.donation.findUnique({
      where: { paymentIntentId },
    });
    
    if (!donation) {
      return null;
    }
    
    // Update donation status if not already updated
    if (donation.paymentStatus !== 'COMPLETED') {
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
    }
    
    return {
      ...donation,
      receiptNumber: donation.receiptNumber || `DON-${Date.now()}-${donation.id.slice(0, 8).toUpperCase()}`,
    };
  } catch (error) {
    console.error('Error fetching donation details:', error);
    return null;
  }
}

async function sendDonationConfirmationEmail(donation: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/impact/donate/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        donationId: donation.id,
        donorEmail: donation.donorEmail,
        donorName: donation.donorName,
        amount: donation.amount,
        allocation: donation.allocation,
        receiptNumber: donation.receiptNumber,
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to send confirmation email');
    }
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

function DonationConfirmationContent({ donation }: { donation: any }) {
  const allocationTitle = donation.allocation === 'FOUNDATIONS'
    ? 'Foundations & Donations'
    : 'Sponsor-A-Client Program';
  
  const allocationIcon = donation.allocation === 'FOUNDATIONS' ? '❤️' : '🤝';
  
  const allocationDescription = donation.allocation === 'FOUNDATIONS'
    ? 'Your contribution will support AFYA\'s general operations, community programs, and foundational initiatives that make movement accessible to everyone.'
    : 'Your contribution will directly fund wellness packets for clients in need, helping individuals access personalized health and fitness guidance.';
  
  return (
    <div className="min-h-screen">
      {/* Success Header */}
      <Section className="bg-gradient-to-br from-[#40E0D0] via-[#7FFFD4] to-[#9370DB] py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Thank You for Your Donation!
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Your generosity helps us make movement accessible to everyone
          </p>
        </div>
      </Section>

      {/* Donation Details */}
      <Section variant="light" className="py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Donation Receipt</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Receipt Number</span>
                <span className="font-mono font-bold text-gray-900">{donation.receiptNumber}</span>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(donation.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Donor</span>
                <span className="font-medium text-gray-900">{donation.donorName}</span>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-900">{donation.donorEmail}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-lg">Donation Amount</span>
                <span className="text-3xl font-bold text-[#40E0D0]">
                  ${donation.amount.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#40E0D0]/10 to-[#9370DB]/10 rounded-xl p-6">
              <div className="flex items-start">
                <div className="text-3xl mr-4">{allocationIcon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{allocationTitle}</h3>
                  <p className="text-gray-700 text-sm">{allocationDescription}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
              <span className="text-xl mr-2">📄</span>
              Tax Deduction Information
            </h3>
            <p className="text-gray-700 text-sm mb-3">
              AFYA is a registered 501(c)(3) nonprofit organization. Your donation may be tax-deductible to the extent allowed by law.
            </p>
            <p className="text-gray-700 text-sm mb-3">
              <strong>Tax ID (EIN):</strong> XX-XXXXXXX
            </p>
            <p className="text-gray-700 text-sm">
              A confirmation email with your receipt has been sent to <strong>{donation.donorEmail}</strong>. Please keep this for your tax records.
            </p>
          </div>

          {/* What's Next */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900">What Happens Next?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-[#40E0D0] mr-3 mt-1">✓</span>
                <span>You'll receive a confirmation email with your donation receipt</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#40E0D0] mr-3 mt-1">✓</span>
                <span>Your contribution will be put to work immediately supporting our programs</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#40E0D0] mr-3 mt-1">✓</span>
                <span>You'll receive updates on the impact your donation is making</span>
              </li>
              {donation.isRecurring && (
                <li className="flex items-start">
                  <span className="text-[#40E0D0] mr-3 mt-1">✓</span>
                  <span>Your monthly donation will be processed automatically on this date each month</span>
                </li>
              )}
            </ul>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Continue Supporting AFYA</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as="a" href="/shop" variant="primary">
                Shop & Give Back
              </Button>
              <Button as="a" href="/impact" variant="outline">
                See Our Impact
              </Button>
              <Button as="a" href="/" variant="outline">
                Return Home
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default async function DonationConfirmationPage({ searchParams }: DonationConfirmationProps) {
  const paymentIntentId = searchParams.payment_intent;
  
  if (!paymentIntentId) {
    return (
      <div className="min-h-screen">
        <Section className="py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Invalid Confirmation</h1>
            <p className="text-gray-700 mb-8">
              We couldn't find your donation details. If you just made a donation, please check your email for confirmation.
            </p>
            <Button as="a" href="/impact/donate" variant="primary">
              Make a Donation
            </Button>
          </div>
        </Section>
      </div>
    );
  }
  
  const donation = await getDonationDetails(paymentIntentId);
  
  if (!donation) {
    return (
      <div className="min-h-screen">
        <Section className="py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">⏳</div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Processing Your Donation</h1>
            <p className="text-gray-700 mb-8">
              Your donation is being processed. You'll receive a confirmation email shortly.
            </p>
            <Button as="a" href="/" variant="primary">
              Return Home
            </Button>
          </div>
        </Section>
      </div>
    );
  }
  
  // Send confirmation email (fire and forget)
  sendDonationConfirmationEmail(donation).catch(console.error);
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DonationConfirmationContent donation={donation} />
    </Suspense>
  );
}
