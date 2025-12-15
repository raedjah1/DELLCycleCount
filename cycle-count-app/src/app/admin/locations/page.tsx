// ============================================================================
// LOCATION MANAGEMENT - Master Data with Excel Import
// ============================================================================
// Admin screen for managing warehouse locations and bulk Excel imports

'use client';

import { useState } from 'react';
import { parseLocationExcel, validateExcelFile, LocationRow, ImportResult } from '@/lib/utils/masterDataImport';

export default function LocationManagementPage() {
  const [activeTab, setActiveTab] = useState<'manage' | 'import'>('manage');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult<LocationRow> | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock existing locations data
  const [locations] = useState<LocationRow[]>([
    {
      ProgramID: 10053,
      Warehouse: 'Reimage',
      LocationNo: '.ARB.AB.01.01A',
      Building: 'ARB',
      Bay: 'AB',
      Row: '01',
      Tier: '01A',
      Bin: 'ARB.AB.01.01A',
      LocationGroup: 'ZONE-A1',
      Volume: 0,
      Height: 0,
      Width: 0,
      Length: 0,
      RiskLocation: 'No'
    },
    {
      ProgramID: 10053,
      Warehouse: 'Production',
      LocationNo: '.MFG.CD.15.03B',
      Building: 'MFG',
      Bay: 'CD',
      Row: '15',
      Tier: '03B',
      Bin: 'MFG.CD.15.03B',
      LocationGroup: 'ZONE-P2',
      Volume: 0,
      Height: 0,
      Width: 0,
      Length: 0,
      RiskLocation: 'Yes',
      RiskReason: 'High-value components stored here'
    }
  ]);

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
      const result = await parseLocationExcel(file);
      setImportResult(result);
      
      // TODO: Send valid rows to Supabase
      console.log('✅ Location Import Results:', result);
      
    } catch (err: any) {
      setError(err.message || 'Import failed');
    } finally {
      setIsUploading(false);
    }
  };

  const resetImport = () => {
    setFile(null);
    setImportResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'manage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Manage Locations
                </div>
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'import'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Bulk Import
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'manage' && (
              <LocationManagementTab locations={locations} />
            )}
            {activeTab === 'import' && (
              <LocationImportTab
                file={file}
                isUploading={isUploading}
                importResult={importResult}
                error={error}
                onFileSelect={handleFileSelect}
                onImport={handleImport}
                onReset={resetImport}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LOCATION MANAGEMENT TAB
// ============================================================================

interface LocationManagementTabProps {
  locations: LocationRow[];
}

function LocationManagementTab({ locations }: LocationManagementTabProps) {
  return (
    <div className="space-y-6">
      {/* Actions Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Current Locations</h3>
          <p className="text-sm text-gray-500 mt-1">{locations.length} locations configured</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Export to Excel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Add Location
          </button>
        </div>
      </div>

      {/* Locations Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locations.map((location, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-mono text-sm text-gray-900">{location.Bin || location.LocationNo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{location.Warehouse || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {location.LocationGroup || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {location.RiskLocation === 'Yes' ? (
                      <div className="flex items-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Risk Location
                        </span>
                        {location.RiskReason && (
                          <div className="ml-2 text-xs text-gray-500" title={location.RiskReason}>
                            ℹ️
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
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

// ============================================================================
// LOCATION IMPORT TAB
// ============================================================================

interface LocationImportTabProps {
  file: File | null;
  isUploading: boolean;
  importResult: ImportResult<LocationRow> | null;
  error: string | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
  onReset: () => void;
}

function LocationImportTab({
  file,
  isUploading,
  importResult,
  error,
  onFileSelect,
  onImport,
  onReset
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

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
          dataType="Location"
        />
      )}
    </div>
  );
}

// ============================================================================
// IMPORT RESULTS SECTION
// ============================================================================

interface ImportResultsSectionProps {
  result: ImportResult<LocationRow>;
  onStartOver: () => void;
  dataType: string;
}

function ImportResultsSection({ result, onStartOver, dataType }: ImportResultsSectionProps) {
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
          <button className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirm Import ({result.summary.validRows} {dataType.toLowerCase()}{result.summary.validRows !== 1 ? 's' : ''})
          </button>
        </div>
      )}
    </div>
  );
}
