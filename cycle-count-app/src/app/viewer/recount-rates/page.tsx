// ============================================================================
// RECOUNT RATES - Read-only report
// ============================================================================

'use client';

import { useState } from 'react';
import { MetricCard, ChartCard } from '@/components/widgets/manager';

export default function RecountRatesPage() {
  const [dateRange, setDateRange] = useState('30d');

  const metrics = [
    { title: 'Recount Rate', value: '12.1%', change: 0.8, color: 'yellow' },
    { title: 'Total Recounts', value: '156', change: 12, color: 'blue' },
    { title: 'Avg Recount Time', value: '1.2h', change: -0.1, color: 'green' },
    { title: 'Resolution Rate', value: '94.2%', change: 1.5, color: 'green' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recount Rate Analysis</h1>
          <p className="text-gray-600 mt-1">Recount frequency and resolution metrics</p>
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

      <ChartCard title="Recount Rate Trend">
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart visualization would appear here
        </div>
      </ChartCard>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recounts by Reason</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { reason: 'Variance Discrepancy', count: 89, pct: 57.1, resolution: '1.5h' },
                { reason: 'Photo Required', count: 45, pct: 28.8, resolution: '0.8h' },
                { reason: 'Serial Mismatch', count: 22, pct: 14.1, resolution: '2.1h' }
              ].map((item) => (
                <tr key={item.reason}>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.reason}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.count}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.pct}%</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.resolution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
