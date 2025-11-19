import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-afya-primary via-afya-secondary to-afya-secondary-light text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Movement for Everyone
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-md max-w-3xl mx-auto">
              AFYA provides personalized health and fitness guidance tailored to
              your unique goals. Start your journey to a healthier, stronger you.
            </p>
            <Link href="/get-started" passHref legacyBehavior>
              <Button
                as="a"
                size="lg"
                className="bg-white hover:bg-gray-50 focus:ring-white shadow-lg font-semibold"
                style={{ color: '#20B2AA' }}
              >
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-2xl md:text-3xl font-semibold text-gray-900 leading-relaxed">
              A Happier, Healthier You. Your Way.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-afya-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose AFYA?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card variant="elevated" hoverable className="animate-slideUp">
              <div className="w-12 h-12 bg-afya-primary rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Personalized Plans
              </h3>
              <p className="text-gray-700">
                Receive customized nutrition and workout plans designed
                specifically for your goals and lifestyle.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card variant="elevated" hoverable className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-afya-secondary rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Expert Guidance
              </h3>
              <p className="text-gray-700">
                Get professional advice and support from experienced health and
                fitness coaches.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card variant="elevated" hoverable className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-afya-primary rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Track Progress
              </h3>
              <p className="text-gray-700">
                Monitor your journey with regular check-ins and adjust your plan
                as you progress toward your goals.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Dual CTA Section - Immersive */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-afya-light relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-afya-primary/5 rounded-full -ml-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-afya-secondary/5 rounded-full -mr-48 -mb-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Your Journey Starts Here
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're new to AFYA or returning to continue your progress, we're here to support you every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* New Users Card */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-afya-primary">
              <div className="absolute inset-0 bg-gradient-to-br from-afya-primary/5 to-afya-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-8 md:p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-afya-primary to-afya-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  New to AFYA?
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Take our quick assessment and receive your personalized health and fitness program in minutes.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free personalized assessment</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Custom nutrition & workout plans</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Instant access to your dashboard</span>
                  </li>
                </ul>
                
                <Link href="/get-started">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Start Free Assessment
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Takes 8-15 minutes • No credit card required
                </p>
              </div>
            </div>

            {/* Returning Users Card */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-afya-secondary">
              <div className="absolute inset-0 bg-gradient-to-br from-afya-secondary/5 to-afya-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-8 md:p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-afya-secondary to-afya-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Welcome Back!
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Continue your journey and access your personalized programs, track progress, and stay on course.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-afya-secondary mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Access your custom packets</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-afya-secondary mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>View your progress tracking</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-afya-secondary mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Update your preferences</span>
                  </li>
                </ul>
                
                <Link href="/login">
                  <Button
                    variant="secondary"
                    size="lg"
                    fullWidth
                    className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Sign In to Dashboard
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </Button>
                </Link>
                
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Secure login • Your data is protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
