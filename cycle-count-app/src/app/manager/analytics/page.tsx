// ============================================================================
// ANALYTICS PAGE - Analytics and insights with modular widgets
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { MetricCard } from '@/components/widgets/manager/MetricCard/MetricCard';
import { ChartCard } from '@/components/widgets/manager/ChartCard/ChartCard';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Mock analytics data - replace with real data from service
  const metrics = {
    totalVariances: 245,
    varianceRate: 12.5,
    avgVariancePercent: 3.2,
    highImpactVariances: 18,
    finishedGoodsVariances: 42,
    transactionExplained: 156,
    unexplainedVariances: 89
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
              <p className="text-gray-600">Variance analysis and insights</p>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Variances"
            value={metrics.totalVariances}
            change={5.2}
            changeLabel="last period"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            color="blue"
          />
          <MetricCard
            title="Variance Rate"
            value={`${metrics.varianceRate}%`}
            change={-2.1}
            changeLabel="last period"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            color="green"
          />
          <MetricCard
            title="High Impact"
            value={metrics.highImpactVariances}
            change={12.5}
            changeLabel="last period"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
            color="red"
          />
          <MetricCard
            title="Explained by Transactions"
            value={metrics.transactionExplained}
            change={8.3}
            changeLabel="last period"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="green"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Variance Trend">
            <div className="text-center text-gray-500">
              <p className="text-sm">Variance trend chart will be displayed here</p>
              <p className="text-xs mt-2">Chart integration pending</p>
            </div>
          </ChartCard>
          <ChartCard title="Variance by Warehouse Type">
            <div className="text-center text-gray-500">
              <p className="text-sm">Warehouse type distribution chart</p>
              <p className="text-xs mt-2">Chart integration pending</p>
            </div>
          </ChartCard>
          <ChartCard title="Top Variance Locations">
            <div className="text-center text-gray-500">
              <p className="text-sm">Top locations with variances</p>
              <p className="text-xs mt-2">Chart integration pending</p>
            </div>
          </ChartCard>
          <ChartCard title="Approval Status">
            <div className="text-center text-gray-500">
              <p className="text-sm">Approval status breakdown</p>
              <p className="text-xs mt-2">Chart integration pending</p>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
