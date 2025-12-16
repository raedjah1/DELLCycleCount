// ============================================================================
// METRIC CARD WIDGET - Display a single metric with trend
// ============================================================================

'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel,
  icon,
  color = 'blue',
  className = '' 
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {change !== undefined && (
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span>{change >= 0 ? '↑' : '↓'}</span>
            <span className="ml-1">{Math.abs(change)}%</span>
            {changeLabel && <span className="ml-1 text-gray-500">vs {changeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
