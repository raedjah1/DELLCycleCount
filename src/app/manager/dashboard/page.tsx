// ============================================================================
// MANAGER DASHBOARD - Overview of cycle count operations and pending actions
// ============================================================================

'use client';

import { useRouter } from 'next/navigation';
import { PendingActionsCard } from '@/components/widgets/manager/PendingActionsCard';
import { TodayMetrics } from '@/components/widgets/manager/TodayMetrics';

export default function ManagerDashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of cycle count operations and pending actions</p>
        </div>

        <div className="space-y-6">
          {/* Pending Actions */}
          <PendingActionsCard
            pendingApprovals={8}
            varianceReviewCount={15}
            onViewApprovals={() => router.push('/manager/approvals')}
            onViewVariances={() => router.push('/manager/variance-review')}
          />

          {/* Today's Metrics */}
          <TodayMetrics
            totalCounts={245}
            completed={180}
            inProgress={65}
            varianceRate={12}
            recountRate={8}
          />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/manager/variance-review')}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Review Variances</h3>
              </div>
              <p className="text-sm text-gray-600 mt-2">Review count discrepancies</p>
            </button>

            <button
              onClick={() => router.push('/manager/approvals')}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Approval Queue</h3>
              </div>
              <p className="text-sm text-gray-600 mt-2">Approve adjustments</p>
            </button>

            <button
              onClick={() => router.push('/manager/reports')}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">View Reports</h3>
              </div>
              <p className="text-sm text-gray-600 mt-2">Analytics and metrics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}