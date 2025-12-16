// ============================================================================
// VARIANCE CARD WIDGET - Individual variance display with details
// ============================================================================

'use client';

import { Variance } from '@/lib/services/managerService';

interface VarianceCardProps {
  variance: Variance;
  onSelect: (variance: Variance) => void;
  isSelected?: boolean;
  className?: string;
}

export function VarianceCard({ 
  variance, 
  onSelect, 
  isSelected = false,
  className = '' 
}: VarianceCardProps) {
  const getVarianceColor = (varianceQty: number) => {
    if (varianceQty === 0) return 'text-green-600';
    if (varianceQty > 0) return 'text-blue-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: Variance['status']) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'needs_approval': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm border-2 cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      } ${className}`}
      onClick={() => onSelect(variance)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{variance.part_number}</h3>
            {variance.is_high_impact && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                High Impact
              </span>
            )}
            {variance.warehouse_type === 'Finishedgoods' && (
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                Finished Goods
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{variance.location_code}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(variance.status)}`}>
          {variance.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
        <div>
          <span className="text-gray-600">Expected</span>
          <p className="font-medium text-gray-900">{variance.expected_qty}</p>
        </div>
        <div>
          <span className="text-gray-600">Actual</span>
          <p className="font-medium text-gray-900">{variance.final_count}</p>
        </div>
        <div>
          <span className="text-gray-600">Variance</span>
          <p className={`font-medium ${getVarianceColor(variance.variance_qty)}`}>
            {variance.variance_qty > 0 ? '+' : ''}{variance.variance_qty}
          </p>
        </div>
      </div>

      {variance.photo_url && (
        <div className="mb-3">
          <img 
            src={variance.photo_url} 
            alt="Evidence" 
            className="w-full h-20 object-cover rounded border border-gray-200"
          />
        </div>
      )}

      {variance.is_high_impact && (
        <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">IC Manager:</span>
            <span className={variance.ic_manager_approval === 'approved' ? 'text-green-600' : 'text-gray-400'}>
              {variance.ic_manager_approval === 'approved' ? '✓ Approved' : 
               variance.ic_manager_approval === 'rejected' ? '✗ Rejected' : 'Pending'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Warehouse Manager:</span>
            <span className={variance.warehouse_manager_approval === 'approved' ? 'text-green-600' : 'text-gray-400'}>
              {variance.warehouse_manager_approval === 'approved' ? '✓ Approved' :
               variance.warehouse_manager_approval === 'rejected' ? '✗ Rejected' : 'Pending'}
            </span>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500">
        Journal: {variance.journal.journal_number}
      </div>
    </div>
  );
}
