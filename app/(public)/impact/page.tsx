import { Suspense } from 'react';
import { CommunityCounter } from '@/components/community/CommunityCounter';
import { ImpactSectionCard } from '@/components/impact/ImpactSectionCard';
import Section from '@/components/ui/Section';
import Skeleton from '@/components/ui/Skeleton';
import { LazyLoadOnScroll } from '@/components/performance/LazyLoadOnScroll';
import PrefetchLinks from '@/components/home/PrefetchLinks';

// ISR: Revalidate every 10 minutes (600 seconds)
export const revalidate = 600;

async function getCommunityStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/community/stats`, {
      next: { 
        revalidate: 600, // Cache for 10 minutes
        tags: ['community-stats', 'impact-stats']
      },
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

function ImpactHero({ totalMinutesMoved }: { totalMinutesMoved: number }) {
  return (
    <Section className="bg-gradient-to-br from-[#40E0D0] via-[#7FFFD4] to-[#9370DB] section-spacing">
      <div className="max-w-4xl mx-auto text-center stack-lg">
        <h1 className="text-page-title text-white">
          Our Impact
        </h1>
        <p className="text-body-large text-white/90 content-readable mx-auto">
          Movement for Everyone, powered by community
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
          <CommunityCounter
            initialCount={totalMinutesMoved}
            animationDuration={2000}
          />
        </div>
      </div>
    </Section>
  );
}

function ImpactSections({ stats }: { stats: any }) {
  return (
    <Section className="section-spacing">
      <div className="max-w-6xl mx-auto">
        <div className="text-center stack-md" style={{ marginBottom: 'var(--space-12)' }}>
          <h2 className="text-section-title text-gray-900">
            Our Impact Programs
          </h2>
          <p className="text-body-large text-gray-600 content-wide mx-auto">
            Explore the ways we're making movement accessible to everyone and
            supporting health and wellness in our community
          </p>
        </div>

        {/* Lazy load impact cards on scroll */}
        <LazyLoadOnScroll 
          threshold={0.1} 
          rootMargin="100px"
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-96 w-full rounded-lg" />
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Donations Section */}
            <ImpactSectionCard
              title="Donations"
              description="Support AFYA's mission through direct contributions. Your donations fund personalized wellness programs and help us reach more people."
              icon="❤️"
              stats={[
                {
                  label: 'Total Raised',
                  value: `${stats.totalDonationsRaised.toLocaleString()}`,
                },
                { label: 'Clients Helped', value: stats.totalClientsServed },
              ]}
              ctaLabel="Learn More"
              ctaHref="/impact/donate"
            />

            {/* Sponsor-A-Client Section */}
            <ImpactSectionCard
              title="Sponsor-A-Client"
              description="Fund personalized wellness packets for clients facing financial barriers. Your sponsorship covers their complete program and ongoing support."
              icon="🤝"
              stats={[
                { label: 'Clients Sponsored', value: '0' },
                { label: 'Active Sponsors', value: '0' },
              ]}
              ctaLabel="Learn More"
              ctaHref="/impact/sponsor"
            />

            {/* Gear Drive Section (ACTIVE) */}
            <ImpactSectionCard
              title="Gear Drive"
              description="Give your used workout clothing a second life through recycling, upcycling, redistribution, and community programs."
              icon="♻️"
              stats={[
                { label: 'Items Collected', value: stats.totalGearDonated },
                { label: 'Pounds Recycled', value: '0' },
              ]}
              ctaLabel="Learn More"
              ctaHref="/impact/gear-drive"
            />

            {/* Equipment Donation Section (COMING SOON) */}
            <ImpactSectionCard
              title="Equipment Donation"
              description="Soon you'll be able to donate workout equipment to support our community programs. We're building the infrastructure to make this happen safely."
              icon="🏋️"
              ctaLabel="Learn More"
              ctaHref="/impact/equipment"
              comingSoon
            />

            {/* Foundations Section */}
            <div className="md:col-span-2">
              <ImpactSectionCard
                title="Foundations We Endorse"
                description="Discover the exceptional health and wellness organizations we support. Learn about their missions and how you can help make a difference."
                icon="🏥"
                ctaLabel="View Foundations"
                ctaHref="/impact/foundations"
              />
            </div>
          </div>
        </LazyLoadOnScroll>

        {/* Prefetch donation and gear drive forms */}
        <PrefetchLinks 
          routes={['/impact/donate', '/impact/gear-drive', '/impact/sponsor']} 
          priority="low"
          delay={2000}
        />
      </div>
    </Section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-[#40E0D0] via-[#7FFFD4] to-[#9370DB] py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton className="h-12 w-64 mx-auto mb-6" />
          <Skeleton className="h-6 w-96 mx-auto mb-12" />
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
            <Skeleton className="h-24 w-48 mx-auto" />
          </div>
        </div>
      </div>
      <Section className="py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

export default async function ImpactPage() {
  const stats = await getCommunityStats();

  return (
    <div className="min-h-screen">
      <Suspense fallback={<LoadingSkeleton />}>
        <ImpactHero totalMinutesMoved={stats.totalMinutesMoved} />
        <ImpactSections stats={stats} />
      </Suspense>
    </div>
  );
}
