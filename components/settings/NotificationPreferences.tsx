'use client';

/**
 * NotificationPreferences Component
 * 
 * Allows users to manage their notification preferences.
 */

import { useState, useEffect } from 'react';

interface Preferences {
  emailNotifications: boolean;
  notifyOnPacketReady: boolean;
  notifyOnPacketUpdate: boolean;
}

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    notifyOnPacketReady: true,
    notifyOnPacketUpdate: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch preferences on mount
  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/me/notification-preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setMessage({ type: 'error', text: 'Failed to load preferences' });
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<Preferences>) => {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch('/api/me/notification-preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
        setMessage({ type: 'success', text: 'Preferences updated successfully' });
        
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to update preferences' });
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      setMessage({ type: 'error', text: 'Failed to update preferences' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof Preferences) => {
    const newValue = !preferences[key];
    setPreferences(prev => ({ ...prev, [key]: newValue }));
    updatePreferences({ [key]: newValue });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Notification Preferences
        </h2>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Notification Preferences
      </h2>

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Email Notifications Master Toggle */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="emailNotifications"
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
              disabled={saving}
              className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 disabled:opacity-50"
            />
          </div>
          <div className="ml-3">
            <label
              htmlFor="emailNotifications"
              className="font-medium text-gray-900 cursor-pointer"
            >
              Email Notifications
            </label>
            <p className="text-sm text-gray-500">
              Receive email notifications for important updates
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Specific Notification Types */}
        <div className="space-y-4 pl-7">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="notifyOnPacketReady"
                type="checkbox"
                checked={preferences.notifyOnPacketReady}
                onChange={() => handleToggle('notifyOnPacketReady')}
                disabled={saving || !preferences.emailNotifications}
                className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 disabled:opacity-50"
              />
            </div>
            <div className="ml-3">
              <label
                htmlFor="notifyOnPacketReady"
                className={`text-sm font-medium ${
                  preferences.emailNotifications ? 'text-gray-900 cursor-pointer' : 'text-gray-400'
                }`}
              >
                New Packet Ready
              </label>
              <p className="text-sm text-gray-500">
                Get notified when your personalized packets are ready to view
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="notifyOnPacketUpdate"
                type="checkbox"
                checked={preferences.notifyOnPacketUpdate}
                onChange={() => handleToggle('notifyOnPacketUpdate')}
                disabled={saving || !preferences.emailNotifications}
                className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 disabled:opacity-50"
              />
            </div>
            <div className="ml-3">
              <label
                htmlFor="notifyOnPacketUpdate"
                className={`text-sm font-medium ${
                  preferences.emailNotifications ? 'text-gray-900 cursor-pointer' : 'text-gray-400'
                }`}
              >
                Packet Updates
              </label>
              <p className="text-sm text-gray-500">
                Get notified when your coach updates your packets
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You'll always receive in-app notifications regardless of your email preferences.
                These settings only control email notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
