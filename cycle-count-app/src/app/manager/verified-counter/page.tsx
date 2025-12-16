// ============================================================================
// VERIFIED COUNTER PAGE - Manage Verified Counter certifications
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { ManagerService, VerifiedCounterRequest } from '@/lib/services/managerService';
import { VerifiedCounterCard } from '@/components/widgets/manager/VerifiedCounterCard/VerifiedCounterCard';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';
import { EmptyState } from '@/components/widgets/operator/EmptyState/EmptyState';

export default function VerifiedCounterPage() {
  const { user } = useCurrentUser();
  const [requests, setRequests] = useState<VerifiedCounterRequest[]>([]);
  // Determine manager role first
  const managerRole = user?.role === 'Warehouse_Manager' ? 'Warehouse_Manager' : 'IC_Manager';
  
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'needs_warehouse_manager' | 'needs_ic_manager'>(
    managerRole === 'Warehouse_Manager' ? 'needs_warehouse_manager' : 'needs_ic_manager'
  );

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await ManagerService.getVerifiedCounterRequests(filter);
      setRequests(data);
    } catch (error) {
      console.error('Failed to load verified counter requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproved = async (requestId: string) => {
    try {
      await ManagerService.approveVerifiedCounter(requestId, user?.id || '', managerRole);
      loadRequests();
    } catch (error: any) {
      alert(`Failed to approve: ${error.message}`);
    }
  };

  const handleRejected = async (requestId: string) => {
    try {
      // Implement reject logic
      alert('Reject functionality to be implemented');
      loadRequests();
    } catch (error: any) {
      alert(`Failed to reject: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner message="Loading verified counter requests..." className="min-h-screen" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Verified Counter Management</h1>
          <p className="text-gray-600">Grant or revoke Verified Counter certification (requires dual approval)</p>
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

        {/* Pending Requests */}
        {requests.filter(r => r.status === 'pending' || r.status === 'partially_approved').length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Certification Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests
                .filter(r => r.status === 'pending' || r.status === 'partially_approved')
                .map((request) => (
                  <VerifiedCounterCard
                    key={request.id}
                    request={request}
                    managerRole={managerRole}
                    onApprove={handleApproved}
                    onReject={handleRejected}
                  />
                ))}
            </div>
          </div>
        )}

        {/* All Requests */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Requests ({requests.length})</h2>
          {requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((request) => (
                <VerifiedCounterCard
                  key={request.id}
                  request={request}
                  managerRole={managerRole}
                  onApprove={handleApproved}
                  onReject={handleRejected}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Verified Counter Requests"
              description="No verified counter certification requests found."
              className="bg-white rounded-xl border border-gray-200"
            />
          )}
        </div>
      </div>
    </div>
  );
}