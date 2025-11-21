import { Suspense } from 'react';
import { ContentManagementPage } from '@/components/admin/ContentManagementPage';

export const metadata = {
  title: 'Content Management | AFYA Admin',
  description: 'Manage website content, programs, and impact sections'
};

export default function ContentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div>Loading content...</div>}>
          <ContentManagementPage />
        </Suspense>
      </div>
    </div>
  );
}
