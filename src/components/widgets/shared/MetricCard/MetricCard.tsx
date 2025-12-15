// ============================================================================
// METRIC CARD - Reusable metric display card
// ============================================================================

'use client';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const colorClasses = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', value: 'text-blue-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600', value: 'text-green-600' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', value: 'text-yellow-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600', value: 'text-red-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', value: 'text-purple-600' }
};

export function MetricCard({
  label,
  value,
  icon,
  trend,
  color = 'blue'
}: MetricCardProps) {
  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">{label}</span>
        {icon && (
          <div className={`p-2 ${colors.bg} rounded-lg`}>
            <div className={colors.text}>{icon}</div>
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between">
        <p className={`text-3xl font-bold ${colors.value}`}>{value}</p>
        {trend && (
          <span className={`text-sm font-medium ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
    </div>
  );
}
