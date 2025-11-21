'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui';

type User = {
  id: string;
  email: string;
  name: string | null;
  role: 'CLIENT' | 'COACH' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  createdAt: string;
};

type RoleFilter = 'ALL' | 'CLIENT' | 'COACH' | 'ADMIN';
type StatusFilter = 'ALL' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

interface UserManagementTableProps {
  users: User[];
  onEditRole: (user: User) => void;
  onChangeStatus: (user: User) => void;
}

export default function UserManagementTable({
  users,
  onEditRole,
  onChangeStatus,
}: UserManagementTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Role filter
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

      // Status filter
      const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'COACH':
        return 'bg-blue-100 text-blue-800';
      case 'CLIENT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500';
      case 'SUSPENDED':
        return 'bg-yellow-500';
      case 'DEACTIVATED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const toggleMenu = (userId: string) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Input */}
        <div>
          <label htmlFor="user-search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Users
          </label>
          <input
            id="user-search"
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afya-primary focus:border-transparent text-base"
          />
        </div>

        {/* Filter Chips */}
        <div className="space-y-3">
          {/* Role Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Role
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRoleFilter('ALL')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  roleFilter === 'ALL'
                    ? 'bg-afya-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Roles
              </button>
              <button
                onClick={() => setRoleFilter('CLIENT')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  roleFilter === 'CLIENT'
                    ? 'bg-gray-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Clients
              </button>
              <button
                onClick={() => setRoleFilter('COACH')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  roleFilter === 'COACH'
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Coaches
              </button>
              <button
                onClick={() => setRoleFilter('ADMIN')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  roleFilter === 'ADMIN'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admins
              </button>
            </div>
          </div>

          {/* Status Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-afya-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => setStatusFilter('ACTIVE')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === 'ACTIVE'
                    ? 'bg-green-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('SUSPENDED')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === 'SUSPENDED'
                    ? 'bg-yellow-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Suspended
              </button>
              <button
                onClick={() => setStatusFilter('DEACTIVATED')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === 'DEACTIVATED'
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Deactivated
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="text-sm font-medium text-gray-700">
          Showing {filteredUsers.length} of {users.length} users
        </div>
        {(searchQuery || roleFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setRoleFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="text-sm text-afya-primary hover:text-afya-primary-dark font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getRoleBadgeVariant(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${getStatusDotColor(
                        user.status
                      )}`}
                    ></span>
                    <span className="text-sm text-gray-700">{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative inline-block">
                    <button
                      onClick={() => toggleMenu(user.id)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-afya-primary rounded p-1"
                      aria-label="Actions menu"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    {openMenuId === user.id && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        ></div>

                        {/* Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                onEditRole(user);
                                setOpenMenuId(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Edit Role
                            </button>
                            <button
                              onClick={() => {
                                onChangeStatus(user);
                                setOpenMenuId(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Change Status
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your filters
          </div>
        )}
      </div>
    </div>
  );
}
