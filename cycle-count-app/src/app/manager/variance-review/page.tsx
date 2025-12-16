// ============================================================================
// VARIANCE REVIEW PAGE - Dedicated variance review with modular widgets
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { ManagerService, Variance } from '@/lib/services/managerService';
import { VarianceGrid } from '@/components/widgets/manager/VarianceGrid/VarianceGrid';
import { TransactionReconciliation } from '@/components/widgets/manager/TransactionReconciliation/TransactionReconciliation';
import { ApprovalActions } from '@/components/widgets/manager/ApprovalActions/ApprovalActions';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';

export default function VarianceReviewPage() {
  const { user } = useCurrentUser();
  const [variances, setVariances] = useState<Variance[]>([]);
  const [selectedVariance, setSelectedVariance] = useState<Variance | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'high_impact' | 'finished_goods'>('pending');

  const managerRole = user?.role === 'Warehouse_Manager' ? 'Warehouse_Manager' : 'IC_Manager';

  useEffect(() => {
    loadVariances();
  }, [filter]);

  const loadVariances = async () => {
    try {
      setLoading(true);
      const data = await ManagerService.getVariances(filter);
      setVariances(data);
    } catch (error) {
      console.error('Failed to load variances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVarianceApproved = () => {
    loadVariances();
    setSelectedVariance(null);
  };

  const handleVarianceRejected = () => {
    loadVariances();
    setSelectedVariance(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner message="Loading variances..." className="min-h-screen" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Variance Review</h1>
          <p className="text-gray-600">Review count discrepancies and transaction reconciliation</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-2">
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
              onClick={() => setFilter('finished_goods')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'finished_goods'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Finished Goods
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Variance Grid */}
          <div className="lg:col-span-2">
            <VarianceGrid
              variances={variances}
              selectedVarianceId={selectedVariance?.id}
              onSelectVariance={setSelectedVariance}
            />
          </div>

          {/* Sidebar */}
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
      </div>
    </div>
  );
}