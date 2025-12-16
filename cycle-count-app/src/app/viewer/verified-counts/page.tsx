// ============================================================================
// VERIFIED COUNT OUTCOMES - Read-only report
// ============================================================================

'use client';

import { useState } from 'react';
import { MetricCard, ChartCard } from '@/components/widgets/manager';

export default function VerifiedCountsPage() {
  const [dateRange, setDateRange] = useState('30d');

  const metrics = [
    { title: 'Total Count 3 Reviews', value: '47', change: 5, color: 'blue' },
    { title: 'Resolved Cases', value: '42', change: 3, color: 'green' },
    { title: 'Pending Review', value: '5', change: -2, color: 'orange' },
    { title: 'Resolution Rate', value: '89.4%', change: 2.1, color: 'green' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verified Count Outcomes</h1>
          <p className="text-gray-600 mt-1">Count 3 review results and resolution tracking</p>
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

      <ChartCard title="Resolution Trend">
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart visualization would appear here
        </div>
      </ChartCard>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Verified Counts</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { location: 'A-01-01-01', part: 'PN-12345', status: 'Resolved', resolved: '2024-01-15' },
                { location: 'B-02-03-04', part: 'PN-67890', status: 'Pending', resolved: '-' },
                { location: 'C-05-06-07', part: 'PN-11111', status: 'Resolved', resolved: '2024-01-14' }
              ].map((item, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.part}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      item.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.resolved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
