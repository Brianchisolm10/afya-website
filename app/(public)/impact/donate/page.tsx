import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { CommunityCounter } from '@/components/community/CommunityCounter';
import DonationForm from '@/components/impact/DonationForm';

async function getCommunityStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/community/stats`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch community stats');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching community stats:', error);
    return {
      totalMinutesMoved: 0,
      totalClientsServed: 0,
      totalDonationsRaised: 0,
      totalGearDonated: 0,
    };
  }
}

export default async function DonatePage() {
  const stats = await getCommunityStats();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-[#40E0D0] via-[#7FFFD4] to-[#9370DB] py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-6">❤️</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Support Our Mission
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Your contributions power AFYA's mission to make movement accessible to everyone
          </p>
        </div>
      </Section>

      {/* Impact Stats */}
      <Section variant="light" className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] to-[#9370DB]">
                ${stats.totalDonationsRaised.toLocaleString()}
              </div>
              <div className="text-gray-600 mt-2">Total Raised</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] to-[#9370DB]">
                {stats.totalClientsServed}
              </div>
              <div className="text-gray-600 mt-2">Clients Helped</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Main Content */}
      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Why Your Donation Matters</h2>
            
            <p className="text-gray-700 mb-6">
              Every dollar you contribute helps us break down barriers to movement and wellness. Your donations directly fund personalized wellness programs, support community initiatives, and help us reach more people who need access to quality fitness and nutrition guidance.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">How We Use Your Donations</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="text-2xl mr-4">📋</div>
                <div>
                  <h4 className="font-bold text-gray-900">Personalized Wellness Packets</h4>
                  <p className="text-gray-700">Custom nutrition plans, workout programs, and recovery strategies tailored to each client's needs and goals.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">👥</div>
                <div>
                  <h4 className="font-bold text-gray-900">Community Programs</h4>
                  <p className="text-gray-700">Group fitness events, wellness workshops, and community building activities that bring people together through movement.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">🎓</div>
                <div>
                  <h4 className="font-bold text-gray-900">Education & Resources</h4>
                  <p className="text-gray-700">Development of educational materials, training resources, and tools that empower people to take control of their health.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">🤝</div>
                <div>
                  <h4 className="font-bold text-gray-900">Subsidized Services</h4>
                  <p className="text-gray-700">Reduced-cost or free services for clients facing financial barriers, ensuring movement is accessible to all.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#40E0D0]/10 to-[#9370DB]/10 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Shop & Give Back</h3>
              <p className="text-gray-700 mb-4">
                Did you know? <strong>25% of all shop purchases</strong> automatically contribute to our community fund. Every time you shop with AFYA, you're supporting our mission to make movement accessible to everyone.
              </p>
              <Button as="a" href="/shop" variant="outline">
                Visit Our Shop
              </Button>
            </div>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to Make an Impact?</h3>
            <p className="text-gray-700 mb-6">
              Your generosity helps us continue our mission of making movement accessible to everyone, regardless of their circumstances. Together, we can build a healthier, more active community.
            </p>
          </div>

        </div>
      </Section>

      {/* Donation Form */}
      <Section variant="light" className="py-16">
        <DonationForm />
      </Section>
    </div>
  );
}
