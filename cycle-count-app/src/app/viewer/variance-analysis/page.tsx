// ============================================================================
// VARIANCE ANALYSIS REPORT - Read-only report
// ============================================================================

'use client';

import { useState } from 'react';
import { MetricCard, ChartCard } from '@/components/widgets/manager';

export default function VarianceAnalysisPage() {
  const [dateRange, setDateRange] = useState('30d');

  const metrics = [
    { title: 'Total Variances', value: '1,234', change: -5.2, color: 'blue' },
    { title: 'Explained by TXN', value: '73.2%', change: 2.1, color: 'green' },
    { title: 'Unexplained', value: '26.8%', change: -2.1, color: 'orange' },
    { title: 'Avg Resolution Time', value: '2.4h', change: -0.3, color: 'purple' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Variance Analysis</h1>
          <p className="text-gray-600 mt-1">Count discrepancies and transaction reconciliation</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            Export PDF
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
            Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            color={metric.color as any}
          />
        ))}
      </div>

      <ChartCard title="Variance Trend">
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart visualization would appear here
        </div>
      </ChartCard>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Variance Locations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variances</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Explained</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unexplained</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {['A-01-01-01', 'B-02-03-04', 'C-05-06-07'].map((location) => (
                <tr key={location}>
                  <td className="px-4 py-3 text-sm text-gray-900">{location}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">12</td>
                  <td className="px-4 py-3 text-sm text-green-600">9 (75%)</td>
                  <td className="px-4 py-3 text-sm text-red-600">3 (25%)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
