// ============================================================================
// ITEM MANAGEMENT - Master Data with Excel Import
// ============================================================================
// Admin screen for managing warehouse items/products and bulk Excel imports

'use client';

import { useState } from 'react';
import { parseItemExcel, validateExcelFile, ItemRow, ImportResult } from '@/lib/utils/masterDataImport';

export default function ItemManagementPage() {
  const [activeTab, setActiveTab] = useState<'manage' | 'import'>('manage');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult<ItemRow> | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock existing items data
  const [items] = useState<ItemRow[]>([
    {
      ID: 10053,
      Name: 'DELL',
      PartNo: 'LAPTOP-DELL-001',
      Description: 'Dell Latitude 7420 Business Laptop',
      ManufacturePartNo: 'LAPTOP-DELL-001',
      ModelNo: 'Latitude 7420',
      SerialFlag: 'Y',
      PrimaryCommodity: 'Laptop',
      SecondaryCommodity: 'NA',
      PartType: 'Part',
      Status: 'ACTIVE',
      Username: 'admin@reconext.com',
      CreateDate: new Date().toISOString(),
      LastActivityDate: new Date().toISOString(),
      WarehouseType: 'Finishedgoods',
      ABCClass: 'A',
      StandardCost: 1299.99
    },
    {
      ID: 10054,
      Name: 'HPE',
      PartNo: 'SRV-HPE-DL380',
      Description: 'HPE ProLiant DL380 Gen10 Server',
      ManufacturePartNo: 'SRV-HPE-DL380',
      ModelNo: 'DL380 Gen10',
      SerialFlag: 'Y',
      PrimaryCommodity: 'Server',
      SecondaryCommodity: 'NA',
      PartType: 'Part',
      Status: 'ACTIVE',
      Username: 'admin@reconext.com',
      CreateDate: new Date().toISOString(),
      LastActivityDate: new Date().toISOString(),
      WarehouseType: 'Finishedgoods',
      ABCClass: 'A',
      StandardCost: 4599.00
    },
    {
      ID: 10055,
      Name: 'Memory',
      PartNo: 'RAM-DDR4-32GB',
      Description: '32GB DDR4 3200MHz Memory Module',
      ManufacturePartNo: 'RAM-DDR4-32GB',
      ModelNo: 'DDR4-32GB',
      SerialFlag: 'Y',
      PrimaryCommodity: 'Memory',
      SecondaryCommodity: 'NA',
      PartType: 'Component',
      Status: 'ACTIVE',
      Username: 'admin@reconext.com',
      CreateDate: new Date().toISOString(),
      LastActivityDate: new Date().toISOString(),
      WarehouseType: 'Rawgoods',
      ABCClass: 'B',
      StandardCost: 189.99
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
      const result = await parseItemExcel(file);
      setImportResult(result);
      
      // TODO: Send valid rows to Supabase
      console.log('✅ Item Import Results:', result);
      
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Manage Items
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
              <ItemManagementTab items={items} />
            )}
            {activeTab === 'import' && (
              <ItemImportTab
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
// ITEM MANAGEMENT TAB
// ============================================================================

interface ItemManagementTabProps {
  items: ItemRow[];
}

function ItemManagementTab({ items }: ItemManagementTabProps) {
  return (
    <div className="space-y-6">
      {/* Actions Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Product Catalog</h3>
          <p className="text-sm text-gray-500 mt-1">{items.length} items configured</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Export to Excel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Add Item
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Part Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ABC Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-mono text-sm font-medium text-gray-900">{item.PartNo}</div>
                    <div className="text-xs text-gray-500">{item.WarehouseType || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={item.Description}>
                      {item.Description}
                    </div>
                    <div className="text-xs text-gray-500">{item.PartType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      item.WarehouseType === 'Finishedgoods' 
                        ? 'bg-green-100 text-green-800'
                        : item.WarehouseType === 'Rawgoods'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.WarehouseType || 'N/A'}
                    </span>
                    {item.WarehouseType === 'Rawgoods' && item.SerialFlag === 'Y' && (
                      <div className="mt-1">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Serial Req'd
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.ABCClass === 'A' 
                        ? 'bg-red-100 text-red-800'
                        : item.ABCClass === 'B'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      Class {item.ABCClass}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${item.StandardCost?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                    </div>
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
// ITEM IMPORT TAB
// ============================================================================

interface ItemImportTabProps {
  file: File | null;
  isUploading: boolean;
  importResult: ImportResult<ItemRow> | null;
  error: string | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
  onReset: () => void;
}

function ItemImportTab({
  file,
  isUploading,
  importResult,
  error,
  onFileSelect,
  onImport,
  onReset
}: ItemImportTabProps) {
  return (
    <div className="space-y-8">
      {/* Import Instructions */}
      <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-purple-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-purple-900">Item Import Requirements</h3>
            <div className="mt-3 text-sm text-purple-800">
              <p className="mb-2">Your Excel file must contain the following columns (exact spelling required):</p>
              <div className="grid grid-cols-2 gap-4">
                <ul className="list-disc list-inside space-y-1">
                  <li><code className="bg-purple-100 px-1 rounded">ID</code> - Program ID (number)</li>
                  <li><code className="bg-purple-100 px-1 rounded">Name</code> - Item name</li>
                  <li><code className="bg-purple-100 px-1 rounded">PartNo</code> - Unique part/SKU identifier</li>
                  <li><code className="bg-purple-100 px-1 rounded">Description</code> - Item description</li>
                  <li><code className="bg-purple-100 px-1 rounded">SerialFlag</code> - Y or N for serial tracking</li>
                  <li><code className="bg-purple-100 px-1 rounded">PartType</code> - Part, Component, etc.</li>
                </ul>
                <ul className="list-disc list-inside space-y-1">
                  <li><code className="bg-purple-100 px-1 rounded">Status</code> - ACTIVE, INACTIVE, etc.</li>
                  <li><code className="bg-purple-100 px-1 rounded">PrimaryCommodity</code> - Primary commodity type</li>
                  <li><code className="bg-purple-100 px-1 rounded">SecondaryCommodity</code> - Secondary commodity</li>
                  <li><code className="bg-purple-100 px-1 rounded">ManufacturePartNo</code> - Manufacturer part number</li>
                  <li><code className="bg-purple-100 px-1 rounded">ModelNo</code> - Model number</li>
                  <li><code className="bg-purple-100 px-1 rounded">Username</code> - Creator email</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Item Excel File</h3>
            <p className="text-gray-600 mb-4">Select an Excel file (.xls or .xlsx) with item/product data</p>
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
            className="inline-flex items-center px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
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
                Import Items
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
          dataType="Item"
        />
      )}
    </div>
  );
}

// ============================================================================
// IMPORT RESULTS SECTION (Reused from Location Management)
// ============================================================================

interface ImportResultsSectionProps {
  result: ImportResult<ItemRow>;
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
