import { Metadata } from 'next';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Intake Analytics | Admin',
  description: 'View intake completion metrics and analytics'
};

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <AnalyticsDashboard />
    </div>
  );
}
