// ============================================================================
// TRANSACTION MANAGEMENT - Master Data with Excel Import
// ============================================================================
// Admin screen for managing transactions and bulk Excel imports

'use client';

import { useState, useEffect } from 'react';
import { parseTransactionExcel, validateExcelFile, TransactionImportResult } from '@/lib/utils/excelImport';
import { TransactionService, Transaction } from '@/lib/services/transactionService';
import {
  TransactionManagementTab,
  TransactionImportTab
} from './components';

export default function TransactionPage() {
  const [activeTab, setActiveTab] = useState<'manage' | 'import'>('manage');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<TransactionImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Real transactions from Supabase
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch transactions from Supabase
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchQuery]);

  const fetchTransactions = async () => {
    setIsLoadingTransactions(true);
    try {
      const result = await TransactionService.getPaginatedTransactions(currentPage, 20, searchQuery);
      setTransactions(result.data);
      setTotalPages(result.totalPages);
      setTotalCount(result.total);
    } catch (err: any) {
      setError(`Failed to load transactions: ${err.message}`);
    } finally {
      setIsLoadingTransactions(false);
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
      const result = await parseTransactionExcel(file);
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

  const handleDeleteTransaction = async (id: string) => {
    try {
      await TransactionService.deleteTransaction(id);
      setSuccessMessage('Transaction record deleted successfully!');
      await fetchTransactions();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(`Failed to delete transaction: ${err.message}`);
    }
  };

  const handleDeleteAllTransactions = async (): Promise<number> => {
    try {
      const deletedCount = await TransactionService.deleteAllTransactions();
      setSuccessMessage(`Successfully deleted all ${deletedCount} transaction records!`);
      await fetchTransactions();
      setTimeout(() => setSuccessMessage(null), 5000);
      return deletedCount;
    } catch (err: any) {
      setError(`Failed to delete all transactions: ${err.message}`);
      throw err;
    }
  };

  const handleConfirmImport = async () => {
    if (!importResult || importResult.validRows.length === 0) return;

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const insertResult = await TransactionService.insertTransactions(importResult.validRows);
      
      if (insertResult.errors.length > 0) {
        // Partial success - show both success and errors
        setSuccessMessage(`Successfully imported ${insertResult.inserted} transaction records. ${insertResult.errors.length} batch errors occurred.`);
        console.error('Import errors:', insertResult.errors);
        setError(`Some errors occurred: ${insertResult.errors.slice(0, 3).join(', ')}${insertResult.errors.length > 3 ? '...' : ''}`);
      } else {
        // Full success - show message then refresh transactions
        setSuccessMessage(`Successfully imported ${insertResult.inserted} transaction record${insertResult.inserted !== 1 ? 's' : ''}!`);
        // Refresh transactions list after import
        await fetchTransactions();
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Manage Transactions
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
                  Import Transactions
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'manage' && (
              <TransactionManagementTab
                transactions={transactions}
                isLoading={isLoadingTransactions}
                onDelete={handleDeleteTransaction}
                onDeleteAll={handleDeleteAllTransactions}
                onRefresh={fetchTransactions}
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
              <TransactionImportTab
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
