import { Button } from "@/components/ui";

export default function ContactPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-afya-primary via-afya-secondary to-afya-secondary-light text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-white drop-shadow-md max-w-3xl mx-auto">
              Have questions? We're here to help you on your health and fitness journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-afya-primary rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                    <a 
                      href="mailto:afya@theafya.org" 
                      className="text-afya-primary hover:underline"
                    >
                      afya@theafya.org
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-afya-secondary rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">Maryland, United States</p>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-afya-primary rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Response Time</h3>
                    <p className="text-gray-600">We typically respond within 24-48 hours</p>
                  </div>
                </div>
              </div>

              {/* Social Links (Optional - can add later) */}
              <div className="mt-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {/* Add social media links here when available */}
                  <p className="text-gray-600 text-sm">Coming soon!</p>
                </div>
              </div>
            </div>

            {/* Contact Form / Quick Actions */}
            <div>
              <div className="bg-afya-light rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  How Can We Help?
                </h2>
                
                <div className="space-y-4">
                  {/* Quick Action Cards */}
                  <a
                    href="/get-started"
                    className="block p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-afya-primary transition-colors"
                  >
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-afya-primary mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Get Started with AFYA</h3>
                        <p className="text-sm text-gray-600">Fill out our intake form to receive your personalized fitness and nutrition plan.</p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="/services"
                    className="block p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-afya-primary transition-colors"
                  >
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-afya-primary mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Learn About Our Services</h3>
                        <p className="text-sm text-gray-600">Explore our personalized packets and see how we can help you achieve your goals.</p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="/about"
                    className="block p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-afya-primary transition-colors"
                  >
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-afya-primary mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">About AFYA</h3>
                        <p className="text-sm text-gray-600">Learn more about our mission and The Alliance for Fitness & Youth Advancement.</p>
                      </div>
                    </div>
                  </a>

                  {/* Direct Email CTA */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-afya-primary to-afya-secondary rounded-lg text-white">
                    <h3 className="font-semibold mb-2 text-white">Have a specific question?</h3>
                    <p className="text-sm text-white drop-shadow-md mb-4">
                      Send us an email and we'll get back to you as soon as possible.
                    </p>
                    <Button
                      as="a"
                      href="mailto:afya@theafya.org"
                      className="bg-white hover:bg-gray-50 font-semibold"
                      style={{ color: '#20B2AA' }}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email Us
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-afya-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does it take to receive my personalized packets?
              </h3>
              <p className="text-gray-600">
                After submitting your intake form, your packets are typically generated and ready within 3-5 business days. 
                You'll receive an email notification when they're available in your dashboard.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is AFYA really free?
              </h3>
              <p className="text-gray-600">
                Yes! The core AFYA experience—including your personalized Intro, Nutrition, and Workout packets—is completely free. 
                Our mission is to make world-class fitness and wellness guidance accessible to everyone.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if I need to update my information or goals?
              </h3>
              <p className="text-gray-600">
                You can reach out to us at afya@theafya.org to update your information. We can help adjust your plan 
                as your goals and circumstances change.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you work with schools or organizations?
              </h3>
              <p className="text-gray-600">
                Yes! We're expanding into schools, sports teams, community programs, and corporate wellness. 
                Contact us at afya@theafya.org to discuss partnership opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
