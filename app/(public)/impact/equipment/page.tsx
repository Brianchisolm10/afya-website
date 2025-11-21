import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';

export default function EquipmentPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-[#40E0D0] via-[#7FFFD4] to-[#9370DB] py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-6">🏋️</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Equipment Donation
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Help us build a community equipment library
          </p>
          <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-6 py-2">
            <span className="text-white font-semibold">COMING SOON</span>
          </div>
        </div>
      </Section>

      {/* Main Content */}
      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">What We're Building</h2>
            
            <p className="text-gray-700 mb-6">
              We're developing a comprehensive equipment donation program that will accept workout equipment like dumbbells, resistance bands, yoga mats, kettlebells, and more. This program will help us build a community equipment library and support clients who lack access to fitness tools.
            </p>

            <div className="bg-gradient-to-br from-[#40E0D0]/10 to-[#9370DB]/10 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Why We're Taking Our Time</h3>
              <p className="text-gray-700 mb-4">
                Unlike clothing, workout equipment requires special considerations:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Safety Inspections:</strong> Equipment must be thoroughly checked for safety and functionality</li>
                <li>• <strong>Sanitization:</strong> Proper cleaning and sanitization protocols need to be established</li>
                <li>• <strong>Storage:</strong> We need adequate space to store equipment safely</li>
                <li>• <strong>Distribution:</strong> Systems for lending or distributing equipment to clients</li>
                <li>• <strong>Liability:</strong> Insurance and legal considerations for equipment lending</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">What We'll Accept (When Launched)</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-3">Strength Equipment</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Dumbbells</li>
                  <li>• Kettlebells</li>
                  <li>• Resistance bands</li>
                  <li>• Weight plates</li>
                  <li>• Barbells</li>
                </ul>
              </div>
              
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-3">Cardio & Accessories</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Yoga mats</li>
                  <li>• Foam rollers</li>
                  <li>• Jump ropes</li>
                  <li>• Exercise balls</li>
                  <li>• Yoga blocks & straps</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Vision</h3>
            <p className="text-gray-700 mb-6">
              Once launched, this program will create a community equipment library where clients can borrow items they need for their wellness journey. This removes the financial barrier of purchasing equipment and allows people to try different tools before investing in their own.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">Partnership Opportunities</h3>
            <p className="text-gray-700 mb-6">
              We're actively seeking partnerships with:
            </p>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>• Fitness equipment manufacturers for bulk donations</li>
              <li>• Gyms closing or upgrading equipment</li>
              <li>• Storage facility partners</li>
              <li>• Sanitization and safety inspection services</li>
              <li>• Insurance providers familiar with equipment lending programs</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">Stay Updated</h3>
            <p className="text-gray-700 mb-6">
              We're working hard to launch this program safely and effectively. If you're interested in donating equipment or partnering with us, please reach out. We'll keep you informed as we make progress toward launch.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
              <p className="text-gray-800">
                <strong>Have equipment to donate now?</strong> Contact us anyway! We may be able to connect you with other organizations currently accepting equipment donations, or we can add you to our waitlist for when we launch.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button as="a" href="/contact" variant="primary" size="lg">
              Express Interest
            </Button>
            <Button as="a" href="/impact" variant="outline" size="lg">
              View Active Programs
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
