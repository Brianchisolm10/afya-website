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

interface StatusChangeDialogProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StatusChangeDialog({
  isOpen,
  user,
  onClose,
  onSuccess,
}: StatusChangeDialogProps) {
  const toast = useToast();
  const [newStatus, setNewStatus] = useState<
    'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED'
  >(user?.status || 'ACTIVE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (newStatus === user.status) {
      toast.error('No change', 'Please select a different status');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/users/${user.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          toast.error('Failed to change status', data.error);
        } else {
          throw new Error('Failed to change status');
        }
        return;
      }

      // Success
      toast.success(
        'Status updated',
        `${user.name || user.email}'s status has been changed to ${newStatus}`
      );
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      toast.error('Failed to change status', errorMessage);
    } finally {
      setIsSubmitting(false);
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

  const getWarningMessage = () => {
    if (newStatus === 'SUSPENDED' && user.status !== 'SUSPENDED') {
      return {
        type: 'warning',
        title: 'Suspend Account',
        message:
          'Suspending this account will immediately invalidate all active sessions. The user will not be able to log in until the account is reactivated.',
      };
    }

    if (newStatus === 'DEACTIVATED' && user.status !== 'DEACTIVATED') {
      return {
        type: 'danger',
        title: 'Deactivate Account',
        message:
          'Deactivating this account is a destructive action. The user will lose access immediately and all sessions will be terminated. This action should be used for permanent account closure.',
      };
    }

    if (newStatus === 'ACTIVE' && user.status !== 'ACTIVE') {
      return {
        type: 'info',
        title: 'Reactivate Account',
        message:
          'Reactivating this account will allow the user to log in again. They will receive a notification email.',
      };
    }

    return null;
  };

  const warning = getWarningMessage();

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
                Change Account Status
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

              {/* Current Status */}
              <div>
                <div className="text-sm text-gray-600 mb-2">Current Status</div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${getStatusDotColor(
                      user.status
                    )}`}
                  ></span>
                  <span className="text-sm font-medium text-gray-900">
                    {user.status}
                  </span>
                </div>
              </div>

              {/* New Status Selection */}
              <div>
                <label
                  htmlFor="newStatus"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Status
                </label>
                <select
                  id="newStatus"
                  value={newStatus}
                  onChange={(e) =>
                    setNewStatus(
                      e.target.value as 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED'
                    )
                  }
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afya-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="DEACTIVATED">Deactivated</option>
                </select>
              </div>

              {/* Warning Message */}
              {warning && (
                <div
                  className={`border rounded-lg p-4 ${
                    warning.type === 'danger'
                      ? 'bg-red-50 border-red-200'
                      : warning.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex">
                    <svg
                      className={`w-5 h-5 mr-2 flex-shrink-0 ${
                        warning.type === 'danger'
                          ? 'text-red-600'
                          : warning.type === 'warning'
                          ? 'text-yellow-600'
                          : 'text-blue-600'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {warning.type === 'info' ? (
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      ) : (
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      )}
                    </svg>
                    <div
                      className={`text-sm ${
                        warning.type === 'danger'
                          ? 'text-red-800'
                          : warning.type === 'warning'
                          ? 'text-yellow-800'
                          : 'text-blue-800'
                      }`}
                    >
                      <p className="font-medium mb-1">{warning.title}</p>
                      <p>{warning.message}</p>
                    </div>
                  </div>
                </div>
              )}
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
              <Button
                type="submit"
                disabled={isSubmitting}
                variant={
                  newStatus === 'DEACTIVATED' || newStatus === 'SUSPENDED'
                    ? 'danger'
                    : 'primary'
                }
              >
                {isSubmitting ? 'Changing...' : 'Change Status'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
