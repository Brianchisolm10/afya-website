'use client';

import { useState, useEffect } from 'react';
import ClientTable from '@/components/admin/ClientTable';
import ClientDetail from '@/components/admin/ClientDetail';
import { ErrorDisplay } from '@/components/ErrorBoundary';
import { useToast } from '@/components/Toast';
import { PacketType, PacketStatus } from '@/types';

type ClientWithPacketInfo = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  packetCount: number;
  pendingCount: number;
  readyCount: number;
  failedCount: number;
};

type ClientDetails = {
  id: string;
  fullName: string;
  email: string;
  goal: string | null;
  createdAt: string;
  packets: Array<{
    id: string;
    type: PacketType;
    status: PacketStatus;
    docUrl: string | null;
    pdfUrl: string | null;
    lastError: string | null;
    version: number;
    createdAt: string;
    updatedAt: string;
  }>;
};

interface AdminPanelProps {
  clients: ClientWithPacketInfo[];
}

export default function AdminPanel({ clients }: AdminPanelProps) {
  const toast = useToast();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientDetails, setClientDetails] = useState<ClientDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<PacketStatus | 'ALL'>('ALL');

  useEffect(() => {
    if (selectedClientId) {
      fetchClientDetails(selectedClientId);
    }
  }, [selectedClientId]);

  const fetchClientDetails = async (clientId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/clients/${clientId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch client details');
      }

      const data = await response.json();
      setClientDetails(data.client);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setClientDetails(null);
      toast.error('Failed to load client details', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleRefresh = () => {
    if (selectedClientId) {
      fetchClientDetails(selectedClientId);
    }
  };

  // Filter clients based on packet status
  const filteredClients = statusFilter === 'ALL' 
    ? clients 
    : clients.filter(client => {
        switch (statusFilter) {
          case 'PENDING':
            return client.pendingCount > 0;
          case 'READY':
            return client.readyCount > 0;
          case 'FAILED':
            return client.failedCount > 0;
          default:
            return true;
        }
      });

  return (
    <div className="space-y-6">
      {/* Packet Status Filter */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Packet Status</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-afya-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({clients.length})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === 'PENDING'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({clients.reduce((sum, c) => sum + c.pendingCount, 0)})
              </button>
              <button
                onClick={() => setStatusFilter('READY')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === 'READY'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ready ({clients.reduce((sum, c) => sum + c.readyCount, 0)})
              </button>
              <button
                onClick={() => setStatusFilter('FAILED')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === 'FAILED'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Failed ({clients.reduce((sum, c) => sum + c.failedCount, 0)})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {statusFilter === 'ALL' ? 'All Clients' : `Clients with ${statusFilter} Packets`}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'} 
              {statusFilter !== 'ALL' && ` with ${statusFilter.toLowerCase()} packets`}
            </p>
          </div>
          <ClientTable
            clients={filteredClients}
            onClientSelect={handleClientSelect}
            selectedClientId={selectedClientId || undefined}
          />
        </div>

        <div>
          {!selectedClientId && (
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-gray-500 text-center">
                Select a client to view packet details
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          )}

          {error && selectedClientId && (
            <div className="bg-white shadow rounded-lg p-6">
              <ErrorDisplay
                title="Error loading client details"
                message={error}
                onRetry={() => fetchClientDetails(selectedClientId)}
              />
            </div>
          )}

          {!loading && !error && clientDetails && (
            <ClientDetail 
              client={clientDetails} 
              onRefresh={handleRefresh}
            />
          )}
        </div>
      </div>
    </div>
  );
}
