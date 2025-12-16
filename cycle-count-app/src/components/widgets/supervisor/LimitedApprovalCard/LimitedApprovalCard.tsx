// ============================================================================
// LIMITED APPROVAL CARD - Non-high-impact approval request
// ============================================================================

'use client';

import { LimitedApproval } from '@/lib/services/supervisorService';

interface LimitedApprovalCardProps {
  approval: LimitedApproval;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (approval: LimitedApproval) => void;
  className?: string;
}

export function LimitedApprovalCard({
  approval,
  onApprove,
  onReject,
  onViewDetails,
  className = ''
}: LimitedApprovalCardProps) {
  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{approval.part_number}</h3>
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
              Non-High-Impact
            </span>
          </div>
          <p className="text-sm text-gray-600">{approval.location_code}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded ${
          approval.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          approval.status === 'approved' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {approval.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
        <div>
          <span className="text-gray-600">Expected</span>
          <p className="font-medium text-gray-900">{approval.expected_qty}</p>
        </div>
        <div>
          <span className="text-gray-600">Actual</span>
          <p className="font-medium text-gray-900">{approval.actual_qty}</p>
        </div>
        <div>
          <span className="text-gray-600">Variance</span>
          <p className={`font-medium ${approval.variance_qty < 0 ? 'text-red-600' : 'text-blue-600'}`}>
            {approval.variance_qty > 0 ? '+' : ''}{approval.variance_qty}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {approval.can_approve && (
          <>
            <button
              onClick={() => onApprove(approval.id)}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(approval.id)}
              className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
          </>
        )}
        <button
          onClick={() => onViewDetails(approval)}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          View
        </button>
      </div>
    </div>
  );
}
