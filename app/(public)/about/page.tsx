import { Button } from "@/components/ui";

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-afya-primary via-afya-secondary to-afya-secondary-light text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About AFYA
            </h1>
            <p className="text-2xl text-white drop-shadow-md font-semibold mb-6">
              A Happier, Healthier You. Your Way.
            </p>
            <p className="text-lg text-white drop-shadow-md max-w-3xl mx-auto">
              Fitness, nutrition, and wellness guidance for everyone—no matter your age, background, or experience level.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              Our Mission
            </h2>
            <div className="text-lg text-gray-600 leading-relaxed space-y-4">
              <p className="text-center text-xl font-semibold text-afya-primary mb-6">
                Fitness and wellness for everyone
              </p>
              <p>
                AFYA helps you build a healthier, more confident life. We create personalized programs through a smart system that gives you exactly what you need, instantly.
              </p>
              <p>
                No guesswork. No confusion. Just clear guidance and support for your journey.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-afya-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Rooted in community, we bring together science, technology, and human connection.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-afya-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Equity</h3>
              <p className="text-gray-600">
                Making high-quality fitness and wellness guidance available to everyone.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-afya-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Empowerment</h3>
              <p className="text-gray-600">
                Supporting you with empathy and education so you feel capable and confident.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why AFYA Section */}
      <section className="py-16 md:py-24 bg-afya-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Why AFYA Exists
            </h2>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                With so much confusing health advice online, AFYA provides a trusted, accessible solution. We make high-quality fitness and wellness guidance available to everyone.
              </p>
              
              <p>
                The core experience is free. We're expanding into schools, sports teams, community programs, and workplaces.
              </p>
              
              <p>
                We meet you where you are—whether you're a busy parent, student-athlete, beginner, experienced athlete, or restarting your health journey. We're here to support and empower you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart System</h3>
              <p className="text-gray-600 mb-6">
                We collect your information and create personalized resources instantly. No guesswork or confusing advice.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personalized Programs</h3>
              <p className="text-gray-600 mb-6">
                Programs that fit your goals, lifestyle, and experience level. For youth athletes, busy parents, beginners, and experienced athletes.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Clear Support</h3>
              <p className="text-gray-600">
                Simple structure and ongoing support throughout your journey. You'll feel understood and confident every step of the way.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-afya-primary to-afya-secondary rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">What We Stand For</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Health for All Ages</strong> — Building healthier futures for everyone</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Equity</strong> — Access to world-class guidance for everyone</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Better Tools</strong> — Technology that helps people, not just profits</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Better Guidance</strong> — Science-backed, personalized, and clear</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Better Outcomes</strong> — Real results that last</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white border-t-2 border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Join AFYA and start building a healthier, more confident life today.
          </p>
          <Button
            as="a"
            href="/get-started"
            variant="primary"
            size="lg"
            className="shadow-lg"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}
