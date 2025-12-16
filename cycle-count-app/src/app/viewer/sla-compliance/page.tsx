// ============================================================================
// SLA COMPLIANCE REPORT - Read-only report
// ============================================================================

'use client';

import { useState } from 'react';
import { MetricCard, ChartCard } from '@/components/widgets/manager';

export default function SLACompliancePage() {
  const [dateRange, setDateRange] = useState('30d');

  const metrics = [
    { title: 'Overall Compliance', value: '92.5%', change: 2.3, color: 'green' },
    { title: 'Raw Goods', value: '94.2%', change: 1.1, color: 'green' },
    { title: 'Production', value: '89.1%', change: -0.5, color: 'orange' },
    { title: 'Finished Goods', value: '95.8%', change: 3.2, color: 'green' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SLA Compliance Report</h1>
          <p className="text-gray-600 mt-1">Service level agreement compliance by warehouse and zone</p>
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

      <ChartCard title="Compliance Trend">
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart visualization would appear here
        </div>
      </ChartCard>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance by Zone</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {['Zone A', 'Zone B', 'Zone C', 'Zone D'].map((zone) => (
                <tr key={zone}>
                  <td className="px-4 py-3 text-sm text-gray-900">{zone}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">92.5%</td>
                  <td className="px-4 py-3 text-sm text-gray-600">95%</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                      Below Target
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
