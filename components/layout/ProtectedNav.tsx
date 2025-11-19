'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

interface ProtectedNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export default function ProtectedNav({ user }: ProtectedNavProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: '/login?loggedOut=true' });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center space-x-8">
            <span className="text-3xl font-bold bg-gradient-to-r from-afya-primary to-purple-600 bg-clip-text text-transparent">
              AFYA
            </span>
            <div className="flex items-baseline space-x-4">
              {user.role === 'CLIENT' && (
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
              {(user.role === 'ADMIN' || user.role === 'COACH') && (
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin/users"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  User Management
                </Link>
              )}
            </div>
          </div>
          
          {/* Centered Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/dashboard" className="block group">
              <img 
                src="/afya-logo.png" 
                alt="AFYA Logo" 
                className="h-20 w-auto object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user.name || user.email}
            </span>
            <Link
              href="/settings/profile"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
