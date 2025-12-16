// ============================================================================
// LOCATION IMPORT TAB
// ============================================================================

'use client';

import { ImportResult, LocationRow } from '@/lib/utils/masterDataImport';
import ImportResultsSection from './ImportResultsSection';

interface LocationImportTabProps {
  file: File | null;
  isUploading: boolean;
  importResult: ImportResult<LocationRow> | null;
  error: string | null;
  successMessage: string | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
  onReset: () => void;
  onConfirmImport: () => void;
}

export default function LocationImportTab({
  file,
  isUploading,
  importResult,
  error,
  successMessage,
  onFileSelect,
  onImport,
  onReset,
  onConfirmImport
}: LocationImportTabProps) {
  return (
    <div className="space-y-8">
      {/* Import Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-900">Location Import Requirements</h3>
            <div className="mt-3 text-sm text-blue-800">
              <p className="mb-2">Your Excel file must contain the following columns (exact spelling required):</p>
              <div className="grid grid-cols-2 gap-4">
                <ul className="list-disc list-inside space-y-1">
                  <li><code className="bg-blue-100 px-1 rounded">ProgramID</code> - Program ID (number)</li>
                  <li><code className="bg-blue-100 px-1 rounded">Warehouse</code> - Warehouse name (optional)</li>
                  <li><code className="bg-blue-100 px-1 rounded">LocationNo</code> - Location number (may start with dot)</li>
                  <li><code className="bg-blue-100 px-1 rounded">Building</code> - Building identifier</li>
                  <li><code className="bg-blue-100 px-1 rounded">Bay</code> - Bay identifier</li>
                  <li><code className="bg-blue-100 px-1 rounded">Row</code> - Row number</li>
                </ul>
                <ul className="list-disc list-inside space-y-1">
                  <li><code className="bg-blue-100 px-1 rounded">Tier</code> - Tier/level (e.g., 01A)</li>
                  <li><code className="bg-blue-100 px-1 rounded">Bin</code> - Full location code (e.g., ARB.AF.01.01B)</li>
                  <li><code className="bg-blue-100 px-1 rounded">LocationGroup</code> - Location group/zone</li>
                  <li><code className="bg-blue-100 px-1 rounded">Volume</code> - Volume (numeric, optional)</li>
                  <li><code className="bg-blue-100 px-1 rounded">Height/Width/Length</code> - Dimensions (optional)</li>
                  <li><code className="bg-blue-100 px-1 rounded">RiskLocation</code> - Yes/No for risk locations</li>
                </ul>
              </div>
              <p className="mt-3 font-medium">Optional: <code className="bg-blue-100 px-1 rounded">RiskReason</code> - Reason if risk location</p>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Location Excel File</h3>
            <p className="text-gray-600 mb-4">Select an Excel file (.xls or .xlsx) with location data</p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={onFileSelect}
                disabled={isUploading}
              />
              <span className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Choose File
              </span>
            </label>

            {file && (
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{file.name}</span>
                <button onClick={onReset} className="text-red-600 hover:text-red-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import Button */}
      {file && !importResult && (
        <div className="flex justify-center">
          <button
            onClick={onImport}
            disabled={isUploading}
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                  <path fill="currentColor" d="m15.84 10.2c.34-.7 1.19-.7 1.53 0l1.63 3.44c.18.38-.04.82-.46.82h-3.24c-.42 0-.64-.44-.46-.82l1.63-3.44z" className="opacity-75"></path>
                </svg>
                Processing Import...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import Locations
              </>
            )}
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Import Successful</h3>
              <p className="text-sm text-green-700 mt-1">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Import Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Import Results */}
      {importResult && (
        <ImportResultsSection
          result={importResult}
          onStartOver={onReset}
          onConfirmImport={onConfirmImport}
          isImporting={isUploading}
          dataType="Location"
        />
      )}
    </div>
  );
}

