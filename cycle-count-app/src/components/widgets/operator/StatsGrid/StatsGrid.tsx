// ============================================================================
// STATS GRID WIDGET - Operator performance metrics display
// ============================================================================

'use client';

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

interface StatsGridProps {
  stats: StatItem[];
  className?: string;
}

export function StatsGrid({ stats, className = '' }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg ${stat.color}`}>
              <div className="w-4 h-4 sm:w-5 sm:h-5">
                {stat.icon}
              </div>
            </div>
            <div className="ml-2 sm:ml-3 min-w-0 flex-1">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
              <p className="text-xs text-gray-600 leading-tight">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
