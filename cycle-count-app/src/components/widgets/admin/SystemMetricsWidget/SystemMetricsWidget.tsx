// ============================================================================
// SYSTEM METRICS WIDGET - Admin Dashboard Key Performance Indicators
// ============================================================================
// Location: /components/widgets/admin/SystemMetricsWidget/
// Purpose: Display critical system metrics with professional design

'use client';

import { designSystem } from '@/lib/design/designSystem';

interface SystemMetricsWidgetProps {
  metrics: {
    totalLocations: number;
    totalItems: number;
    totalUsers: number;
    dataQualityIssues: number;
    locationsChange?: number;
    itemsChange?: number;
    usersChange?: number;
  };
}

export function SystemMetricsWidget({ metrics }: SystemMetricsWidgetProps) {
  const metricCards = [
    {
      title: 'Total Locations',
      value: metrics.totalLocations.toLocaleString(),
      change: metrics.locationsChange,
      icon: '📍',
      color: 'blue' as const,
      href: '/admin/locations'
    },
    {
      title: 'Total Items',
      value: metrics.totalItems.toLocaleString(),
      change: metrics.itemsChange,
      icon: '📦',
      color: 'green' as const,
      href: '/admin/items'
    },
    {
      title: 'Active Users',
      value: metrics.totalUsers.toString(),
      change: metrics.usersChange,
      icon: '👥',
      color: 'purple' as const,
      href: '/admin/users'
    },
    {
      title: 'Data Quality Issues',
      value: metrics.dataQualityIssues.toString(),
      change: undefined,
      icon: '⚠️',
      color: metrics.dataQualityIssues > 0 ? 'red' as const : 'green' as const,
      href: '/admin/data-quality'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Key performance indicators and system health</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live Data</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// METRIC CARD COMPONENT
// ============================================================================

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'red';
  href?: string;
}

function MetricCard({ title, value, change, icon, color, href }: MetricCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-l-blue-500',
      text: 'text-blue-600',
      icon: 'bg-blue-100 text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-l-green-500',
      text: 'text-green-600',
      icon: 'bg-green-100 text-green-600'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-l-purple-500',
      text: 'text-purple-600',
      icon: 'bg-purple-100 text-purple-600'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-l-red-500',
      text: 'text-red-600',
      icon: 'bg-red-100 text-red-600'
    }
  };

  const classes = colorClasses[color];

  const content = (
    <div 
      className={`
        relative overflow-hidden rounded-xl border-l-4 ${classes.border} ${classes.bg} 
        p-6 transition-all duration-200 hover:shadow-lg hover:shadow-${color}-100/50
        ${href ? 'cursor-pointer hover:scale-[1.02]' : ''}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-10">
        <div className="w-24 h-24 rounded-full bg-current"></div>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            
            {/* Change Indicator */}
            {change !== undefined && (
              <div className="flex items-center">
                <span 
                  className={`text-sm font-medium ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {change >= 0 ? '+' : ''}{change}%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            )}
          </div>

          {/* Icon */}
          <div className={`w-12 h-12 rounded-lg ${classes.icon} flex items-center justify-center`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}
