'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PacketType, PacketStatus } from '@/types';
import { Card, Badge, Button } from '@/components/ui';
import { useToast } from '@/components/Toast';

type PacketWithDetails = {
  id: string;
  type: PacketType;
  status: PacketStatus;
  docUrl: string | null;
  pdfUrl: string | null;
  lastError: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
};

interface AdminPacketManagerProps {
  clientId: string;
  clientName: string;
  packets: PacketWithDetails[];
  onRefresh: () => void;
}

export default function AdminPacketManager({ 
  clientId, 
  clientName, 
  packets, 
  onRefresh 
}: AdminPacketManagerProps) {
  const router = useRouter();
  const toast = useToast();
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getStatusVariant = (status: PacketStatus): 'default' | 'success' | 'danger' => {
    switch (status) {
      case 'READY':
        return 'success';
      case 'PENDING':
        return 'default';
      case 'FAILED':
        return 'danger';
      default:
        return 'default';
    }
  };

  const formatPacketType = (type: PacketType) => {
    const typeMap: Record<PacketType, string> = {
      INTRO: 'Introduction',
      NUTRITION: 'Nutrition',
      WORKOUT: 'Workout',
      PERFORMANCE: 'Performance',
      YOUTH: 'Youth Training',
      RECOVERY: 'Recovery',
      WELLNESS: 'Wellness',
    };
    return typeMap[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewPacket = (packetId: string) => {
    router.push(`/admin/packets/${packetId}`);
  };

  const handleEditPacket = (packetId: string) => {
    router.push(`/admin/packets/${packetId}/edit`);
  };

  const handleRegeneratePacket = async (packetId: string) => {
    if (!confirm('Are you sure you want to regenerate this packet? This will create a new version.')) {
      return;
    }

    setRegeneratingId(packetId);

    try {
      const response = await fetch(`/api/admin/packets/${packetId}/regenerate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to regenerate packet');
      }

      const data = await response.json();
      toast.success('Packet Regeneration Started', data.message || 'Packet is being regenerated');
      onRefresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.error('Regeneration Failed', errorMessage);
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleDeletePacket = async (packetId: string, packetType: string) => {
    if (!confirm(`Are you sure you want to delete this ${packetType} packet? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(packetId);

    try {
      const response = await fetch(`/api/admin/packets/${packetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete packet');
      }

      toast.success('Packet Deleted', 'The packet has been successfully deleted');
      onRefresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.error('Deletion Failed', errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadPDF = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Packet Management</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>

      {packets.length === 0 ? (
        <Card variant="bordered" padding="lg">
          <p className="text-gray-500 text-center">No packets found for this client.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {packets.map((packet) => (
            <Card
              key={packet.id}
              variant="bordered"
              padding="md"
              className="hover:border-gray-400 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-md font-medium text-gray-900">
                      {formatPacketType(packet.type)}
                    </h4>
                    <Badge variant={getStatusVariant(packet.status)}>
                      {packet.status}
                    </Badge>
                    <span className="text-xs text-gray-500">v{packet.version}</span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Created: {formatDate(packet.createdAt)}</p>
                    <p>Updated: {formatDate(packet.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {packet.status === 'FAILED' && packet.lastError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded" role="alert">
                  <p className="text-xs font-medium text-red-800 mb-1">Error Details:</p>
                  <p className="text-xs text-red-700">{packet.lastError}</p>
                </div>
              )}

              {packet.status === 'PENDING' && (
                <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800">
                    This packet is being generated and will be available soon.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {packet.status === 'READY' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleViewPacket(packet.id)}
                      className="flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPacket(packet.id)}
                      className="flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                    {packet.pdfUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(packet.pdfUrl!)}
                        className="flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        PDF
                      </Button>
                    )}
                  </>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRegeneratePacket(packet.id)}
                  disabled={regeneratingId === packet.id}
                  className="flex items-center gap-1"
                >
                  {regeneratingId === packet.id ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate
                    </>
                  )}
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeletePacket(packet.id, formatPacketType(packet.type))}
                  disabled={deletingId === packet.id}
                  className="flex items-center gap-1"
                >
                  {deletingId === packet.id ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
