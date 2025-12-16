// ============================================================================
// VERIFIED COUNTER CARD WIDGET - Verified Counter certification request
// ============================================================================

'use client';

import { VerifiedCounterRequest } from '@/lib/services/managerService';

interface VerifiedCounterCardProps {
  request: VerifiedCounterRequest;
  managerRole: 'IC_Manager' | 'Warehouse_Manager';
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  className?: string;
}

export function VerifiedCounterCard({ 
  request, 
  managerRole,
  onApprove,
  onReject,
  className = '' 
}: VerifiedCounterCardProps) {
  const needsWarehouseManagerApproval = managerRole === 'Warehouse_Manager' && 
                                        request.warehouse_manager_approval === 'pending';
  const needsICManagerApproval = managerRole === 'IC_Manager' && 
                                  request.ic_manager_approval === 'pending';
  const canApprove = needsWarehouseManagerApproval || needsICManagerApproval;

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{request.user.name}</h3>
          <p className="text-sm text-gray-600">{request.user.email}</p>
          <p className="text-xs text-gray-500 mt-1">{request.user.role}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded ${
          request.status === 'approved' ? 'bg-green-100 text-green-800' :
          request.status === 'pending' || request.status === 'partially_approved' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {request.status.replace('_', ' ')}
        </span>
      </div>

      <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">IC Manager:</span>
          <span className={request.ic_manager_approval === 'approved' ? 'text-green-600' : 'text-gray-400'}>
            {request.ic_manager_approval === 'approved' ? '✓ Approved' : 
             request.ic_manager_approval === 'rejected' ? '✗ Rejected' : 'Pending'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Warehouse Manager:</span>
          <span className={request.warehouse_manager_approval === 'approved' ? 'text-green-600' : 'text-gray-400'}>
            {request.warehouse_manager_approval === 'approved' ? '✓ Approved' :
             request.warehouse_manager_approval === 'rejected' ? '✗ Rejected' : 'Pending'}
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-3">
        Requested by {request.requester.name} on {new Date(request.requested_at).toLocaleDateString()}
      </div>

      {canApprove && (
        <div className="flex gap-2">
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
        </div>
      )}
    </div>
  );
}
