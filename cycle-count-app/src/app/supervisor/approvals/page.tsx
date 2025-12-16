// ============================================================================
// SUPERVISOR APPROVALS - Limited approvals (non-high-impact only)
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SupervisorService, LimitedApproval } from '@/lib/services/supervisorService';
import { LimitedApprovalCard } from '@/components/widgets/supervisor';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';

export default function SupervisorApprovalsPage() {
  const router = useRouter();
  const [approvals, setApprovals] = useState<LimitedApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  useEffect(() => {
    loadApprovals();
  }, [filter]);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      const data = await SupervisorService.getLimitedApprovals(filter);
      setApprovals(data);
    } catch (error) {
      console.error('Failed to load approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this variance adjustment?')) return;

    try {
      await SupervisorService.approveLimitedVariance(id, '', 'Approved by Supervisor');
      loadApprovals();
    } catch (error: any) {
      alert(`Failed to approve: ${error.message}`);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await SupervisorService.rejectLimitedVariance(id, '', reason);
      loadApprovals();
    } catch (error: any) {
      alert(`Failed to reject: ${error.message}`);
    }
  };

  const handleViewDetails = (approval: LimitedApproval) => {
    router.push(`/supervisor/approvals/${approval.id}`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading approvals..." className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Limited Approvals</h1>
          <p className="text-gray-600 mt-1">Approve non-high-impact variances only</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Pending ({approvals.filter(a => a.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Approved ({approvals.filter(a => a.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All ({approvals.length})
            </button>
          </div>
        </div>

        {/* Approvals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvals.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No approvals found</p>
            </div>
          ) : (
            approvals.map((approval) => (
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
    </div>
  );
}
