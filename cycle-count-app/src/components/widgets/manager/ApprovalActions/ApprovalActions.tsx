// ============================================================================
// APPROVAL ACTIONS WIDGET - Approve/reject variance with dual approval support
// ============================================================================

'use client';

import { useState } from 'react';
import { Variance, ManagerService } from '@/lib/services/managerService';

interface ApprovalActionsProps {
  variance: Variance | null;
  managerId: string;
  managerRole: 'IC_Manager' | 'Warehouse_Manager';
  onApproved: () => void;
  onRejected: () => void;
  className?: string;
}

export function ApprovalActions({ 
  variance, 
  managerId,
  managerRole,
  onApproved,
  onRejected,
  className = '' 
}: ApprovalActionsProps) {
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [notes, setNotes] = useState('');
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async () => {
    if (!variance) return;

    try {
      setApproving(true);
      await ManagerService.approveVariance(variance.id, managerId, managerRole, notes);
      onApproved();
      setNotes('');
    } catch (error: any) {
      alert(`Failed to approve: ${error.message}`);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!variance || !rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setRejecting(true);
      await ManagerService.rejectVariance(variance.id, managerId, managerRole, rejectReason);
      onRejected();
      setRejectReason('');
      setShowRejectReason(false);
    } catch (error: any) {
      alert(`Failed to reject: ${error.message}`);
    } finally {
      setRejecting(false);
    }
  };

  if (!variance) return null;

  const needsDualApproval = variance.is_high_impact;
  
  // IC Manager can always approve (first approval for high-impact, independent for others)
  // Warehouse Manager can approve if IC Manager already approved (for high-impact) or independently (for others)
  const canApprove = managerRole === 'IC_Manager' || 
                     (managerRole === 'Warehouse_Manager' && (!needsDualApproval || variance.ic_manager_approval === 'approved'));

  const isFirstApproval = managerRole === 'IC_Manager' && needsDualApproval;
  const isFinalApproval = managerRole === 'Warehouse_Manager' && needsDualApproval && variance.ic_manager_approval === 'approved';

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Actions</h3>

      {needsDualApproval && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            {isFirstApproval && '⚠️ High-impact item: Your approval is required first (IC Manager). Warehouse Manager will provide final approval.'}
            {isFinalApproval && '⚠️ High-impact item: IC Manager has approved. Your approval is the final approval (Warehouse Manager).'}
            {!isFirstApproval && !isFinalApproval && '⚠️ High-impact item requires dual approval (IC Manager + Warehouse Manager)'}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="Add any comments about this approval..."
          />
        </div>

        <div className="flex gap-3">
          {canApprove && (
            <button
              onClick={handleApprove}
              disabled={approving}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                approving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {approving ? 'Approving...' : 'Approve Adjustment'}
            </button>
          )}

          {!showRejectReason ? (
            <button
              onClick={() => setShowRejectReason(true)}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              Reject
            </button>
          ) : (
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleReject}
                  disabled={rejecting || !rejectReason.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    rejecting || !rejectReason.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {rejecting ? 'Rejecting...' : 'Confirm Reject'}
                </button>
                <button
                  onClick={() => {
                    setShowRejectReason(false);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {isFirstApproval && (
          <p className="text-xs text-gray-500">
            This is the first approval for a high-impact item. After your approval, Warehouse Manager will provide final approval.
          </p>
        )}
        {isFinalApproval && (
          <p className="text-xs text-gray-500">
            This is the final approval for a high-impact item. IC Manager has already approved. Your approval completes the dual approval process.
          </p>
        )}
      </div>
    </div>
  );
}
