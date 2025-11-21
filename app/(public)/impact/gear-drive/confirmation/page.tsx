import { notFound } from 'next/navigation';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { prisma } from '@/lib/db';

interface PageProps {
  searchParams: { id?: string };
}

async function getSubmission(id: string) {
  try {
    const submission = await prisma.gearDriveSubmission.findUnique({
      where: { id },
    });
    return submission;
  } catch (error) {
    console.error('Error fetching submission:', error);
    return null;
  }
}

export default async function GearDriveConfirmationPage({ searchParams }: PageProps) {
  const submissionId = searchParams.id;

  if (!submissionId) {
    notFound();
  }

  const submission = await getSubmission(submissionId);

  if (!submission) {
    notFound();
  }

  // Parse JSON fields
  const itemTypes = JSON.parse(submission.itemTypes as string) as string[];
  const address = submission.address ? JSON.parse(submission.address as string) : null;

  // Generate confirmation number
  const confirmationNumber = `GD-${submission.createdAt.toISOString().split('T')[0].replace(/-/g, '')}-${submission.id.slice(-6).toUpperCase()}`;

  // Map item types to display labels
  const itemTypeLabels: Record<string, string> = {
    'shirts': 'Athletic Shirts & Tanks',
    'pants': 'Workout Pants & Leggings',
    'shorts': 'Athletic Shorts',
    'sports-bras': 'Sports Bras',
    'jackets': 'Athletic Jackets & Hoodies',
    'compression': 'Compression Wear',
    'socks': 'Athletic Socks',
    'bags': 'Gym Bags',
  };

  const displayItemTypes = itemTypes.map(type => itemTypeLabels[type] || type);

  // Map condition to display label
  const conditionLabels: Record<string, string> = {
    'EXCELLENT': 'Excellent',
    'GOOD': 'Good',
    'FAIR': 'Fair',
    'WORN': 'Worn',
  };

  // Map dropoff method to display label
  const methodLabels: Record<string, string> = {
    'DROPOFF': 'Drop-off',
    'PICKUP': 'Pickup',
    'SHIPPING': 'Shipping',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-[#40E0D0] via-[#7FFFD4] to-[#9370DB] py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Thank You for Your Donation!
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Your gear will help reduce waste and support our community
          </p>
        </div>
      </Section>

      {/* Confirmation Details */}
      <Section className="py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Confirmation Number */}
          <Card padding="lg" className="text-center">
            <p className="text-sm text-gray-600 mb-2">Confirmation Number</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] to-[#9370DB]">
              {confirmationNumber}
            </p>
            <p className="text-sm text-gray-600 mt-4">
              A confirmation email has been sent to <strong>{submission.donorEmail}</strong>
            </p>
          </Card>

          {/* Donation Details */}
          <Card padding="lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Donor Name:</span>
                <span className="text-gray-900">{submission.donorName}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="text-gray-900">{submission.donorEmail}</span>
              </div>

              {submission.donorPhone && (
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Phone:</span>
                  <span className="text-gray-900">{submission.donorPhone}</span>
                </div>
              )}

              <div className="py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-700 block mb-2">Items:</span>
                <ul className="list-disc list-inside text-gray-900 space-y-1">
                  {displayItemTypes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Quantity:</span>
                <span className="text-gray-900">{submission.estimatedQuantity} items</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Condition:</span>
                <span className="text-gray-900">{conditionLabels[submission.condition]}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Method:</span>
                <span className="text-gray-900">{methodLabels[submission.dropoffMethod]}</span>
              </div>

              {submission.preferredDate && (
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Preferred Date:</span>
                  <span className="text-gray-900">
                    {new Date(submission.preferredDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {address && (
                <div className="py-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-700 block mb-2">Pickup Address:</span>
                  <div className="text-gray-900">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                  </div>
                </div>
              )}

              {submission.notes && (
                <div className="py-3">
                  <span className="font-semibold text-gray-700 block mb-2">Notes:</span>
                  <p className="text-gray-900">{submission.notes}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Next Steps */}
          <Card padding="lg" className="bg-gradient-to-br from-[#40E0D0]/10 to-[#9370DB]/10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Happens Next?</h2>
            
            <div className="space-y-4">
              {submission.dropoffMethod === 'DROPOFF' && (
                <>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">📍</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Drop-off Location</h3>
                      <p className="text-gray-700">We will send you drop-off location details within 24-48 hours via email.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">📦</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Prepare Your Items</h3>
                      <p className="text-gray-700">Please ensure items are clean and bagged. Bring your confirmation number when dropping off.</p>
                    </div>
                  </div>
                </>
              )}

              {submission.dropoffMethod === 'PICKUP' && (
                <>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">📞</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Pickup Scheduling</h3>
                      <p className="text-gray-700">We will contact you within 24-48 hours to schedule a pickup time.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">📦</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Prepare Your Items</h3>
                      <p className="text-gray-700">Please have items bagged and ready at the specified address. Someone should be available during the pickup window.</p>
                    </div>
                  </div>
                </>
              )}

              {submission.dropoffMethod === 'SHIPPING' && (
                <>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">📧</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Shipping Instructions</h3>
                      <p className="text-gray-700">We will send you shipping instructions and address within 24-48 hours via email.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">📦</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Package Your Items</h3>
                      <p className="text-gray-700">Please ensure items are securely packaged. Include your confirmation number in the package.</p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-start">
                <div className="text-2xl mr-3">♻️</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Your Impact</h3>
                  <p className="text-gray-700">Your gear will be recycled, upcycled, redistributed to clients in need, or used for community events.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button as="a" href="/impact" variant="primary" size="lg">
              View All Impact Programs
            </Button>
            <Button as="a" href="/" variant="outline" size="lg">
              Return to Home
            </Button>
          </div>

          {/* Contact Info */}
          <Card padding="lg" className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions?</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions about your donation, please contact us.
            </p>
            <Button as="a" href="/contact" variant="outline">
              Contact Us
            </Button>
          </Card>
        </div>
      </Section>
    </div>
  );
}
