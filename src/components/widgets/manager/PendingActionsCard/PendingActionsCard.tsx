// ============================================================================
// PENDING ACTIONS CARD - Widget showing pending approvals and variances
// ============================================================================

'use client';

interface PendingActionsCardProps {
  pendingApprovals: number;
  varianceReviewCount: number;
  onViewApprovals: () => void;
  onViewVariances: () => void;
}

export function PendingActionsCard({
  pendingApprovals,
  varianceReviewCount,
  onViewApprovals,
  onViewVariances
}: PendingActionsCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        onClick={onViewApprovals}
        className="p-6 bg-white rounded-xl shadow-sm border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all text-left"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Pending Approvals</h3>
          {pendingApprovals > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
              {pendingApprovals}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">
          Review and approve adjustment requests
        </p>
      </button>

      <button
        onClick={onViewVariances}
        className="p-6 bg-white rounded-xl shadow-sm border-2 border-orange-200 hover:border-orange-400 hover:shadow-md transition-all text-left"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Variance Review</h3>
          {varianceReviewCount > 0 && (
            <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-bold">
              {varianceReviewCount}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">
          Review count discrepancies and transactions
        </p>
      </button>
    </div>
  );
}
