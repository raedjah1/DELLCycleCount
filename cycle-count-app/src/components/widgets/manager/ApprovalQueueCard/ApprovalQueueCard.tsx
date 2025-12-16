// ============================================================================
// APPROVAL QUEUE CARD WIDGET - Finished Goods approval request
// ============================================================================

'use client';

import { ApprovalRequest } from '@/lib/services/managerService';

interface ApprovalQueueCardProps {
  request: ApprovalRequest;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onViewDetails: (request: ApprovalRequest) => void;
  className?: string;
}

export function ApprovalQueueCard({ 
  request, 
  onApprove,
  onReject,
  onViewDetails,
  className = '' 
}: ApprovalQueueCardProps) {
  const getStatusColor = (status: ApprovalRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partially_approved': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const needsWarehouseManagerApproval = request.warehouse_manager_approval === 'pending';
  const needsICManagerApproval = request.is_high_impact && request.ic_manager_approval === 'pending';

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{request.part_number}</h3>
            {request.is_high_impact && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                High Impact
              </span>
            )}
            {request.warehouse_type === 'Finishedgoods' && (
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                Finished Goods
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{request.location_code}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(request.status)}`}>
          {request.status.replace('_', ' ')}
        </span>
      </div>

      {request.photo_url && (
        <div className="mb-3">
          <img 
            src={request.photo_url} 
            alt="Evidence" 
            className="w-full h-20 object-cover rounded border border-gray-200 cursor-pointer"
            onClick={() => onViewDetails(request)}
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
        <div>
          <span className="text-gray-600">Expected</span>
          <p className="font-medium text-gray-900">{request.expected_qty}</p>
        </div>
        <div>
          <span className="text-gray-600">Actual</span>
          <p className="font-medium text-gray-900">{request.actual_qty}</p>
        </div>
        <div>
          <span className="text-gray-600">Variance</span>
          <p className={`font-medium ${request.variance_qty < 0 ? 'text-red-600' : 'text-blue-600'}`}>
            {request.variance_qty > 0 ? '+' : ''}{request.variance_qty}
          </p>
        </div>
      </div>

      {request.is_high_impact && (
        <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">IC Manager:</span>
            <span className={request.ic_manager_approval === 'approved' ? 'text-green-600' : 'text-gray-400'}>
              {request.ic_manager_approval === 'approved' ? '✓ Approved' : 'Pending'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Warehouse Manager:</span>
            <span className={request.warehouse_manager_approval === 'approved' ? 'text-green-600' : 'text-gray-400'}>
              {request.warehouse_manager_approval === 'approved' ? '✓ Approved' : 'Pending'}
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {(needsWarehouseManagerApproval || needsICManagerApproval) && (
          <>
            <button
              onClick={() => onApprove(request.id)}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(request.id)}
              className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
          </>
        )}
        <button
          onClick={() => onViewDetails(request)}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          View
        </button>
      </div>
    </div>
  );
}
