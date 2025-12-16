// ============================================================================
// IMPORT RESULTS SECTION - Raw Goods
// ============================================================================

'use client';

import { useState } from 'react';
import { RawGoodsImportResult } from '@/lib/utils/excelImport';

interface ImportResultsSectionProps {
  result: RawGoodsImportResult;
  onConfirmImport: () => void;
  isImporting: boolean;
}

export default function ImportResultsSection({ 
  result, 
  onConfirmImport, 
  isImporting 
}: ImportResultsSectionProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'valid' | 'invalid'>('summary');

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Results Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Import Results</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-900">{result.summary.validRows} Valid</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-900">{result.summary.invalidRows} Invalid</span>
          </div>
        </div>
        {result.summary.validRows > 0 && (
          <div className="mt-4">
            <button
              onClick={onConfirmImport}
              disabled={isImporting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center text-sm sm:text-base transition-colors"
            >
              {isImporting ? (
                <>
                  <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Importing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm Import ({result.summary.validRows} records)
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex min-w-max">
          {[
            { id: 'summary', label: 'Summary', count: result.summary.totalRows },
            { id: 'valid', label: 'Valid Records', count: result.summary.validRows },
            { id: 'invalid', label: 'Invalid Records', count: result.summary.invalidRows }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-medium text-green-900 text-sm sm:text-base">Valid Records</h3>
              <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{result.summary.validRows}</p>
              <p className="text-xs sm:text-sm text-green-700 mt-1">Ready to import</p>
            </div>
            <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-medium text-red-900 text-sm sm:text-base">Invalid Records</h3>
              <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">{result.summary.invalidRows}</p>
              <p className="text-xs sm:text-sm text-red-700 mt-1">Need correction</p>
            </div>
          </div>
        )}
        {activeTab === 'valid' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part No</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Qty</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bin</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pallet Box No</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.validRows.slice(0, 100).map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {record.PartNo}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {record.AvailableQty}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {record.Bin}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {record.Warehouse}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {record.PalletBoxNo || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.validRows.length > 100 && (
              <p className="text-center text-gray-500 py-3 sm:py-4 text-xs sm:text-sm">
                Showing first 100 records of {result.validRows.length} total
              </p>
            )}
          </div>
        )}
        {activeTab === 'invalid' && (
          <div className="space-y-3 sm:space-y-4">
            {result.invalidRows.map((record, index) => (
              <div key={index} className="border border-red-200 rounded-lg p-3 sm:p-4 bg-red-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-red-900 text-sm sm:text-base">Row {record.rowNumber}</h4>
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                    {record.errors.length} error{record.errors.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="mb-2 sm:mb-3">
                  <strong className="text-xs sm:text-sm">Errors:</strong>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-red-700 mt-1">
                    {record.errors.map((error: string, errorIndex: number) => (
                      <li key={errorIndex}>{error}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 break-all">
                  <strong>Raw data:</strong> {JSON.stringify(record.row)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

