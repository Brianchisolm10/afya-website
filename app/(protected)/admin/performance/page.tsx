import { Suspense } from 'react';
import PerformanceDashboard from '@/components/admin/PerformanceDashboard';

export const metadata = {
  title: 'Performance Monitoring | AFYA Admin',
  description: 'Monitor website performance metrics and Core Web Vitals',
};

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Performance Monitoring</h1>
        <p className="mt-2 text-gray-600">
          Track Core Web Vitals and performance metrics across all pages
        </p>
      </div>

      <Suspense fallback={<PerformanceDashboardSkeleton />}>
        <PerformanceDashboard />
      </Suspense>
    </div>
  );
}

function PerformanceDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
