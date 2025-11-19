'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui';

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

type SortField = 'fullName' | 'email' | 'createdAt' | 'packetCount';
type SortDirection = 'asc' | 'desc';

interface ClientTableProps {
  clients: ClientWithPacketInfo[];
  onClientSelect: (clientId: string) => void;
  selectedClientId?: string;
}

export default function ClientTable({ clients, onClientSelect, selectedClientId }: ClientTableProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'createdAt') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-400">↕</span>;
    }
    return <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('fullName')}
            >
              <div className="flex items-center gap-2">
                Name
                <SortIcon field="fullName" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('email')}
            >
              <div className="flex items-center gap-2">
                Email
                <SortIcon field="email" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('createdAt')}
            >
              <div className="flex items-center gap-2">
                Created
                <SortIcon field="createdAt" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('packetCount')}
            >
              <div className="flex items-center gap-2">
                Packets
                <SortIcon field="packetCount" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedClients.map((client) => (
            <tr
              key={client.id}
              onClick={() => onClientSelect(client.id)}
              className={`cursor-pointer hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-afya-primary ${
                selectedClientId === client.id ? 'bg-blue-50' : ''
              }`}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${client.fullName}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClientSelect(client.id);
                }
              }}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{client.fullName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{client.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{formatDate(client.createdAt)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant="info" size="sm">
                  {client.packetCount}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-1">
                  {client.pendingCount > 0 && (
                    <Badge variant="default" size="sm" title={`${client.pendingCount} pending`}>
                      P:{client.pendingCount}
                    </Badge>
                  )}
                  {client.readyCount > 0 && (
                    <Badge variant="success" size="sm" title={`${client.readyCount} ready`}>
                      R:{client.readyCount}
                    </Badge>
                  )}
                  {client.failedCount > 0 && (
                    <Badge variant="danger" size="sm" title={`${client.failedCount} failed`}>
                      F:{client.failedCount}
                    </Badge>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {clients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No clients found
        </div>
      )}
    </div>
  );
}
