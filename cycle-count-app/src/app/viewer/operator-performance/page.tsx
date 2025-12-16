// ============================================================================
// OPERATOR PERFORMANCE REPORT - Read-only report
// ============================================================================

'use client';

import { useState } from 'react';
import { MetricCard, ChartCard } from '@/components/widgets/manager';

export default function OperatorPerformancePage() {
  const [dateRange, setDateRange] = useState('30d');

  const metrics = [
    { title: 'Avg Counts/Day', value: '23.4', change: '+5.2%', color: 'green' },
    { title: 'Top Performer', value: '31.2', change: '+2.1%', color: 'blue' },
    { title: 'Accuracy Rate', value: '95.8%', change: '+0.5%', color: 'green' },
    { title: 'On-Time Rate', value: '88.0%', change: '+1.2%', color: 'purple' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operator Performance</h1>
          <p className="text-gray-600 mt-1">Productivity metrics and accuracy rates by shift</p>
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

      <ChartCard title="Productivity Trend">
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart visualization would appear here
        </div>
      </ChartCard>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Operator Rankings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Counts/Day</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">On-Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { name: 'John Doe', counts: 31.2, accuracy: 98.5, onTime: 95.0 },
                { name: 'Jane Smith', counts: 28.5, accuracy: 97.2, onTime: 92.5 },
                { name: 'Bob Johnson', counts: 25.8, accuracy: 96.8, onTime: 90.0 }
              ].map((op, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm text-gray-900">#{idx + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{op.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{op.counts}</td>
                  <td className="px-4 py-3 text-sm text-green-600">{op.accuracy}%</td>
                  <td className="px-4 py-3 text-sm text-blue-600">{op.onTime}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
