// ============================================================================
// RISK LOCATION ANALYSIS - Read-only report
// ============================================================================

'use client';

import { useState } from 'react';
import { MetricCard, ChartCard } from '@/components/widgets/manager';

export default function RiskAnalysisPage() {
  const [dateRange, setDateRange] = useState('30d');

  const metrics = [
    { title: 'Risk Locations', value: '23', change: '-2', color: 'yellow' },
    { title: 'Compliance Rate', value: '87.2%', change: '+3.1%', color: 'green' },
    { title: 'Variance Rate', value: '2.3x', change: '-0.2x', color: 'red' },
    { title: 'Avg Resolution', value: '4.2h', change: '-0.5h', color: 'purple' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risk Location Analysis</h1>
          <p className="text-gray-600 mt-1">Performance trends for flagged risk locations</p>
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

      <ChartCard title="Risk Location Trend">
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart visualization would appear here
        </div>
      </ChartCard>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Locations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variance Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { location: 'A-01-01-01', risk: 'High', variance: '3.2x', compliance: 75.5 },
                { location: 'B-02-03-04', risk: 'Medium', variance: '2.1x', compliance: 82.3 },
                { location: 'C-05-06-07', risk: 'High', variance: '2.8x', compliance: 78.9 }
              ].map((loc) => (
                <tr key={loc.location}>
                  <td className="px-4 py-3 text-sm text-gray-900">{loc.location}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      loc.risk === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {loc.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600">{loc.variance}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{loc.compliance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
