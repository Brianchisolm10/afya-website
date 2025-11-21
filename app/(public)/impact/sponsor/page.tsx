import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';

export default function SponsorPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-[#40E0D0] via-[#7FFFD4] to-[#9370DB] py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-6">🤝</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sponsor-A-Client
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Make movement accessible to those who need it most
          </p>
        </div>
      </Section>

      {/* Main Content */}
      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">What is Sponsor-A-Client?</h2>
            
            <p className="text-gray-700 mb-6">
              Our Sponsor-A-Client program connects generous supporters with individuals facing financial barriers to wellness services. When you sponsor a client, you're funding their complete personalized wellness journey—from initial assessment through ongoing support.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">What Your Sponsorship Includes</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="text-2xl mr-4">📊</div>
                <div>
                  <h4 className="font-bold text-gray-900">Comprehensive Assessment</h4>
                  <p className="text-gray-700">Complete intake evaluation to understand the client's needs, goals, and current fitness level.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">🍎</div>
                <div>
                  <h4 className="font-bold text-gray-900">Personalized Nutrition Plan</h4>
                  <p className="text-gray-700">Custom meal plans and nutrition guidance tailored to their lifestyle, preferences, and goals.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">💪</div>
                <div>
                  <h4 className="font-bold text-gray-900">Training Program</h4>
                  <p className="text-gray-700">Structured workout plans designed for their fitness level and available resources.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">🧘</div>
                <div>
                  <h4 className="font-bold text-gray-900">Recovery & Wellness</h4>
                  <p className="text-gray-700">Recovery strategies, mobility work, and wellness practices to support long-term health.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-4">📞</div>
                <div>
                  <h4 className="font-bold text-gray-900">Ongoing Support</h4>
                  <p className="text-gray-700">Regular check-ins, program adjustments, and continued guidance throughout their journey.</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">How It Works</h3>
            
            <div className="bg-gradient-to-br from-[#40E0D0]/10 to-[#9370DB]/10 rounded-2xl p-8 mb-8">
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="font-bold text-[#40E0D0] mr-3">1.</span>
                  <div>
                    <strong>Express Interest:</strong> Contact us to learn more about becoming a sponsor and the current clients in need.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-[#40E0D0] mr-3">2.</span>
                  <div>
                    <strong>Client Matching:</strong> We match you with a client based on need, program fit, and your sponsorship preferences.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-[#40E0D0] mr-3">3.</span>
                  <div>
                    <strong>Program Launch:</strong> Your sponsored client begins their personalized wellness journey with full AFYA support.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-[#40E0D0] mr-3">4.</span>
                  <div>
                    <strong>Impact Updates:</strong> Receive periodic updates on your client's progress (privacy-protected and anonymous).
                  </div>
                </li>
              </ol>
            </div>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">Who Benefits?</h3>
            <p className="text-gray-700 mb-6">
              Our sponsored clients include individuals facing financial hardship, those recovering from health challenges, youth from underserved communities, and anyone for whom cost is a barrier to accessing quality wellness services. Every person deserves the opportunity to improve their health and well-being.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">Privacy & Respect</h3>
            <p className="text-gray-700 mb-6">
              We maintain strict privacy standards. Sponsored clients are never identified by name, and all progress updates are anonymized. Our goal is to provide dignified support that empowers individuals without compromising their privacy.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to Sponsor?</h3>
            <p className="text-gray-700 mb-6">
              Join us in making movement accessible to everyone. Your sponsorship can change someone's life by giving them the tools, knowledge, and support they need to build a healthier future.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button as="a" href="/contact" variant="primary" size="lg">
              Become a Sponsor
            </Button>
            <Button as="a" href="/impact" variant="outline" size="lg">
              View All Impact Programs
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
