// ============================================================================
// COUNT PLANS PAGE - View and manage count plans
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { CountPlanService, CountPlan, ReviewCycle } from '@/lib/services/countPlanService';
import { CountPlanCard } from '@/components/widgets/manager/CountPlanCard/CountPlanCard';
import { ReviewCycleSelector } from '@/components/widgets/manager/ReviewCycleSelector/ReviewCycleSelector';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';
import { EmptyState } from '@/components/widgets/operator/EmptyState/EmptyState';

export default function CountPlansPage() {
  const [plans, setPlans] = useState<(CountPlan & { status?: string })[]>([]);
  const [cycles, setCycles] = useState<ReviewCycle[]>([]);
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCycleId, filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansData, cyclesData] = await Promise.all([
        CountPlanService.getCountPlans(selectedCycleId || undefined, filter),
        CountPlanService.getReviewCycles()
      ]);
      setPlans(plansData);
      setCycles(cyclesData);
    } catch (error) {
      console.error('Failed to load count plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewCycle = () => {
    const today = new Date().toISOString().split('T')[0];
    const cycleDate = prompt('Enter cycle date (YYYY-MM-DD):', today);
    if (cycleDate) {
      CountPlanService.createReviewCycle(cycleDate)
        .then(() => loadData())
        .catch(err => alert(`Failed to create cycle: ${err.message}`));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner message="Loading count plans..." className="min-h-screen" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Count Plans</h1>
          <p className="text-gray-600">Manage and review cycle count plans</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <ReviewCycleSelector
              cycles={cycles}
              selectedCycleId={selectedCycleId}
              onCycleChange={setSelectedCycleId}
              onCreateNew={handleCreateNewCycle}
            />
            <div className="flex gap-2">
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
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  filter === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <CountPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Count Plans"
            description="No count plans found for the selected filters."
            className="bg-white rounded-xl border border-gray-200"
          />
        )}
      </div>
    </div>
  );
}
