import { Button, Card } from "@/components/ui";
import { DynamicTestimonialCarousel, DynamicImpactStatsSection } from "@/lib/dynamic-imports";
import { prisma } from "@/lib/db";
import { 
  CelebrationIllustration, 
  HydrationIllustration, 
  WeightLiftingIllustration,
} from "@/components/illustrations/FitnessIllustrations";
import { HeroSection } from "@/components/home/HeroSection";
import { PrefetchLinks } from "@/components/home/PrefetchLinks";
import { PrefetchLink } from "@/components/performance/PrefetchLink";

// Enable ISR with 5-minute revalidation
export const revalidate = 300; // 5 minutes

// Configure cache headers for stale-while-revalidate
export const dynamic = 'force-static';

async function getCommunityStats() {
  try {
    let stats = await prisma.communityStats.findFirst();
    
    if (!stats) {
      stats = await prisma.communityStats.create({
        data: {
          totalMinutesMoved: 0,
          totalClientsServed: 0,
          totalDonationsRaised: 0,
          totalGearDonated: 0,
        },
      });
    }
    
    return stats;
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

export default async function HomePage() {
  const stats = await getCommunityStats();

  return (
    <div>
      {/* Optimized Hero Section with priority loading */}
      <HeroSection totalMinutesMoved={stats.totalMinutesMoved} />
      
      {/* Prefetch likely next pages */}
      <PrefetchLinks routes={['/programs', '/tools', '/shop']} prefetchOn="scroll" scrollThreshold={0.3} />

      {/* Programs Preview Section */}
      <section className="section-spacing bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center stack-lg" style={{ marginBottom: 'var(--space-12)' }}>
            <h2 className="text-section-title text-gray-900">
              Find Your Program
            </h2>
            <p className="text-body-large text-gray-600 content-readable mx-auto">
              Personalized wellness programs designed for your unique goals and lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Intro Program */}
            <Card className="h-full">
              <div className="w-16 h-16 mb-4">
                <CelebrationIllustration className="w-16 h-16" />
              </div>
              <h3 className="text-card-title text-gray-900" style={{ marginBottom: 'var(--space-3)' }}>
                Intro Program
              </h3>
              <p className="text-body text-gray-700">
                Get started with personalized wellness guidance. Perfect for beginners exploring health and fitness. Quick assessment, clear next steps.
              </p>
            </Card>

            {/* Nutrition Program */}
            <Card className="h-full">
              <div className="w-16 h-16 mb-4">
                <HydrationIllustration className="w-16 h-16" />
              </div>
              <h3 className="text-card-title text-gray-900" style={{ marginBottom: 'var(--space-3)' }}>
                Nutrition Program
              </h3>
              <p className="text-body text-gray-700">
                Custom meal plans tailored to your goals and preferences. Learn sustainable eating habits. Achieve your nutrition targets.
              </p>
            </Card>

            {/* Training Program */}
            <Card className="h-full">
              <div className="w-16 h-16 mb-4">
                <WeightLiftingIllustration className="w-16 h-16" />
              </div>
              <h3 className="text-card-title text-gray-900" style={{ marginBottom: 'var(--space-3)' }}>
                Training Program
              </h3>
              <p className="text-body text-gray-700">
                Structured workout programs designed for your fitness level. Build strength, endurance, and confidence. Train smarter, not harder.
              </p>
            </Card>
          </div>

          <div className="text-center">
            <PrefetchLink href="/programs" prefetchOn="hover" priority="high">
              <Button variant="outline" size="lg">
                View All Programs
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </PrefetchLink>
          </div>
        </div>
      </section>

      {/* Shop Preview Section */}
      <section className="section-spacing bg-gradient-to-b from-afya-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center stack-lg" style={{ marginBottom: 'var(--space-12)' }}>
            <h2 className="text-section-title text-gray-900">
              Shop AFYA
            </h2>
            <p className="text-body-large text-gray-600 content-readable mx-auto">
              Support the movement. 25% of every purchase funds community programs.
            </p>
          </div>

          {/* Placeholder for featured products carousel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Placeholder Product 1 */}
            <Card variant="hover" className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-afya-primary/20 to-afya-secondary/20 flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-afya-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                AFYA Apparel
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Premium athletic wear for your movement journey
              </p>
              <p className="text-afya-primary font-bold">Coming Soon</p>
            </Card>

            {/* Placeholder Product 2 */}
            <Card variant="hover" className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-afya-secondary/20 to-afya-primary/20 flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-afya-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Accessories
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Essential gear to support your wellness goals
              </p>
              <p className="text-afya-secondary font-bold">Coming Soon</p>
            </Card>

            {/* Placeholder Product 3 */}
            <Card variant="hover" className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-purple-400/20 to-pink-400/20 flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Limited Drops
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Exclusive releases supporting special initiatives
              </p>
              <p className="text-purple-500 font-bold">Coming Soon</p>
            </Card>
          </div>

          <div className="text-center">
            <PrefetchLink href="/shop" prefetchOn="hover" priority="high">
              <Button size="lg">
                Shop Now
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </PrefetchLink>
          </div>
        </div>
      </section>

      {/* Impact Highlight Section - Lazy Loaded */}
      <DynamicImpactStatsSection 
        totalClientsServed={stats.totalClientsServed}
        totalDonationsRaised={stats.totalDonationsRaised}
        totalGearDonated={stats.totalGearDonated}
      />

      {/* Testimonial Section */}
      <section className="section-spacing bg-gradient-to-b from-afya-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center stack-lg" style={{ marginBottom: 'var(--space-12)' }}>
            <h2 className="text-section-title text-gray-900">
              Success Stories
            </h2>
            <p className="text-body-large text-gray-600 content-readable mx-auto">
              Real results from real people in our community.
            </p>
          </div>

          <DynamicTestimonialCarousel />
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
                  Schedule a free consultation call to discuss your goals and get started with your personalized wellness journey.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free consultation call</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Personalized program recommendations</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Account setup & dashboard access</span>
                  </li>
                </ul>
                
                <PrefetchLink href="/book-call" prefetchOn="hover" priority="high">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Book Your Free Call
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </Button>
                </PrefetchLink>
                
                <p className="mt-4 text-sm text-gray-500 text-center">
                  30-minute call • No commitment required
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
                
                <PrefetchLink href="/login" prefetchOn="hover" priority="high">
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
                </PrefetchLink>
                
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Secure login • Your data is protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donate Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-afya-primary via-afya-secondary to-afya-secondary-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Support Our Mission
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Your donation helps us provide personalized wellness programs to those who need them most. Together, we can make movement accessible for everyone.
          </p>
          <PrefetchLink href="/donate" prefetchOn="hover" priority="high">
            <Button
              size="lg"
              className="bg-white hover:bg-gray-50 text-afya-primary font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Donate Now
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Button>
          </PrefetchLink>
        </div>
      </section>
    </div>
  );
}
