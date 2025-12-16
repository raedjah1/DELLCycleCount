// ============================================================================
// WAREHOUSE SUPERVISOR DASHBOARD - Operational oversight
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SupervisorService, QueueStatus, LimitedApproval, TeamPerformance } from '@/lib/services/supervisorService';
import { QueueStatusCard, LimitedApprovalCard, TeamPerformanceCard } from '@/components/widgets/supervisor';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';

export default function SupervisorDashboardPage() {
  const router = useRouter();
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [limitedApprovals, setLimitedApprovals] = useState<LimitedApproval[]>([]);
  const [teamPerformance, setTeamPerformance] = useState<TeamPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [approvalFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [status, approvals, performance] = await Promise.all([
        SupervisorService.getQueueStatus(),
        SupervisorService.getLimitedApprovals(approvalFilter),
        SupervisorService.getTeamPerformance()
      ]);

      setQueueStatus(status);
      setLimitedApprovals(approvals);
      setTeamPerformance(performance);
    } catch (error) {
      console.error('Failed to load supervisor dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this variance adjustment?')) return;

    try {
      await SupervisorService.approveLimitedVariance(id, '', 'Approved by Supervisor');
      loadData();
    } catch (error: any) {
      alert(`Failed to approve: ${error.message}`);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await SupervisorService.rejectLimitedVariance(id, '', reason);
      loadData();
    } catch (error: any) {
      alert(`Failed to reject: ${error.message}`);
    }
  };

  const handleViewDetails = (approval: LimitedApproval) => {
    router.push(`/supervisor/approvals/${approval.id}`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading operational dashboard..." className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Operational Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor queues, handle approvals, and track team performance</p>
        </div>

        {/* Queue Status */}
        {queueStatus && <QueueStatusCard status={queueStatus} className="mb-6" />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Limited Approvals */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Limited Approvals</h2>
              <div className="flex gap-2">
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
                <button
                  onClick={() => setApprovalFilter('all')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    approvalFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {limitedApprovals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No approvals found</p>
              ) : (
                limitedApprovals.map((approval) => (
                  <LimitedApprovalCard
                    key={approval.id}
                    approval={approval}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </div>
          </div>

          {/* Team Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {teamPerformance.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No performance data</p>
              ) : (
                teamPerformance.map((perf) => (
                  <TeamPerformanceCard key={perf.operator_id} performance={perf} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/supervisor/queues')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Monitor Queues</h3>
            <p className="text-sm text-gray-600">View dispatch pool and active journals</p>
          </button>
          <button
            onClick={() => router.push('/supervisor/approvals')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Limited Approvals</h3>
            <p className="text-sm text-gray-600">Approve non-high-impact variances</p>
          </button>
          <button
            onClick={() => router.push('/supervisor/performance')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Team Performance</h3>
            <p className="text-sm text-gray-600">View detailed team metrics</p>
          </button>
        </div>
      </div>
    </div>
  );
}
