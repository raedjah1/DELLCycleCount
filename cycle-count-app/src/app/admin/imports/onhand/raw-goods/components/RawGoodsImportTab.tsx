// ============================================================================
// RAW GOODS IMPORT TAB
// ============================================================================

'use client';

import { RawGoodsImportResult } from '@/lib/utils/excelImport';
import ImportResultsSection from './ImportResultsSection';

interface RawGoodsImportTabProps {
  file: File | null;
  isUploading: boolean;
  importResult: RawGoodsImportResult | null;
  error: string | null;
  successMessage: string | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
  onReset: () => void;
  onConfirmImport: () => void;
}

export default function RawGoodsImportTab({
  file,
  isUploading,
  importResult,
  error,
  successMessage,
  onFileSelect,
  onImport,
  onReset,
  onConfirmImport
}: RawGoodsImportTabProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Import Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-r-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-base sm:text-lg font-medium text-blue-900">Raw Goods Import Requirements</h3>
            <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-blue-800">
              <p className="mb-2">Your Excel file must contain the following columns (exact spelling required):</p>
              <div className="bg-blue-100 p-2 sm:p-3 rounded font-mono text-xs overflow-x-auto mb-2">
                PartNo | AvailableQty | Bin | PalletBoxNo | Warehouse
              </div>
              <p className="mb-2"><strong>Important Notes:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Only these 5 columns will be saved to the database</li>
                <li>All other columns will be ignored</li>
                <li>Bin will be stored as-is from the Excel file</li>
                <li>PalletBoxNo is optional</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Upload Raw Goods File</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
          {!file ? (
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Upload Excel File</p>
              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Select .xls, .xlsx, or .csv file (max 20MB)</p>
              <label className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-sm sm:text-base transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Choose File
                <input 
                  type="file" 
                  accept=".xls,.xlsx,.csv" 
                  onChange={onFileSelect}
                  className="hidden" 
                />
              </label>
            </div>
          ) : (
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-base sm:text-lg font-medium text-gray-900 mb-1">{file.name}</p>
              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{(file.size / 1024).toFixed(1)} KB</p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <button 
                  onClick={onImport}
                  disabled={isUploading}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center text-sm sm:text-base transition-colors"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Parse File
                    </>
                  )}
                </button>
                <button 
                  onClick={onReset}
                  className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-3 sm:p-4 rounded">
          <div className="flex">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Import Successful</h3>
              <p className="mt-1 text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 sm:p-4 rounded">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Import Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Import Results */}
      {importResult && (
        <ImportResultsSection 
          result={importResult}
          onConfirmImport={onConfirmImport}
          isImporting={isUploading}
        />
      )}
    </div>
  );
}

