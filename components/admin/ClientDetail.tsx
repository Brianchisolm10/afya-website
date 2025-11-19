'use client';

import { PacketType, PacketStatus } from '@/types';
import { Card } from '@/components/ui';
import AdminPacketManager from './AdminPacketManager';

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

type ClientDetails = {
  id: string;
  fullName: string;
  email: string;
  goal: string | null;
  createdAt: string;
  packets: PacketWithDetails[];
};

interface ClientDetailProps {
  client: ClientDetails;
  onRefresh: () => void;
}

export default function ClientDetail({ client, onRefresh }: ClientDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card variant="elevated" className="animate-fadeIn">
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{client.fullName}</h2>
        <p className="text-gray-600">{client.email}</p>
        {client.goal && (
          <p className="text-sm text-gray-500 mt-1">Goal: {client.goal}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Client since: {formatDate(client.createdAt)}
        </p>
      </div>

      <AdminPacketManager
        clientId={client.id}
        clientName={client.fullName}
        packets={client.packets}
        onRefresh={onRefresh}
      />
    </Card>
  );
}
