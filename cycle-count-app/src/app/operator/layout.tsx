// ============================================================================
// OPERATOR LAYOUT - Warehouse Operator Interface
// ============================================================================
// Layout for operator screens - simplified, mobile-first design

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface OperatorLayoutProps {
  children: React.ReactNode;
}

export default function OperatorLayout({ children }: OperatorLayoutProps) {
  const pathname = usePathname();
  const [presenceStatus, setPresenceStatus] = useState<'Available' | 'On Break' | 'On Lunch'>('Available');

  const navigation = [
    {
      name: 'My Work',
      href: '/operator/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      name: 'Count History',
      href: '/operator/history',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const statusColors = {
    'Available': 'bg-green-100 text-green-800',
    'On Break': 'bg-yellow-100 text-yellow-800',
    'On Lunch': 'bg-red-100 text-red-800'
  };

  const isActivePath = (href: string) => pathname === href;

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Mobile Header - Always visible on mobile */}
      <div className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">OP</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Operator</h1>
              <p className="text-xs text-gray-500">Warehouse Counting</p>
            </div>
          </div>
          <StatusBadge status={presenceStatus} />
        </div>
      </div>

      {/* Sidebar Navigation - Hidden on mobile, persistent on desktop */}
      <div className="hidden md:flex md:w-64 bg-white shadow-lg flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">OP</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Operator Console</h1>
              <p className="text-xs text-gray-500">Warehouse Counting</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActivePath(item.href)
                    ? 'bg-green-100 text-green-700 border-r-2 border-green-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className={`mr-3 ${isActivePath(item.href) ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Status and User Info */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {/* Presence Status Control */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
            <select 
              value={presenceStatus}
              onChange={(e) => setPresenceStatus(e.target.value as any)}
              className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-green-500 focus:border-green-500"
            >
              <option value="Available">Available</option>
              <option value="On Break">On Break</option>
              <option value="On Lunch">On Lunch</option>
            </select>
          </div>

          {/* User Info */}
          <div className="flex items-center pt-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <span className="text-gray-600 font-medium text-sm">JS</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">John Smith</p>
              <p className="text-xs text-gray-500">Shift A • Zone AB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Top Bar */}
        <div className="hidden md:block bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {pathname === '/operator/dashboard' && 'My Work'}
              {pathname.includes('/journal/') && 'Journal Details'}
              {pathname.includes('/count/') && 'Counting'}
              {pathname.includes('/history') && 'Count History'}
            </h2>
            
            <div className="flex items-center space-x-4">
              <StatusBadge status={presenceStatus} />
              
              {/* Emergency Button */}
              <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>

        {/* Mobile Navigation Bar - Always visible on mobile */}
        <div className="md:hidden bg-white border-t border-gray-200 p-2">
          <div className="flex justify-around">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActivePath(item.href)
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
            
            {/* Status Control on Mobile */}
            <button 
              className="flex flex-col items-center p-2 rounded-lg"
              onClick={() => {
                // Could open status modal on mobile
              }}
            >
              <StatusBadge status={presenceStatus} mobile />
              <span className="text-xs mt-1">Status</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STATUS BADGE COMPONENT
// ============================================================================

interface StatusBadgeProps {
  status: 'Available' | 'On Break' | 'On Lunch';
  mobile?: boolean;
}

function StatusBadge({ status, mobile = false }: StatusBadgeProps) {
  const colors = {
    'Available': 'bg-green-100 text-green-800',
    'On Break': 'bg-yellow-100 text-yellow-800',  
    'On Lunch': 'bg-red-100 text-red-800'
  };

  const icons = {
    'Available': '✅',
    'On Break': '☕',
    'On Lunch': '🍽️'
  };

  if (mobile) {
    return (
      <div className="flex flex-col items-center">
        <span className="text-lg">{icons[status]}</span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      <span className="mr-1">{icons[status]}</span>
      {status}
    </span>
  );
}