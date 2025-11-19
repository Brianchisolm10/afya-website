'use client';

import { useState, useEffect } from 'react';
import UserManagementTable from '@/components/admin/UserManagementTable';
import CreateUserModal from '@/components/admin/CreateUserModal';
import RoleChangeDialog from '@/components/admin/RoleChangeDialog';
import StatusChangeDialog from '@/components/admin/StatusChangeDialog';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/Toast';

type User = {
  id: string;
  email: string;
  name: string | null;
  role: 'CLIENT' | 'COACH' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  createdAt: string;
};

export default function UserManagementPage() {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(null);
  const [selectedUserForStatus, setSelectedUserForStatus] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.error('Failed to load users', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserCreated = () => {
    fetchUsers();
    setIsCreateModalOpen(false);
  };

  const handleRoleChanged = () => {
    fetchUsers();
    setSelectedUserForRole(null);
  };

  const handleStatusChanged = () => {
    fetchUsers();
    setSelectedUserForStatus(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-afya-primary bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage team member accounts and permissions
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-afya-primary to-blue-600 hover:from-afya-primary-dark hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            Create User
          </Button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <UserManagementTable
              users={users}
              onEditRole={setSelectedUserForRole}
              onChangeStatus={setSelectedUserForStatus}
            />
          )}
        </div>

        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleUserCreated}
        />

        {selectedUserForRole && (
          <RoleChangeDialog
            user={selectedUserForRole}
            onClose={() => setSelectedUserForRole(null)}
            onSuccess={handleRoleChanged}
          />
        )}

        {selectedUserForStatus && (
          <StatusChangeDialog
            user={selectedUserForStatus}
            onClose={() => setSelectedUserForStatus(null)}
            onSuccess={handleStatusChanged}
          />
        )}
      </div>
    </div>
  );
}
