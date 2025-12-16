// ============================================================================
// OPERATOR STATUS CARD WIDGET - Individual operator status display
// ============================================================================

'use client';

import { OperatorStatus } from '@/lib/services/leadService';

interface OperatorStatusCardProps {
  operator: OperatorStatus;
  onAssignWork?: (operatorId: string) => void;
  onViewDetails?: (operatorId: string) => void;
  className?: string;
}

export function OperatorStatusCard({ 
  operator, 
  onAssignWork,
  onViewDetails,
  className = '' 
}: OperatorStatusCardProps) {
  const getStatusColor = (status: OperatorStatus['status']) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 border-green-200';
      case 'Working': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'On Break': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'On Lunch': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: OperatorStatus['status']) => {
    switch (status) {
      case 'Available': return '🟢';
      case 'Working': return '🔵';
      case 'On Break': return '🟡';
      case 'On Lunch': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border ${getStatusColor(operator.status)} ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getStatusIcon(operator.status)}</span>
            <h3 className="font-semibold text-gray-900">{operator.name}</h3>
          </div>
          <p className="text-sm text-gray-600">{operator.email}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(operator.status)}`}>
          {operator.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
        <div>
          <span className="text-gray-600">Active</span>
          <p className="font-medium text-gray-900">{operator.activeJournals}</p>
        </div>
        <div>
          <span className="text-gray-600">In Progress</span>
          <p className="font-medium text-gray-900">{operator.inProgress}</p>
        </div>
        <div>
          <span className="text-gray-600">Done Today</span>
          <p className="font-medium text-gray-900">{operator.completedToday}</p>
        </div>
      </div>

      {operator.lastActivity && (
        <p className="text-xs text-gray-500 mb-3">
          Last activity: {new Date(operator.lastActivity).toLocaleTimeString()}
        </p>
      )}

      <div className="flex gap-2">
        {onAssignWork && operator.status === 'Available' && (
          <button
            onClick={() => onAssignWork(operator.id)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Assign Work
          </button>
        )}
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(operator.id)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            View
          </button>
        )}
      </div>
    </div>
  );
}
