import { Metadata } from 'next';
import ProgramCard from '@/components/programs/ProgramCard';
import ProgramsPageClient from '@/components/programs/ProgramsPageClient';
import { getCachedPrograms, getCachedComingSoonPrograms } from '@/lib/programs/cache';

export const metadata: Metadata = {
  title: 'Our Programs | AFYA - Movement for Everyone',
  description: 'Choose the path that fits your goals. Explore our personalized wellness programs designed for everyone.',
};

// ISR: Revalidate every 10 minutes (600 seconds)
export const revalidate = 600;

// Cache headers for stale-while-revalidate
export const dynamic = 'force-static';

export default async function ProgramsPage() {
  // Fetch programs with server-side caching
  const programs = await getCachedPrograms();
  const comingSoonPrograms = await getCachedComingSoonPrograms();

  // Icon mapping for programs
  const programIcons: Record<string, React.ReactNode> = {
    intro: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    nutrition: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    training: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    athlete: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    youth: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    recovery: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'movement-needs': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    'corporate-wellness': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    'prenatal-postnatal': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'senior-fitness': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  };

  return (
    <ProgramsPageClient>
      <div className="min-h-screen bg-gradient-to-br from-afya-light to-white">
        {/* Page Header */}
        <section className="section-spacing-sm px-4" style={{ paddingTop: 'var(--space-24)' }}>
          <div className="max-w-7xl mx-auto text-center stack-md">
            <h1 className="text-page-title text-gray-900">
              Our Programs
            </h1>
            <p className="text-body-large text-gray-600 content-readable mx-auto">
              Explore our personalized wellness programs. Book a call to get started with your customized packet.
            </p>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <ProgramCard 
                  key={program.id} 
                  {...program} 
                  icon={programIcons[program.id]}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Future Programs Section */}
        <section className="px-4" style={{ paddingBottom: 'var(--space-24)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center stack-md" style={{ marginBottom: 'var(--space-8)' }}>
              <h2 className="text-section-title text-gray-900">
                More Coming Soon
              </h2>
              <p className="text-body text-gray-600 content-readable mx-auto">
                We're constantly expanding our programs to serve more communities and needs. Stay tuned for new offerings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonPrograms.map((program) => (
                <ProgramCard 
                  key={program.id} 
                  {...program} 
                  icon={programIcons[program.id]}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </ProgramsPageClient>
  );
}
