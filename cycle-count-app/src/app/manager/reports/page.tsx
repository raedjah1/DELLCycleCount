// ============================================================================
// REPORTS PAGE - Generate and view reports
// ============================================================================

'use client';

import { useState } from 'react';
import { MetricCard } from '@/components/widgets/manager/MetricCard/MetricCard';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reportTypes = [
    {
      id: 'variance-summary',
      title: 'Variance Summary Report',
      description: 'Complete summary of all variances with reconciliation status',
      icon: '📊'
    },
    {
      id: 'approval-status',
      title: 'Approval Status Report',
      description: 'Status of all approval requests and pending items',
      icon: '✅'
    },
    {
      id: 'operator-performance',
      title: 'Operator Performance Report',
      description: 'Individual operator performance metrics and statistics',
      icon: '👥'
    },
    {
      id: 'high-impact-items',
      title: 'High-Impact Items Report',
      description: 'Report on high-value items with variances',
      icon: '🔴'
    },
    {
      id: 'transaction-reconciliation',
      title: 'Transaction Reconciliation Report',
      description: 'Variances explained by transactions vs unexplained',
      icon: '🔄'
    },
    {
      id: 'verified-counter',
      title: 'Verified Counter Report',
      description: 'Status of verified counter certifications',
      icon: '⭐'
    }
  ];

  const handleExport = (reportId: string, format: 'excel' | 'pdf' | 'csv') => {
    alert(`Exporting ${reportId} as ${format.toUpperCase()}...`);
    // Implement export logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Generate and export reports</p>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className={`bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all ${
                selectedReport === report.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{report.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Export Options */}
        {selectedReport && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Export {reportTypes.find(r => r.id === selectedReport)?.title}
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleExport(selectedReport, 'excel')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Export Excel
              </button>
              <button
                onClick={() => handleExport(selectedReport, 'pdf')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Export PDF
              </button>
              <button
                onClick={() => handleExport(selectedReport, 'csv')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Export CSV
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
