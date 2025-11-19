import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-afya-light to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-afya-secondary via-afya-primary to-afya-secondary-light text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
            Support AFYA's Mission
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-md">
            Help us make movement accessible to everyone in our community
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Impact Statement */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Your Impact
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Every donation helps us provide personalized health and fitness guidance
              to individuals who might not otherwise have access to these resources.
              Together, we're building a healthier, more active community.
            </p>
          </div>

          {/* Donation Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card variant="elevated" hoverable className="text-center">
              <div className="w-16 h-16 bg-afya-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💪</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">$25</h3>
              <p className="text-gray-700 mb-4">Supporter</p>
              <p className="text-sm text-gray-600">
                Provides one client with a personalized nutrition guide
              </p>
            </Card>

            <Card variant="elevated" hoverable className="text-center border-2 border-afya-secondary">
              <div className="absolute top-0 right-0 bg-afya-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <div className="w-16 h-16 bg-afya-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">$50</h3>
              <p className="text-gray-700 mb-4">Champion</p>
              <p className="text-sm text-gray-600">
                Funds a complete wellness packet for one client
              </p>
            </Card>

            <Card variant="elevated" hoverable className="text-center">
              <div className="w-16 h-16 bg-afya-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">$100+</h3>
              <p className="text-gray-700 mb-4">Leader</p>
              <p className="text-sm text-gray-600">
                Sponsors multiple clients and helps expand our programs
              </p>
            </Card>
          </div>

          {/* Donation Form Placeholder */}
          <Card variant="elevated" className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Make Your Donation
            </h3>
            
            <div className="bg-gradient-to-br from-afya-primary/10 to-afya-secondary/10 rounded-lg p-8 text-center">
              <p className="text-lg text-gray-700 mb-6">
                We're currently setting up our secure donation platform.
              </p>
              <p className="text-gray-600 mb-6">
                In the meantime, you can support AFYA by contacting us directly:
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:afya@theafya.org?subject=Donation Inquiry"
                  className="block text-afya-primary hover:text-afya-primary-dark font-semibold text-lg"
                >
                  📧 afya@theafya.org
                </a>
                <p className="text-sm text-gray-500">
                  We'll get back to you within 24 hours with donation options
                </p>
              </div>
            </div>

            {/* Alternative: Uncomment when payment processor is ready */}
            {/* 
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Amount
                </label>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <button type="button" className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-afya-primary transition-colors">
                    $25
                  </button>
                  <button type="button" className="px-4 py-2 border-2 border-afya-primary bg-afya-primary/10 rounded-lg">
                    $50
                  </button>
                  <button type="button" className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-afya-primary transition-colors">
                    $100
                  </button>
                  <button type="button" className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-afya-primary transition-colors">
                    Other
                  </button>
                </div>
                <input
                  type="number"
                  placeholder="Custom amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afya-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Frequency
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="px-4 py-2 border-2 border-afya-primary bg-afya-primary/10 rounded-lg">
                    One-Time
                  </button>
                  <button type="button" className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-afya-primary transition-colors">
                    Monthly
                  </button>
                </div>
              </div>

              <Button variant="primary" size="lg" className="w-full">
                Continue to Payment
              </Button>
            </form>
            */}
          </Card>

          {/* Other Ways to Help */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Other Ways to Support
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-afya-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📢</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Spread the Word</h4>
                <p className="text-sm text-gray-600">
                  Share AFYA with friends and family who could benefit from our services
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-afya-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🤝</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Volunteer</h4>
                <p className="text-sm text-gray-600">
                  Join our team and help us reach more people in the community
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-afya-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🏢</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Corporate Partnership</h4>
                <p className="text-sm text-gray-600">
                  Partner with us to bring wellness programs to your organization
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-lg text-gray-700 mb-6">
              Have questions about donating or want to learn more?
            </p>
            <Link href="/contact" passHref legacyBehavior>
              <Button as="a" variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
