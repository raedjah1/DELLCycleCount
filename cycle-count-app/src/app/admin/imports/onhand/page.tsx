// ============================================================================
// ONHAND IMPORT SCREEN - Excel Upload for Warehouse Inventory
// ============================================================================
// Admin screen for importing OnHand snapshots (Section 10.1)

'use client';

import { useState } from 'react';
import { parseOnHandExcel, validateExcelFile, OnHandImportResult } from '@/lib/utils/excelImport';
import { parseLocationCode } from '@/lib/utils/locationParser';

export default function OnHandImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<OnHandImportResult | null>(null);
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
      const result = await parseOnHandExcel(file);
      setImportResult(result);
      
      // TODO: Send valid rows to Supabase
      console.log('✅ Import Results:', result);
      
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Excel File Upload</h2>
          
          {/* Required Format */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Required Excel Format</h3>
            <div className="text-sm text-blue-700">
              <p className="mb-2"><strong>Required headers (exact):</strong></p>
              <div className="bg-blue-100 p-3 rounded font-mono text-xs">
                AsOfTimestamp | LocationCode | PartNumber | ExpectedQty
              </div>
              <p className="mt-2"><strong>Example:</strong></p>
              <div className="bg-blue-100 p-3 rounded font-mono text-xs mt-1">
                2024-12-15 08:00:00 | Reimage.ARB.AB.01.01A | LAPTOP-001 | 25
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {!file ? (
              <div>
                <div className="w-12 h-12 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">Upload Excel File</p>
                <p className="text-gray-500 mb-4">Select .xls or .xlsx file (max 10MB)</p>
                <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Choose File
                  <input 
                    type="file" 
                    accept=".xls,.xlsx" 
                    onChange={handleFileSelect}
                    className="hidden" 
                  />
                </label>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-1">{file.name}</p>
                <p className="text-gray-500 mb-4">{(file.size / 1024).toFixed(1)} KB</p>
                <div className="flex items-center justify-center space-x-3">
                  <button 
                    onClick={handleImport}
                    disabled={isUploading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
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
                        Import Data
                      </>
                    )}
                  </button>
                  <button 
                    onClick={clearImport}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
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
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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
  result: OnHandImportResult;
}

function ImportResults({ result }: ImportResultsProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'valid' | 'invalid'>('summary');

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Results Header */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Import Results</h2>
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
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">{result.summary.dataQualityIssues} Data Quality Issues</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex">
          {[
            { id: 'summary', label: 'Summary', count: result.summary.totalRows },
            { id: 'valid', label: 'Valid Records', count: result.summary.validRows },
            { id: 'invalid', label: 'Invalid Records', count: result.summary.invalidRows }
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
          <ValidRecordsTab records={result.validRows} />
        )}
        {activeTab === 'invalid' && (
          <InvalidRecordsTab records={result.invalidRows} />
        )}
      </div>
    </div>
  );
}

// Summary Tab Component
function SummaryTab({ result }: { result: OnHandImportResult }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-medium text-green-900">Valid Records</h3>
        <p className="text-2xl font-bold text-green-600">{result.summary.validRows}</p>
        <p className="text-sm text-green-700">Ready to import</p>
      </div>
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="font-medium text-red-900">Invalid Records</h3>
        <p className="text-2xl font-bold text-red-600">{result.summary.invalidRows}</p>
        <p className="text-sm text-red-700">Need correction</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-medium text-yellow-900">Data Quality Issues</h3>
        <p className="text-2xl font-bold text-yellow-600">{result.summary.dataQualityIssues}</p>
        <p className="text-sm text-yellow-700">Location format issues</p>
      </div>
    </div>
  );
}

// Valid Records Tab
function ValidRecordsTab({ records }: { records: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Qty</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">As Of</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.slice(0, 100).map((record, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {record.LocationCode}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.PartNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.ExpectedQty}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(record.AsOfTimestamp).toLocaleString()}
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

// Invalid Records Tab
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
