// ============================================================================
// TEAM PERFORMANCE CARD - Individual operator performance
// ============================================================================

'use client';

import { TeamPerformance } from '@/lib/services/supervisorService';

interface TeamPerformanceCardProps {
  performance: TeamPerformance;
  className?: string;
}

export function TeamPerformanceCard({ performance, className = '' }: TeamPerformanceCardProps) {
  const getStatusColor = (status: TeamPerformance['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'working': return 'bg-blue-100 text-blue-800';
      case 'on_break': return 'bg-yellow-100 text-yellow-800';
      case 'on_lunch': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{performance.operator_name}</h3>
          <p className="text-sm text-gray-600">Operator</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(performance.status)}`}>
          {performance.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <span className="text-gray-600">Journals Completed</span>
          <p className="font-medium text-gray-900">{performance.journals_completed}</p>
        </div>
        <div>
          <span className="text-gray-600">Locations Counted</span>
          <p className="font-medium text-gray-900">{performance.locations_counted}</p>
        </div>
        <div>
          <span className="text-gray-600">Accuracy</span>
          <p className="font-medium text-green-600">{performance.average_accuracy.toFixed(1)}%</p>
        </div>
        <div>
          <span className="text-gray-600">On-Time Rate</span>
          <p className="font-medium text-blue-600">{performance.on_time_completion_rate.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
