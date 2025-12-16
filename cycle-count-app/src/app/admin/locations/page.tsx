// ============================================================================
// LOCATION MANAGEMENT - Master Data with Excel Import
// ============================================================================
// Admin screen for managing warehouse locations and bulk Excel imports

'use client';

import { useState, useEffect } from 'react';
import { parseLocationExcel, validateExcelFile, LocationRow, ImportResult } from '@/lib/utils/masterDataImport';
import { LocationService, Location } from '@/lib/services/locationService';
import { LocationFormData } from '@/components/forms';
import {
  LocationManagementTab,
  LocationImportTab,
  EditLocationModal,
  DeleteLocationModal
} from './components';

export default function LocationManagementPage() {
  const [activeTab, setActiveTab] = useState<'manage' | 'import'>('manage');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult<LocationRow> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Real locations from Supabase
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(null);

  // Fetch locations from Supabase
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setIsLoadingLocations(true);
    try {
      const data = await LocationService.getLocations();
      setLocations(data);
    } catch (err: any) {
      setError(`Failed to load locations: ${err.message}`);
    } finally {
      setIsLoadingLocations(false);
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
      const result = await parseLocationExcel(file);
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

  const handleEditLocation = async (location: Location, updates: Partial<Location>) => {
    try {
      await LocationService.updateLocation(location.id, updates);
      setSuccessMessage('Location updated successfully!');
      setEditingLocation(null);
      await fetchLocations();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(`Failed to update location: ${err.message}`);
    }
  };

  const handleDeleteLocation = async (location: Location) => {
    try {
      await LocationService.deleteLocation(location.id);
      setSuccessMessage('Location deleted successfully!');
      setDeletingLocation(null);
      await fetchLocations();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(`Failed to delete location: ${err.message}`);
    }
  };

  const handleAddLocation = async (locationData: LocationFormData) => {
    try {
      await LocationService.createLocation(locationData);
      setSuccessMessage('Location created successfully!');
      await fetchLocations();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create location');
    }
  };

  const handleConfirmImport = async () => {
    if (!importResult || importResult.data.length === 0) return;

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { LocationService } = await import('@/lib/services/locationService');
      const insertResult = await LocationService.insertLocations(importResult.data);
      
      if (insertResult.errors.length > 0) {
        // Partial success - show both success and errors
        setSuccessMessage(`Successfully imported ${insertResult.inserted} locations. ${insertResult.errors.length} batch errors occurred.`);
        console.error('Import errors:', insertResult.errors);
        setError(`Some errors occurred: ${insertResult.errors.slice(0, 3).join(', ')}${insertResult.errors.length > 3 ? '...' : ''}`);
      } else {
        // Full success - show message then refresh locations
        setSuccessMessage(`Successfully imported ${insertResult.inserted} location${insertResult.inserted !== 1 ? 's' : ''}!`);
        // Refresh locations list after import
        await fetchLocations();
        // Switch to manage tab to see the new locations
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
              <LocationManagementTab 
                locations={locations}
                isLoading={isLoadingLocations}
                onEdit={(location) => setEditingLocation(location)}
                onDelete={(location) => setDeletingLocation(location)}
                onRefresh={fetchLocations}
                onAddLocation={handleAddLocation}
              />
            )}
            
            {activeTab === 'import' && (
              <LocationImportTab
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
        
        {/* Edit Location Modal */}
        {editingLocation && (
          <EditLocationModal
            location={editingLocation}
            onClose={() => setEditingLocation(null)}
            onSave={handleEditLocation}
          />
        )}
        
        {/* Delete Location Modal */}
        {deletingLocation && (
          <DeleteLocationModal
            location={deletingLocation}
            onClose={() => setDeletingLocation(null)}
            onConfirm={handleDeleteLocation}
          />
        )}
      </div>
    </div>
  );
}
