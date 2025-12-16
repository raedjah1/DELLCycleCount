// ============================================================================
// PERFORMANCE PAGE - Team and system performance metrics
// ============================================================================

'use client';

import { useState } from 'react';
import { MetricCard } from '@/components/widgets/manager/MetricCard/MetricCard';
import { ChartCard } from '@/components/widgets/manager/ChartCard/ChartCard';

export default function PerformancePage() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Mock performance data
  const performance = {
    avgCountTime: '4.2 min',
    totalCounts: 1847,
    completionRate: 94.5,
    accuracyRate: 97.8,
    operatorProductivity: 42,
    avgVariancePercent: 2.1
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Performance</h1>
              <p className="text-gray-600">Team and system performance metrics</p>
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

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <MetricCard
            title="Average Count Time"
            value={performance.avgCountTime}
            change={-5.2}
            changeLabel="last period"
            color="blue"
          />
          <MetricCard
            title="Total Counts"
            value={performance.totalCounts}
            change={12.3}
            changeLabel="last period"
            color="green"
          />
          <MetricCard
            title="Completion Rate"
            value={`${performance.completionRate}%`}
            change={2.1}
            changeLabel="last period"
            color="green"
          />
          <MetricCard
            title="Accuracy Rate"
            value={`${performance.accuracyRate}%`}
            change={0.5}
            changeLabel="last period"
            color="green"
          />
          <MetricCard
            title="Operator Productivity"
            value={`${performance.operatorProductivity} counts/day`}
            change={8.7}
            changeLabel="last period"
            color="blue"
          />
          <MetricCard
            title="Avg Variance %"
            value={`${performance.avgVariancePercent}%`}
            change={-1.2}
            changeLabel="last period"
            color="orange"
          />
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Count Time Trend">
            <div className="text-center text-gray-500">
              <p className="text-sm">Average count time over time</p>
              <p className="text-xs mt-2">Chart integration pending</p>
            </div>
          </ChartCard>
          <ChartCard title="Completion Rate">
            <div className="text-center text-gray-500">
              <p className="text-sm">Journal completion rates</p>
              <p className="text-xs mt-2">Chart integration pending</p>
            </div>
          </ChartCard>
          <ChartCard title="Operator Performance">
            <div className="text-center text-gray-500">
              <p className="text-sm">Top performing operators</p>
              <p className="text-xs mt-2">Chart integration pending</p>
            </div>
          </ChartCard>
          <ChartCard title="Variance Accuracy">
            <div className="text-center text-gray-500">
              <p className="text-sm">Variance accuracy trends</p>
              <p className="text-xs mt-2">Chart integration pending</p>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
