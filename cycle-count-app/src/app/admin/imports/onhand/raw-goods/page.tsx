// ============================================================================
// RAW GOODS MANAGEMENT - Master Data with Excel Import
// ============================================================================
// Admin screen for managing raw goods and bulk Excel imports

'use client';

import { useState, useEffect } from 'react';
import { parseRawGoodsExcel, validateExcelFile, RawGoodsImportResult } from '@/lib/utils/excelImport';
import { RawGoodsService, RawGoods } from '@/lib/services/rawGoodsService';
import {
  RawGoodsManagementTab,
  RawGoodsImportTab
} from './components';

export default function RawGoodsPage() {
  const [activeTab, setActiveTab] = useState<'manage' | 'import'>('manage');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<RawGoodsImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Real raw goods from Supabase
  const [rawGoods, setRawGoods] = useState<RawGoods[]>([]);
  const [isLoadingRawGoods, setIsLoadingRawGoods] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch raw goods from Supabase
  useEffect(() => {
    fetchRawGoods();
  }, [currentPage, searchQuery]);

  const fetchRawGoods = async () => {
    setIsLoadingRawGoods(true);
    try {
      const result = await RawGoodsService.getPaginatedRawGoods(currentPage, 20, searchQuery);
      setRawGoods(result.data);
      setTotalPages(result.totalPages);
      setTotalCount(result.total);
    } catch (err: any) {
      setError(`Failed to load raw goods: ${err.message}`);
    } finally {
      setIsLoadingRawGoods(false);
    }
  };

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
      // Parse and validate Excel (don't insert yet - user clicks "Confirm Import")
      const result = await parseRawGoodsExcel(file);
      setImportResult(result);
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
    setSuccessMessage(null);
  };

  const handleDeleteRawGoods = async (id: string) => {
    try {
      await RawGoodsService.deleteRawGoods(id);
      setSuccessMessage('Raw goods record deleted successfully!');
      await fetchRawGoods();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(`Failed to delete raw goods: ${err.message}`);
    }
  };

  const handleConfirmImport = async () => {
    if (!importResult || importResult.validRows.length === 0) return;

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const insertResult = await RawGoodsService.insertRawGoods(importResult.validRows);
      
      if (insertResult.errors.length > 0) {
        // Partial success - show both success and errors
        setSuccessMessage(`Successfully imported ${insertResult.inserted} raw goods records. ${insertResult.errors.length} batch errors occurred.`);
        console.error('Import errors:', insertResult.errors);
        setError(`Some errors occurred: ${insertResult.errors.slice(0, 3).join(', ')}${insertResult.errors.length > 3 ? '...' : ''}`);
      } else {
        // Full success - show message then refresh raw goods
        setSuccessMessage(`Successfully imported ${insertResult.inserted} raw goods record${insertResult.inserted !== 1 ? 's' : ''}!`);
        // Refresh raw goods list after import
        await fetchRawGoods();
        // Switch to manage tab to see the new records
        setTimeout(() => {
          setActiveTab('manage');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Import error:', err);
      setError(err.message || 'Import failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6 lg:mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'manage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Manage Raw Goods
                </div>
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'import'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Import Raw Goods
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'manage' && (
              <RawGoodsManagementTab
                rawGoods={rawGoods}
                isLoading={isLoadingRawGoods}
                onDelete={handleDeleteRawGoods}
                onRefresh={fetchRawGoods}
                onSearch={(query) => {
                  setSearchQuery(query);
                  setCurrentPage(1);
                }}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
              />
            )}

            {activeTab === 'import' && (
              <RawGoodsImportTab
                file={file}
                isUploading={isUploading}
                importResult={importResult}
                error={error}
                successMessage={successMessage}
                onFileSelect={handleFileSelect}
                onImport={handleImport}
                onReset={resetImport}
                onConfirmImport={handleConfirmImport}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
