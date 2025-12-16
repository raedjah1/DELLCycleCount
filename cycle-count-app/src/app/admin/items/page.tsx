// ============================================================================
// ITEM MANAGEMENT - Master Data with Excel Import
// ============================================================================
// Admin screen for managing warehouse items/products and bulk Excel imports

'use client';

import { useState, useEffect } from 'react';
import { parseItemExcel, validateExcelFile, ItemRow, ImportResult } from '@/lib/utils/masterDataImport';
import { ItemService, Item } from '@/lib/services/itemService';
import { ItemFormData } from '@/components/forms';
import {
  ItemManagementTab,
  ItemImportTab,
  EditItemModal,
  DeleteItemModal
} from './components';

export default function ItemManagementPage() {
  const [activeTab, setActiveTab] = useState<'manage' | 'import'>('manage');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult<ItemRow> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Real items from Supabase
  const [items, setItems] = useState<Item[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);

  // Fetch items from Supabase
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoadingItems(true);
    try {
      const data = await ItemService.getItems();
      setItems(data);
    } catch (err: any) {
      setError(`Failed to load items: ${err.message}`);
    } finally {
      setIsLoadingItems(false);
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
      const result = await parseItemExcel(file);
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

  const handleEditItem = async (item: Item, updates: Partial<Item>) => {
    try {
      await ItemService.updateItem(item.id, updates);
      setSuccessMessage('Item updated successfully!');
      setEditingItem(null);
      await fetchItems();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(`Failed to update item: ${err.message}`);
    }
  };

  const handleDeleteItem = async (item: Item) => {
    try {
      await ItemService.deleteItem(item.id);
      setSuccessMessage('Item deleted successfully!');
      setDeletingItem(null);
      await fetchItems();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(`Failed to delete item: ${err.message}`);
    }
  };

  const handleAddItem = async (itemData: ItemFormData) => {
    try {
      await ItemService.createItem(itemData);
      setSuccessMessage('Item created successfully!');
      await fetchItems();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create item');
    }
  };

  const handleConfirmImport = async () => {
    if (!importResult || importResult.data.length === 0) return;

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { ItemService } = await import('@/lib/services/itemService');
      const insertResult = await ItemService.insertItems(importResult.data);
      
      if (insertResult.errors.length > 0) {
        // Partial success - show both success and errors
        setSuccessMessage(`Successfully imported ${insertResult.inserted} items. ${insertResult.errors.length} batch errors occurred.`);
        console.error('Import errors:', insertResult.errors);
        setError(`Some errors occurred: ${insertResult.errors.slice(0, 3).join(', ')}${insertResult.errors.length > 3 ? '...' : ''}`);
      } else {
        // Full success - show message then refresh items
        setSuccessMessage(`Successfully imported ${insertResult.inserted} item${insertResult.inserted !== 1 ? 's' : ''}!`);
        // Refresh items list after import
        await fetchItems();
        // Switch to manage tab to see the new items
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
              <ItemManagementTab 
                items={items}
                isLoading={isLoadingItems}
                onEdit={(item) => setEditingItem(item)}
                onDelete={(item) => setDeletingItem(item)}
                onRefresh={fetchItems}
                onAddItem={handleAddItem}
              />
            )}
            
            {activeTab === 'import' && (
              <ItemImportTab
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
        
        {/* Edit Item Modal */}
        {editingItem && (
          <EditItemModal
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onSave={handleEditItem}
          />
        )}
        
        {/* Delete Item Modal */}
        {deletingItem && (
          <DeleteItemModal
            item={deletingItem}
            onClose={() => setDeletingItem(null)}
            onConfirm={handleDeleteItem}
          />
        )}
      </div>
    </div>
  );
}
