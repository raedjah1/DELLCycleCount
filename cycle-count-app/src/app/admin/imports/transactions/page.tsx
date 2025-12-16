// ============================================================================
// TRANSACTION IMPORT SCREEN - Excel Upload for Warehouse Transactions
// ============================================================================
// Admin screen for importing transaction history (Section 10.2)

'use client';

import { useState } from 'react';
import { parseTransactionExcel, validateExcelFile, TransactionImportResult } from '@/lib/utils/excelImport';

export default function TransactionImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<TransactionImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate file
    const validation = validateExcelFile(selectedFile);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setImportResult(null);
  };

  const handleImport = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await parseTransactionExcel(file);
      setImportResult(result);
      
      // TODO: Send valid rows to Supabase
      console.log('✅ Transaction Import Results:', result);
      
    } catch (err: any) {
      setError(err.message || 'Import failed');
    } finally {
      setIsUploading(false);
    }
  };

  const clearImport = () => {
    setFile(null);
    setImportResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Required Format */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded">
        <h3 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Required Excel Format</h3>
        <div className="text-xs sm:text-sm text-blue-700">
          <p className="mb-2"><strong>Required headers (exact):</strong></p>
          <div className="bg-blue-100 p-2 sm:p-3 rounded font-mono text-xs overflow-x-auto">
            TxnId | TxnTime | TxnType | PartNumber | Qty | FromLocation | ToLocation | RefDoc
          </div>
          <p className="mt-2"><strong>Example:</strong></p>
          <div className="bg-blue-100 p-2 sm:p-3 rounded font-mono text-xs mt-1 overflow-x-auto">
            TXN-001 | 2024-12-15 08:30:00 | Move | LAPTOP-001 | 5 | Reimage.ARB.AB.01.01A | Production.Main.CD.02.01B | WO-12345
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Transaction Import</h2>
          <p className="text-sm text-gray-600">Import warehouse transaction history from Excel</p>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
            {!file ? (
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Upload Transaction File</p>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Select .xls, .xlsx, or .csv file (max 10MB)</p>
                <label className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-sm sm:text-base transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Choose File
                  <input 
                    type="file" 
                    accept=".xls,.xlsx,.csv" 
                    onChange={handleFileSelect}
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
                    onClick={handleImport}
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Import Transactions
                      </>
                    )}
                  </button>
                  <button 
                    onClick={clearImport}
                    className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 sm:p-4 rounded">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
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
        <ImportResults result={importResult} />
      )}
      </div>
    </div>
  );
}

// ============================================================================
// IMPORT RESULTS COMPONENT
// ============================================================================

interface ImportResultsProps {
  result: TransactionImportResult;
}

function ImportResults({ result }: ImportResultsProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'valid' | 'invalid' | 'duplicates'>('summary');

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Results Header */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Transaction Import Results</h2>
        <div className="flex items-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">{result.summary.validRows} Valid</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">{result.summary.invalidRows} Invalid</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">{result.summary.duplicateCount} Duplicates</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex">
          {[
            { id: 'summary', label: 'Summary', count: result.summary.totalRows },
            { id: 'valid', label: 'Valid Records', count: result.summary.validRows },
            { id: 'invalid', label: 'Invalid Records', count: result.summary.invalidRows },
            { id: 'duplicates', label: 'Duplicates', count: result.summary.duplicateCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
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
      <div className="p-6">
        {activeTab === 'summary' && (
          <SummaryTab result={result} />
        )}
        {activeTab === 'valid' && (
          <ValidTransactionsTab records={result.validRows} />
        )}
        {activeTab === 'invalid' && (
          <InvalidRecordsTab records={result.invalidRows} />
        )}
        {activeTab === 'duplicates' && (
          <DuplicatesTab duplicates={result.duplicateTransactions} />
        )}
      </div>
    </div>
  );
}

// Tab Components
function SummaryTab({ result }: { result: TransactionImportResult }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-medium text-green-900">Valid Transactions</h3>
        <p className="text-2xl font-bold text-green-600">{result.summary.validRows}</p>
        <p className="text-sm text-green-700">Ready to import</p>
      </div>
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="font-medium text-red-900">Invalid Records</h3>
        <p className="text-2xl font-bold text-red-600">{result.summary.invalidRows}</p>
        <p className="text-sm text-red-700">Need correction</p>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="font-medium text-orange-900">Duplicate TxnIds</h3>
        <p className="text-2xl font-bold text-orange-600">{result.summary.duplicateCount}</p>
        <p className="text-sm text-orange-700">Will be ignored</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900">Total Processed</h3>
        <p className="text-2xl font-bold text-blue-600">{result.summary.totalRows}</p>
        <p className="text-sm text-blue-700">All records</p>
      </div>
    </div>
  );
}

function ValidTransactionsTab({ records }: { records: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TxnId</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From → To</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.slice(0, 100).map((record, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.TxnId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.TxnType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.PartNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.Qty}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {record.FromLocation} → {record.ToLocation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {records.length > 100 && (
        <p className="text-center text-gray-500 py-4">
          Showing first 100 records of {records.length} total
        </p>
      )}
    </div>
  );
}

function InvalidRecordsTab({ records }: { records: any[] }) {
  return (
    <div className="space-y-4">
      {records.map((record, index) => (
        <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-red-900">Row {record.rowNumber}</h4>
            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
              {record.errors.length} error{record.errors.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="mb-3">
            <strong>Errors:</strong>
            <ul className="list-disc list-inside text-sm text-red-700 mt-1">
              {record.errors.map((error: string, errorIndex: number) => (
                <li key={errorIndex}>{error}</li>
              ))}
            </ul>
          </div>
          <div className="text-sm text-gray-600">
            <strong>Raw data:</strong> {JSON.stringify(record.row)}
          </div>
        </div>
      ))}
    </div>
  );
}

function DuplicatesTab({ duplicates }: { duplicates: any[] }) {
  return (
    <div className="space-y-4">
      {duplicates.map((duplicate, index) => (
        <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
          <h4 className="font-medium text-orange-900 mb-2">
            Duplicate TxnId: {duplicate.txnId}
          </h4>
          <p className="text-sm text-orange-700">
            Found on rows: {duplicate.rowNumbers.join(', ')}
          </p>
          <p className="text-xs text-orange-600 mt-2">
            Note: Only the first occurrence will be imported. Subsequent duplicates will be ignored.
          </p>
        </div>
      ))}
    </div>
  );
}
