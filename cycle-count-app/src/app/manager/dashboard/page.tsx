// ============================================================================
// MANAGER DASHBOARD - Composed with modular widgets
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { ManagerService, Variance, ApprovalRequest, VerifiedCounterRequest } from '@/lib/services/managerService';
import { VarianceGrid } from '@/components/widgets/manager/VarianceGrid/VarianceGrid';
import { TransactionReconciliation } from '@/components/widgets/manager/TransactionReconciliation/TransactionReconciliation';
import { ApprovalActions } from '@/components/widgets/manager/ApprovalActions/ApprovalActions';
import { ApprovalQueueCard } from '@/components/widgets/manager/ApprovalQueueCard/ApprovalQueueCard';
import { VerifiedCounterCard } from '@/components/widgets/manager/VerifiedCounterCard/VerifiedCounterCard';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';

export default function ManagerDashboardPage() {
  const { user } = useCurrentUser();
  const [variances, setVariances] = useState<Variance[]>([]);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  const [verifiedCounterRequests, setVerifiedCounterRequests] = useState<VerifiedCounterRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected variance for detail view
  const [selectedVariance, setSelectedVariance] = useState<Variance | null>(null);
  
  // Determine manager role first
  const managerRole = user?.role === 'Warehouse_Manager' ? 'Warehouse_Manager' : 'IC_Manager';
  
  // Filters
  const [varianceFilter, setVarianceFilter] = useState<'all' | 'pending' | 'high_impact' | 'finished_goods'>('pending');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'high_impact' | 'needs_warehouse_manager' | 'needs_ic_manager'>(
    managerRole === 'Warehouse_Manager' ? 'needs_warehouse_manager' : 'needs_ic_manager'
  );

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vars, approvals, vcRequests] = await Promise.all([
        ManagerService.getVariances(varianceFilter),
        ManagerService.getApprovalRequests(approvalFilter),
        ManagerService.getVerifiedCounterRequests(managerRole === 'Warehouse_Manager' ? 'needs_warehouse_manager' : 'needs_ic_manager')
      ]);
      
      setVariances(vars);
      setApprovalRequests(approvals);
      setVerifiedCounterRequests(vcRequests);
    } catch (error) {
      console.error('Failed to load manager dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [varianceFilter, approvalFilter]);

  const handleVarianceApproved = () => {
    loadData();
    setSelectedVariance(null);
  };

  const handleVarianceRejected = () => {
    loadData();
    setSelectedVariance(null);
  };

  const handleApprovalRequestApproved = async (requestId: string) => {
    try {
      const request = approvalRequests.find(r => r.id === requestId);
      if (request) {
        await ManagerService.approveVariance(request.journal_line_id, user?.id || '', managerRole);
        loadData();
      }
    } catch (error: any) {
      alert(`Failed to approve: ${error.message}`);
    }
  };

  const handleApprovalRequestRejected = async (requestId: string) => {
    try {
      const request = approvalRequests.find(r => r.id === requestId);
      if (request) {
        await ManagerService.rejectVariance(request.journal_line_id, user?.id || '', managerRole, 'Rejected by manager');
        loadData();
      }
    } catch (error: any) {
      alert(`Failed to reject: ${error.message}`);
    }
  };

  const handleVerifiedCounterApproved = async (requestId: string) => {
    try {
      await ManagerService.approveVerifiedCounter(requestId, user?.id || '', managerRole);
      loadData();
    } catch (error: any) {
      alert(`Failed to approve: ${error.message}`);
    }
  };

  const handleVerifiedCounterRejected = async (requestId: string) => {
    try {
      // Implement reject logic
      loadData();
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

  const pendingVariances = variances.filter(v => v.status === 'pending_review' || v.status === 'needs_approval').length;
  const pendingApprovals = approvalRequests.filter(a => a.status === 'pending' || a.status === 'partially_approved').length;
  const pendingVCRequests = verifiedCounterRequests.filter(vc => vc.status === 'pending' || vc.status === 'partially_approved').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {pendingVariances} variances • {pendingApprovals} approvals • {pendingVCRequests} VC requests
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Variance Review Section */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Variance Review ({variances.length})
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVarianceFilter('pending')}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      varianceFilter === 'pending'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setVarianceFilter('high_impact')}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      varianceFilter === 'high_impact'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    High Impact
                  </button>
                  <button
                    onClick={() => setVarianceFilter('finished_goods')}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      varianceFilter === 'finished_goods'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Finished Goods
                  </button>
                </div>
              </div>

              <VarianceGrid
                variances={variances}
                selectedVarianceId={selectedVariance?.id}
                onSelectVariance={setSelectedVariance}
              />
            </div>
          </div>

          {/* Sidebar - Transaction Reconciliation & Actions */}
          <div className="space-y-6">
            <TransactionReconciliation variance={selectedVariance} />
            {selectedVariance && (
              <ApprovalActions
                variance={selectedVariance}
                managerId={user?.id || ''}
                managerRole={managerRole}
                onApproved={handleVarianceApproved}
                onRejected={handleVarianceRejected}
              />
            )}
          </div>
        </div>

        {/* Approval Queue */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Approval Queue ({approvalRequests.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setApprovalFilter(managerRole === 'Warehouse_Manager' ? 'needs_warehouse_manager' : 'needs_ic_manager')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  (approvalFilter === 'needs_warehouse_manager' || approvalFilter === 'needs_ic_manager')
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Needs My Approval
              </button>
              <button
                onClick={() => setApprovalFilter('high_impact')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  approvalFilter === 'high_impact'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                High Impact
              </button>
              <button
                onClick={() => setApprovalFilter('pending')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  approvalFilter === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Pending
              </button>
            </div>
          </div>
          
          {approvalRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvalRequests.map((request) => (
                <ApprovalQueueCard
                  key={request.id}
                  request={request}
                  onApprove={handleApprovalRequestApproved}
                  onReject={handleApprovalRequestRejected}
                  onViewDetails={(req) => {
                    // Could open modal or navigate to detail page
                    console.log('View details:', req);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No approval requests</p>
            </div>
          )}
        </div>

        {/* Verified Counter Management */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Verified Counter Requests ({verifiedCounterRequests.length})
          </h2>
          
          {verifiedCounterRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verifiedCounterRequests.map((request) => (
                <VerifiedCounterCard
                  key={request.id}
                  request={request}
                  managerRole={managerRole}
                  onApprove={handleVerifiedCounterApproved}
                  onReject={handleVerifiedCounterRejected}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No pending verified counter requests</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}