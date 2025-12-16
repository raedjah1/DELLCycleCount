// ============================================================================
// QUEUE STATUS CARD - Operational queue metrics
// ============================================================================

'use client';

import { QueueStatus } from '@/lib/services/supervisorService';

interface QueueStatusCardProps {
  status: QueueStatus;
  className?: string;
}

export function QueueStatusCard({ status, className = '' }: QueueStatusCardProps) {
  const metrics = [
    {
      label: 'Dispatch Pool',
      value: status.dispatch_pool_count,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Pending Approvals',
      value: status.pending_approvals_count,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Active Journals',
      value: status.active_journals_count,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Operators Available',
      value: status.operators_available,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'On Break',
      value: status.operators_on_break,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      label: 'Urgent Tasks',
      value: status.urgent_tasks,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Status</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`${metric.bgColor} rounded-lg p-4 text-center`}
          >
            <p className={`text-2xl font-bold ${metric.color} mb-1`}>
              {metric.value}
            </p>
            <p className="text-xs text-gray-600">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
