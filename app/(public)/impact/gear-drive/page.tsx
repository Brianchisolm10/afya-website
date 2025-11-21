import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import GearDriveForm from '@/components/impact/GearDriveForm';

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

export default async function GearDrivePage() {
  const stats = await getCommunityStats();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-[#40E0D0] via-[#7FFFD4] to-[#9370DB] py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-6">♻️</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Gear Drive
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Give your used workout clothing a second life
          </p>
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
            <span className="text-white font-semibold">✓ ACTIVE PROGRAM</span>
          </div>
        </div>
      </Section>

      {/* Impact Stats */}
      <Section variant="light" className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] to-[#9370DB]">
                {stats.totalGearDonated}
              </div>
              <div className="text-gray-600 mt-2">Items Collected</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] to-[#9370DB]">
                Coming Soon
              </div>
              <div className="text-gray-600 mt-2">Pounds Recycled</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Main Content */}
      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">About Our Gear Drive</h2>
            
            <p className="text-gray-700 mb-6">
              Don't let your gently used workout clothing go to waste. Our Gear Drive program accepts athletic wear and gives it new purpose through four sustainable pathways. Every item you donate helps reduce textile waste while supporting our community.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">Four Ways We Use Your Gear</h3>
            
            <div className="space-y-6 mb-8">
              <div className="bg-gradient-to-br from-[#40E0D0]/10 to-[#9370DB]/10 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">♻️</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Recycling</h4>
                    <p className="text-gray-700">Items that can't be worn again are sent to textile recycling facilities where they're broken down and transformed into new materials, keeping them out of landfills.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#40E0D0]/10 to-[#9370DB]/10 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">✨</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Upcycling</h4>
                    <p className="text-gray-700">Creative transformation of gear into new products like bags, accessories, or art pieces. We partner with local artists and makers to give items a completely new purpose.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#40E0D0]/10 to-[#9370DB]/10 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">👕</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Redistribution</h4>
                    <p className="text-gray-700">Quality items in good condition are cleaned and provided to clients in need, removing financial barriers to having proper workout attire.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#40E0D0]/10 to-[#9370DB]/10 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">🏃</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Community Events & Youth Sports</h4>
                    <p className="text-gray-700">Gear supports our community fitness events, youth sports programs, and group activities, ensuring everyone has what they need to participate.</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">What We Accept</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-green-500 mr-2">✓</span> We Accept
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Athletic shirts and tanks</li>
                  <li>• Workout pants and shorts</li>
                  <li>• Sports bras</li>
                  <li>• Athletic jackets and hoodies</li>
                  <li>• Compression wear</li>
                  <li>• Athletic socks (new/unused only)</li>
                  <li>• Gym bags</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-red-500 mr-2">✗</span> We Cannot Accept
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Items with holes or tears</li>
                  <li>• Heavily stained clothing</li>
                  <li>• Underwear (except new sports bras)</li>
                  <li>• Non-athletic clothing</li>
                  <li>• Shoes (see Equipment Donation)</li>
                  <li>• Workout equipment</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">Donation Guidelines</h3>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>• Items should be clean and gently used</li>
              <li>• Please wash items before donating</li>
              <li>• Check pockets and remove personal items</li>
              <li>• Items with minor wear are acceptable for recycling/upcycling</li>
              <li>• We accept all sizes and styles</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">Environmental Impact</h3>
            <p className="text-gray-700 mb-6">
              The fashion industry is one of the largest polluters globally, and athletic wear often contains synthetic materials that take hundreds of years to decompose. By donating your gear instead of throwing it away, you're helping reduce textile waste, conserve resources, and support a circular economy.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to Donate?</h3>
            <p className="text-gray-700 mb-6">
              Fill out the donation form below to get started. We'll provide details on drop-off locations or pickup options for larger donations. Every item makes a difference!
            </p>
          </div>

          {/* Donation Form */}
          <div className="mt-12" id="donate-form">
            <GearDriveForm />
          </div>

          <div className="flex justify-center mt-8">
            <Button as="a" href="/impact" variant="outline" size="lg">
              View All Impact Programs
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
