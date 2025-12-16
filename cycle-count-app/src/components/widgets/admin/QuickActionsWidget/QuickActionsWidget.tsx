// ============================================================================
// QUICK ACTIONS WIDGET - Admin Dashboard Primary Actions
// ============================================================================
// Location: /components/widgets/admin/QuickActionsWidget/
// Purpose: Provide quick access to key admin functions with beautiful design

'use client';

import Link from 'next/link';

interface QuickActionsWidgetProps {
  alertCounts?: {
    dataQualityIssues?: number;
    failedImports?: number;
    systemAlerts?: number;
  };
}

export function QuickActionsWidget({ alertCounts = {} }: QuickActionsWidgetProps) {
  const primaryActions = [
    {
      title: 'OnHand Import (Raw Goods)',
      description: 'Import current inventory snapshots for raw goods from Excel',
      href: '/admin/imports/onhand/raw-goods',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      color: 'blue',
      priority: 'high' as const
    },
    {
      title: 'OnHand Import (Finished Goods)',
      description: 'Import current inventory snapshots for finished goods from Excel',
      href: '/admin/imports/onhand',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'green',
      priority: 'high' as const
    },
    {
      title: 'Transaction Import',
      description: 'Import warehouse transaction history from Excel',
      href: '/admin/imports/transactions',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'indigo',
      priority: 'high' as const
    }
  ] as const;

  const secondaryActions = [
    {
      title: 'Location Management',
      description: 'Manage warehouse locations with Excel import',
      href: '/admin/locations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'green'
    },
    {
      title: 'Item Management',
      description: 'Manage product catalog with Excel import',
      href: '/admin/items',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'purple'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      href: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'orange'
    },
    {
      title: 'Data Quality Issues',
      description: 'Review and resolve import issues',
      href: '/admin/data-quality',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      color: 'red',
      badge: alertCounts.dataQualityIssues
    },
    {
      title: 'System Configuration',
      description: 'Configure system settings and parameters',
      href: '/admin/config',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'gray'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Primary Actions Section */}
      <div>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Data Management</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Import and process warehouse data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {primaryActions.map((action, index) => (
            <PrimaryActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Secondary Actions Section */}
      <div>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">System Management</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Configure and maintain system components</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {secondaryActions.map((action, index) => (
            <SecondaryActionCard key={index} {...action} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PRIMARY ACTION CARD - Large, prominent actions
// ============================================================================

interface PrimaryActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  priority?: 'high' | 'normal';
}

function PrimaryActionCard({ title, description, href, icon, color, priority = 'normal' }: PrimaryActionCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
  };

  return (
    <Link 
      href={href}
      className="group block"
    >
      <div className={`
        relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}
        p-5 sm:p-8 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
        ${priority === 'high' ? 'ring-2 ring-white/20' : ''}
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm">
              <div className="w-5 h-5 sm:w-6 sm:h-6">{icon}</div>
            </div>
            {priority === 'high' && (
              <span className="px-2 py-1 text-xs font-medium bg-white/20 rounded-full backdrop-blur-sm">
                Priority
              </span>
            )}
          </div>
          
          <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-white/90">
            {title}
          </h3>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            {description}
          </p>

          {/* Arrow Icon */}
          <div className="mt-3 sm:mt-4 flex items-center text-white/60 group-hover:text-white/80 transition-colors">
            <span className="text-xs sm:text-sm font-medium mr-2">Get Started</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================================================
// SECONDARY ACTION CARD - Compact, utility actions
// ============================================================================

interface SecondaryActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  badge?: number;
}

function SecondaryActionCard({ title, description, href, icon, color, badge }: SecondaryActionCardProps) {
  const colorClasses = {
    green: 'text-green-600 bg-green-50 border-green-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200',
    orange: 'text-orange-600 bg-orange-50 border-orange-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    gray: 'text-gray-600 bg-gray-50 border-gray-200'
  };

  return (
    <Link 
      href={href}
      className="group block relative"
    >
      <div className="relative bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg group-hover:scale-[1.02]">
        {/* Badge */}
        {badge && badge > 0 && (
          <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {badge > 99 ? '99+' : badge}
          </div>
        )}

        {/* Icon */}
        <div className={`inline-flex p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.gray}`}>
          <div className="w-4 h-4 sm:w-5 sm:h-5">{icon}</div>
        </div>

        {/* Content */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-gray-700">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          {description}
        </p>

        {/* Hover Arrow */}
        <div className="mt-3 sm:mt-4 flex items-center text-gray-400 group-hover:text-gray-600 transition-colors">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
