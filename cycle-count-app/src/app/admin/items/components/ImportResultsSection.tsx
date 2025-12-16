// ============================================================================
// IMPORT RESULTS SECTION
// ============================================================================

'use client';

import { ImportResult, ItemRow } from '@/lib/utils/masterDataImport';

interface ImportResultsSectionProps {
  result: ImportResult<ItemRow>;
  onStartOver: () => void;
  onConfirmImport: () => void;
  isImporting: boolean;
  dataType: string;
}

export default function ImportResultsSection({ 
  result, 
  onStartOver, 
  onConfirmImport, 
  isImporting, 
  dataType 
}: ImportResultsSectionProps) {
  const hasErrors = result.errors.length > 0;
  const hasWarnings = result.warnings.length > 0;

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Import Results</h3>
          <button
            onClick={onStartOver}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Start Over
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{result.summary.totalRows}</div>
            <div className="text-sm text-gray-500">Total Rows</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{result.summary.validRows}</div>
            <div className="text-sm text-gray-500">Valid Rows</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{result.summary.errorRows}</div>
            <div className="text-sm text-gray-500">Error Rows</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{result.summary.warningRows}</div>
            <div className="text-sm text-gray-500">Warnings</div>
          </div>
        </div>

        {result.summary.validRows > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800 font-medium">
                {result.summary.validRows} {dataType.toLowerCase()}{result.summary.validRows !== 1 ? 's' : ''} ready for import
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Errors Section */}
      {hasErrors && (
        <div className="bg-white border border-red-200 rounded-lg">
          <div className="px-6 py-4 border-b border-red-200 bg-red-50">
            <h4 className="text-lg font-semibold text-red-900">Data Quality Issues</h4>
            <p className="text-sm text-red-700 mt-1">The following issues must be resolved before import:</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <ul className="divide-y divide-red-100">
              {result.errors.map((error, index) => (
                <li key={index} className="px-6 py-3 text-sm text-red-800">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {error}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Warnings Section */}
      {hasWarnings && (
        <div className="bg-white border border-yellow-200 rounded-lg">
          <div className="px-6 py-4 border-b border-yellow-200 bg-yellow-50">
            <h4 className="text-lg font-semibold text-yellow-900">Warnings</h4>
            <p className="text-sm text-yellow-700 mt-1">Review these warnings (import can proceed):</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <ul className="divide-y divide-yellow-100">
              {result.warnings.map((warning, index) => (
                <li key={index} className="px-6 py-3 text-sm text-yellow-800">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    {warning}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Final Import Button */}
      {!hasErrors && result.summary.validRows > 0 && (
        <div className="flex justify-center">
          <button 
            onClick={onConfirmImport}
            disabled={isImporting}
            className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm Import ({result.summary.validRows} {dataType.toLowerCase()}{result.summary.validRows !== 1 ? 's' : ''})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

