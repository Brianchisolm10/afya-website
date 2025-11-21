import { Suspense } from 'react';
import Section from '@/components/ui/Section';
import Skeleton from '@/components/ui/Skeleton';

// NOTE: Shop functionality requires Product model in Prisma schema
// The Product model and ProductCategory enum need to be added to prisma/schema.prisma
// See prisma/seed-products.ts for the expected schema structure

// Enable ISR with 5-minute revalidation (Requirement 4.5, 12.3)
export const revalidate = 300;

interface PageProps {
  searchParams: {
    category?: string;
  };
}

export default async function ShopPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <Section variant="gradient" spacing="lg">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop AFYA
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Support the movement. 25% of every purchase is put back into the community.
          </p>
        </div>
      </Section>

      {/* Temporary message until Product model is added */}
      <Section variant="default" spacing="lg">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Shop Coming Soon
            </h2>
            <p className="text-gray-600 mb-4">
              The shop is currently being set up. The Product model needs to be added to the database schema.
            </p>
            <p className="text-sm text-gray-500">
              To enable the shop, add the Product model and ProductCategory enum to prisma/schema.prisma,
              then run migrations and seed the database with products.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

// Loading skeleton for shop page
function ShopPageSkeleton() {
  return (
    <>
      <Section variant="default" spacing="md">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-24 rounded-lg" />
          ))}
        </div>
      </Section>
      
      <Section variant="default" spacing="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-[1rem] overflow-hidden">
              <Skeleton className="aspect-square" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
