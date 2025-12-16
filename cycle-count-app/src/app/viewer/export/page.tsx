// ============================================================================
// EXPORT DATA - Export functionality for Viewer
// ============================================================================

'use client';

import { useState } from 'react';

export default function ExportPage() {
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | 'csv'>('excel');
  const [dateRange, setDateRange] = useState('30d');

  const exportOptions = [
    {
      title: 'Full Dashboard Export',
      description: 'Complete metrics summary with all reports',
      formats: ['excel', 'pdf', 'csv'],
      icon: '📊'
    },
    {
      title: 'SLA Compliance Report',
      description: 'Detailed compliance analysis by warehouse and zone',
      formats: ['excel', 'pdf'],
      icon: '📈'
    },
    {
      title: 'Variance Analysis Report',
      description: 'Count discrepancies and transaction reconciliation',
      formats: ['excel', 'pdf', 'csv'],
      icon: '📉'
    },
    {
      title: 'Operator Performance Report',
      description: 'Team and operator productivity metrics',
      formats: ['excel', 'pdf'],
      icon: '👥'
    },
    {
      title: 'Risk Location Analysis',
      description: 'Performance trends for flagged risk locations',
      formats: ['excel', 'pdf'],
      icon: '⚠️'
    },
    {
      title: 'Verified Count Outcomes',
      description: 'Count 3 review results and resolution tracking',
      formats: ['excel', 'pdf'],
      icon: '✅'
    }
  ];

  const handleExport = (report: typeof exportOptions[0]) => {
    alert(`Exporting ${report.title} as ${exportFormat.toUpperCase()}...`);
    // In production, this would trigger actual export
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
          <p className="text-gray-600 mt-1">Export reports and analytics in various formats</p>
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
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Format Selector */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Format</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setExportFormat('excel')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              exportFormat === 'excel'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Excel (.xlsx)
          </button>
          <button
            onClick={() => setExportFormat('pdf')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              exportFormat === 'pdf'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            PDF (.pdf)
          </button>
          <button
            onClick={() => setExportFormat('csv')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              exportFormat === 'csv'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            CSV (.csv)
          </button>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportOptions.map((option) => (
          <div
            key={option.title}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-3">{option.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{option.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {option.formats.map((format) => (
                <span
                  key={format}
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    format === 'excel' ? 'bg-green-100 text-green-800' :
                    format === 'pdf' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}
                >
                  {format.toUpperCase()}
                </span>
              ))}
            </div>
            {option.formats.includes(exportFormat) ? (
              <button
                onClick={() => handleExport(option)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Export as {exportFormat.toUpperCase()}
              </button>
            ) : (
              <button
                disabled
                className="w-full px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                Format not available
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
