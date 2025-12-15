// ============================================================================
// NAVBAR COMPONENT - Professional Top Navigation
// ============================================================================
// Location: /components/layouts/Navbar/
// Purpose: Consistent top navigation across all role dashboards

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { designSystem, getColorPalette } from '@/lib/design/designSystem';

interface NavbarProps {
  userEmail: string;
  userRole: 'admin' | 'manager' | 'lead' | 'operator' | 'viewer';
  currentPath?: string;
}

export function Navbar({ userEmail, userRole, currentPath = '' }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roleColors = getColorPalette(userRole);

  // Get user initials
  const initials = userEmail
    .split('@')[0]
    .split('.')
    .map(name => name.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  // Role-based navigation items
  const getQuickLinks = () => {
    switch (userRole) {
      case 'admin':
        return [
          { label: 'Dashboard', href: '/admin/dashboard', icon: '🏠' },
          { label: 'OnHand Import', href: '/admin/imports/onhand', icon: '📤' },
          { label: 'Transaction Import', href: '/admin/imports/transactions', icon: '📊' },
          { label: 'User Management', href: '/admin/users', icon: '👥' }
        ];
      case 'manager':
        return [
          { label: 'Dashboard', href: '/manager/dashboard', icon: '🏠' },
          { label: 'Cycle Count Plans', href: '/manager/plans', icon: '📋' },
          { label: 'Variance Review', href: '/manager/variances', icon: '🔍' },
          { label: 'Reports', href: '/manager/reports', icon: '📈' }
        ];
      case 'lead':
        return [
          { label: 'Dashboard', href: '/lead/dashboard', icon: '🏠' },
          { label: 'Dispatch Pool', href: '/lead/dispatch', icon: '📢' },
          { label: 'Team Status', href: '/lead/team', icon: '👥' },
          { label: 'Assignments', href: '/lead/assignments', icon: '✅' }
        ];
      case 'operator':
        return [
          { label: 'Dashboard', href: '/operator/dashboard', icon: '🏠' },
          { label: 'My Journals', href: '/operator/journals', icon: '📝' },
          { label: 'Count Tasks', href: '/operator/tasks', icon: '🔢' },
          { label: 'History', href: '/operator/history', icon: '📅' }
        ];
      case 'viewer':
        return [
          { label: 'Dashboard', href: '/viewer/dashboard', icon: '🏠' },
          { label: 'Reports', href: '/viewer/reports', icon: '📊' },
          { label: 'Analytics', href: '/viewer/analytics', icon: '📈' },
          { label: 'Export Data', href: '/viewer/export', icon: '💾' }
        ];
    }
  };

  const quickLinks = getQuickLinks();

  return (
    <nav className="bg-white border-b border-gray-200 relative z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo and Quick Links */}
          <div className="flex items-center space-x-4 lg:space-x-8">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <Link href={`/${userRole}/dashboard`} className="flex items-center">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm`}
                     style={{ backgroundColor: roleColors.primary }}>
                  WC
                </div>
                <span className="ml-2 lg:ml-3 text-base lg:text-xl font-bold text-gray-900 hidden sm:inline">
                  Warehouse Count
                </span>
              </Link>
            </div>

            {/* Quick Links - Responsive with shorter labels on smaller screens */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-2 lg:space-x-4">
                {quickLinks.map((link) => {
                  // Shorten labels for medium screens
                  const shortLabel = link.label.length > 12 
                    ? link.label.replace(' Import', '').replace(' Management', ' Mgmt').replace(' Dashboard', '')
                    : link.label;
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                        currentPath === link.href
                          ? `text-white`
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      style={currentPath === link.href ? { backgroundColor: roleColors.primary } : {}}
                      title={link.label} // Full label on hover
                    >
                      <span className="mr-1 lg:mr-2">{link.icon}</span>
                      <span className="hidden lg:inline">{link.label}</span>
                      <span className="lg:hidden">{shortLabel}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Notifications, User Menu */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Notification Badge */}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 lg:space-x-3 p-1.5 lg:p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm`}
                     style={{ backgroundColor: roleColors.primary }}>
                  {initials}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {userEmail.split('@')[0]}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {userRole}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-400 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <UserDropdown userEmail={userEmail} userRole={userRole} onClose={() => setShowUserMenu(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ============================================================================
// NOTIFICATION DROPDOWN COMPONENT
// ============================================================================

interface NotificationDropdownProps {
  onClose: () => void;
}

function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const notifications = [
    {
      id: '1',
      type: 'success',
      title: 'OnHand Import Complete',
      message: '12,543 records processed successfully',
      timestamp: '5 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Data Quality Issue',
      message: '3 locations with invalid format detected',
      timestamp: '1 hour ago',
      read: false
    }
  ];

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
            <div className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                notification.type === 'success' ? 'bg-green-400' : 'bg-yellow-400'
              }`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-gray-100 text-center">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View All Notifications
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// USER DROPDOWN COMPONENT
// ============================================================================

interface UserDropdownProps {
  userEmail: string;
  userRole: 'admin' | 'manager' | 'lead' | 'operator' | 'viewer';
  onClose: () => void;
}

function UserDropdown({ userEmail, userRole, onClose }: UserDropdownProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Import AuthService dynamically to avoid circular dependencies
      const { AuthService } = await import('@/lib/auth/authService');
      await AuthService.signOut();
      
      // Redirect to login page
      router.push('/auth/login');
      onClose();
    } catch (error) {
      console.error('Sign out error:', error);
      // Still redirect even if sign out fails
      router.push('/auth/login');
      onClose();
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <div className="text-sm font-medium text-gray-900 truncate">{userEmail}</div>
        <div className="text-xs text-gray-500 capitalize mt-1">{userRole} Access</div>
      </div>

      <div className="py-1 sm:py-2">
        <Link
          href={`/${userRole}/profile`}
          className="block px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="truncate">Your Profile</span>
          </div>
        </Link>

        <Link
          href={`/${userRole}/settings`}
          className="block px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">Settings</span>
          </div>
        </Link>

        <div className="border-t border-gray-100 mt-1 sm:mt-2 pt-1 sm:pt-2">
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-3 sm:px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 sm:mr-3 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="truncate">Sign Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
