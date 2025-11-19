'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui';
import { useToast } from '@/components/Toast';

type User = {
  id: string;
  email: string;
  name: string | null;
  role: 'CLIENT' | 'COACH' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  createdAt: string;
};

interface RoleChangeDialogProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RoleChangeDialog({
  isOpen,
  user,
  onClose,
  onSuccess,
}: RoleChangeDialogProps) {
  const toast = useToast();
  const [newRole, setNewRole] = useState<'CLIENT' | 'COACH' | 'ADMIN'>(
    user?.role || 'CLIENT'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (newRole === user.role) {
      toast.error('No change', 'Please select a different role');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/users/${user.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          toast.error('Failed to change role', data.error);
        } else {
          throw new Error('Failed to change role');
        }
        return;
      }

      // Success
      toast.success(
        'Role updated',
        `${user.name || user.email}'s role has been changed to ${newRole}`
      );
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      toast.error('Failed to change role', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Change User Role
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-afya-primary rounded"
                aria-label="Close dialog"
                disabled={isSubmitting}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-4">
              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">User</div>
                <div className="font-medium text-gray-900">
                  {user.name || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>

              {/* Current Role */}
              <div>
                <div className="text-sm text-gray-600 mb-2">Current Role</div>
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </div>

              {/* New Role Selection */}
              <div>
                <label
                  htmlFor="newRole"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Role
                </label>
                <select
                  id="newRole"
                  value={newRole}
                  onChange={(e) =>
                    setNewRole(e.target.value as 'CLIENT' | 'COACH' | 'ADMIN')
                  }
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afya-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="CLIENT">Client</option>
                  <option value="COACH">Coach</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {/* Warning Message */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <svg
                    className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Important</p>
                    <p>
                      Changing this user's role will immediately invalidate their
                      current session. They will need to log in again to access
                      their new permissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-lg">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Changing...' : 'Change Role'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
