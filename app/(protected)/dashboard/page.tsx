'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PacketList from '@/components/dashboard/PacketList';
import PacketViewer from '@/components/dashboard/PacketViewer';
import { ErrorDisplay } from '@/components/ErrorBoundary';
import { useToast } from '@/components/Toast';
import { retryWithBackoff } from '@/lib/utils';
import { Card, Button, Skeleton } from '@/components/ui';

interface ClientData {
  client: {
    id: string;
    fullName: string;
    email: string;
    goal: string | null;
    createdAt: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingPacketId, setViewingPacketId] = useState<string | null>(null);

  const fetchClientData = async () => {
    setLoading(true);
    setError(null);

    try {
      const clientData = await retryWithBackoff(async () => {
        const response = await fetch('/api/me/client');

        if (response.status === 401) {
          router.push('/login');
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch client data');
        }

        return await response.json();
      });

      setData(clientData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error('Failed to load dashboard', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [router]);

  const handlePacketView = (packetId: string) => {
    setViewingPacketId(packetId);
  };

  const handleCloseViewer = () => {
    setViewingPacketId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section Skeleton */}
          <div className="mb-8">
            <Skeleton width="300px" height="36px" className="mb-2" />
            <Skeleton width="400px" height="24px" />
          </div>

          {/* Packets Section Skeleton */}
          <div className="mb-12">
            <Skeleton width="150px" height="32px" className="mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <Skeleton width="200px" height="24px" className="mb-4" />
                  <Skeleton width="100%" height="40px" />
                </Card>
              ))}
            </div>
          </div>

          {/* Check-ins Section Skeleton */}
          <Card className="mb-12 animate-pulse">
            <Skeleton width="200px" height="32px" className="mb-4" />
            <Skeleton width="100%" height="20px" className="mb-2" />
            <Skeleton width="80%" height="20px" className="mb-4" />
            <Skeleton width="220px" height="40px" />
          </Card>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorDisplay
            title="Failed to load dashboard"
            message={error || 'Unable to fetch your data'}
            onRetry={fetchClientData}
          />
        </div>
      </div>
    );
  }

  // If viewing a packet, show the viewer
  if (viewingPacketId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PacketViewer
            packetId={viewingPacketId}
            onClose={handleCloseViewer}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {data.client.fullName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's your personalized health journey dashboard
          </p>
        </div>

        {/* Packets Section */}
        <div className="mb-12">
          <PacketList onPacketView={handlePacketView} />
        </div>

        {/* Weekly Check-Ins Section */}
        <Card className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Weekly Check-Ins
          </h2>
          <p className="text-gray-600 mb-4">
            Track your progress and stay accountable with weekly check-ins.
          </p>
          <Button
            as="a"
            href="https://forms.gle/your-progress-form-link"
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
          >
            Complete Weekly Check-In
          </Button>
        </Card>

        {/* Next Steps Section */}
        <Card className="bg-blue-50 border-blue-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Next Steps
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>1. Review Your Packets:</strong> Once your packets are ready, 
              click "View Packet" to access your personalized documents.
            </p>
            <p>
              <strong>2. Follow Your Plan:</strong> Use your Nutrition and Workout 
              packets as your guide to achieving your health goals.
            </p>
            <p>
              <strong>3. Check In Weekly:</strong> Complete your weekly progress form 
              to track your journey and get ongoing support.
            </p>
            <p>
              <strong>4. Stay Connected:</strong> Reach out to your coach if you have 
              questions or need adjustments to your plan.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
