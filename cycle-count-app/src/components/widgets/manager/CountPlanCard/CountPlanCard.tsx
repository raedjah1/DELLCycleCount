// ============================================================================
// COUNT PLAN CARD WIDGET - Individual count plan display
// ============================================================================

'use client';

import { CountPlan } from '@/lib/services/countPlanService';

interface CountPlanCardProps {
  plan: CountPlan & { status?: 'pending' | 'in_progress' | 'completed' };
  onViewDetails?: (planId: string) => void;
  className?: string;
}

export function CountPlanCard({ plan, onViewDetails, className = '' }: CountPlanCardProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={() => onViewDetails?.(plan.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{plan.item.part_no}</h3>
          <p className="text-sm text-gray-600">{plan.location.location_code}</p>
        </div>
        {plan.status && (
          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(plan.status)}`}>
            {plan.status.replace('_', ' ')}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-600">Expected Qty</span>
          <p className="font-medium text-gray-900">{plan.expected_qty}</p>
        </div>
        <div>
          <span className="text-gray-600">Warehouse</span>
          <p className="font-medium text-gray-900">{plan.item.warehouse_type || 'N/A'}</p>
        </div>
      </div>

      {plan.item.description && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600 truncate">{plan.item.description}</p>
        </div>
      )}
    </div>
  );
}
