'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PacketCard from './PacketCard';
import { PacketType, PacketStatus } from '@/types';
import { Card, Spinner, Button } from '@/components/ui';
import { ErrorDisplay } from '@/components/ErrorBoundary';
import { retryWithBackoff } from '@/lib/utils';

interface Packet {
  id: string;
  type: PacketType;
  status: PacketStatus;
  docUrl: string | null;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PacketListProps {
  onPacketView?: (packetId: string) => void;
}

export default function PacketList({ onPacketView }: PacketListProps) {
  const router = useRouter();
  const [packets, setPackets] = useState<Packet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await retryWithBackoff(async () => {
        const res = await fetch('/api/me/client');

        if (res.status === 401) {
          router.push('/login');
          throw new Error('Unauthorized');
        }

        if (!res.ok) {
          throw new Error('Failed to fetch packets');
        }

        return await res.json();
      });

      setPackets(response.packets || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Failed to load packets"
        message={error}
        onRetry={fetchPackets}
      />
    );
  }

  if (packets.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No packets yet
          </h3>
          <p className="text-gray-600 mb-6">
            Your personalized packets will appear here once they're ready. 
            If you haven't completed your intake yet, start there!
          </p>
          <Button
            as="a"
            href="/intake"
            variant="primary"
          >
            Complete Intake Form
          </Button>
        </div>
      </Card>
    );
  }

  // Group packets by status
  const readyPackets = packets.filter(p => p.status === 'READY');
  const pendingPackets = packets.filter(p => p.status === 'PENDING' || p.status === 'GENERATING');
  const failedPackets = packets.filter(p => p.status === 'FAILED');

  return (
    <div className="space-y-8">
      {/* Ready Packets */}
      {readyPackets.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Your Packets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readyPackets.map((packet) => (
              <PacketCard
                key={packet.id}
                packet={packet}
                onView={onPacketView}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pending Packets */}
      {pendingPackets.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            In Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingPackets.map((packet) => (
              <PacketCard
                key={packet.id}
                packet={packet}
                onView={onPacketView}
              />
            ))}
          </div>
        </div>
      )}

      {/* Failed Packets */}
      {failedPackets.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Needs Attention
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {failedPackets.map((packet) => (
              <PacketCard
                key={packet.id}
                packet={packet}
                onView={onPacketView}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
