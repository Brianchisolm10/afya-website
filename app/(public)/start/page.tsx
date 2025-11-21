import { Metadata } from 'next';
import DiscoveryForm from '@/components/discovery/DiscoveryForm';

export const metadata: Metadata = {
  title: 'Start Your Journey | AFYA',
  description: 'Take the first step toward your wellness goals with AFYA. Share a bit about yourself and schedule a discovery call with our team.',
};

export default function StartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-afya-light to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Start Your Journey
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            We're excited to learn about you! Share a bit about your goals, and we'll schedule a time to chat about how AFYA can support your wellness journey.
          </p>
        </div>

        {/* Form */}
        <DiscoveryForm />

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            🔒 Your information is secure and will never be shared
          </p>
          <p className="text-sm text-gray-500">
            ⏱️ Takes less than 2 minutes • 📞 No pressure, just conversation
          </p>
        </div>
      </div>
    </div>
  );
}
