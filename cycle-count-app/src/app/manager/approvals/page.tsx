// ============================================================================
// APPROVALS PAGE - Dedicated approval queue with modular widgets
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { ManagerService, ApprovalRequest } from '@/lib/services/managerService';
import { ApprovalQueueCard } from '@/components/widgets/manager/ApprovalQueueCard/ApprovalQueueCard';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';
import { EmptyState } from '@/components/widgets/operator/EmptyState/EmptyState';

export default function ApprovalsPage() {
  const { user } = useCurrentUser();
  
  // Determine manager role first
  const managerRole = user?.role === 'Warehouse_Manager' ? 'Warehouse_Manager' : 'IC_Manager';
  
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'high_impact' | 'needs_warehouse_manager' | 'needs_ic_manager'>(
    managerRole === 'Warehouse_Manager' ? 'needs_warehouse_manager' : 'needs_ic_manager'
  );

  useEffect(() => {
    loadApprovals();
  }, [filter]);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      const data = await ManagerService.getApprovalRequests(filter);
      setApprovalRequests(data);
    } catch (error) {
      console.error('Failed to load approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproved = async (requestId: string) => {
    try {
      const request = approvalRequests.find(r => r.id === requestId);
      if (request) {
        await ManagerService.approveVariance(request.journal_line_id, user?.id || '', managerRole);
        loadApprovals();
      }
    } catch (error: any) {
      alert(`Failed to approve: ${error.message}`);
    }
  };

  const handleRejected = async (requestId: string) => {
    try {
      const request = approvalRequests.find(r => r.id === requestId);
      if (request) {
        await ManagerService.rejectVariance(request.journal_line_id, user?.id || '', managerRole, 'Rejected by manager');
        loadApprovals();
      }
    } catch (error: any) {
      alert(`Failed to reject: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner message="Loading approvals..." className="min-h-screen" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Approval Queue</h1>
          <p className="text-gray-600">Review and approve adjustment requests</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter(managerRole === 'Warehouse_Manager' ? 'needs_warehouse_manager' : 'needs_ic_manager')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                (filter === 'needs_warehouse_manager' || filter === 'needs_ic_manager')
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Needs My Approval
            </button>
            <button
              onClick={() => setFilter('high_impact')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'high_impact'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              High Impact
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Approval Requests Grid */}
        {approvalRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvalRequests.map((request) => (
              <ApprovalQueueCard
                key={request.id}
                request={request}
                onApprove={handleApproved}
                onReject={handleRejected}
                onViewDetails={(req) => {
                  // Could open modal or navigate to detail page
                  console.log('View details:', req);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Approval Requests"
            description="No approval requests found for the selected filters."
            className="bg-white rounded-xl border border-gray-200"
          />
        )}
      </div>
    </div>
  );
}