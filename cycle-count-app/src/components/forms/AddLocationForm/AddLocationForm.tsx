// ============================================================================
// ADD LOCATION FORM - Professional Full-Screen Location Creation Form
// ============================================================================

'use client';

import { useState } from 'react';
import { Location } from '@/lib/services/locationService';

interface AddLocationFormProps {
  onClose: () => void;
  onSave: (locationData: LocationFormData) => Promise<void>;
}

export interface LocationFormData {
  program_id: number;
  warehouse: string;
  building: string;
  bay: string;
  row: string;
  tier: string;
  bin?: string;
  location_group: string;
  is_risk_location: boolean;
  risk_reason?: string;
}

export default function AddLocationForm({ onClose, onSave }: AddLocationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<LocationFormData>({
    program_id: 10053,
    warehouse: '',
    building: '',
    bay: '',
    row: '',
    tier: '',
    bin: '',
    location_group: '',
    is_risk_location: false,
    risk_reason: ''
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.building.trim()) {
      newErrors.building = 'Building is required';
    }
    if (!formData.bay.trim()) {
      newErrors.bay = 'Bay is required';
    }
    if (!formData.row.trim()) {
      newErrors.row = 'Row is required';
    }
    if (!formData.tier.trim()) {
      newErrors.tier = 'Tier is required';
    }
    if (formData.is_risk_location && !formData.risk_reason?.trim()) {
      newErrors.risk_reason = 'Risk reason is required for risk locations';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to create location' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Location</h2>
            <p className="text-sm text-gray-500 mt-1">Create a new warehouse location</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-8">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.program_id}
                  onChange={(e) => setFormData({ ...formData, program_id: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
                {errors.program_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.program_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warehouse
                </label>
                <input
                  type="text"
                  value={formData.warehouse}
                  onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
                {errors.building && (
                  <p className="mt-1 text-sm text-red-600">{errors.building}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bay <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.bay}
                  onChange={(e) => setFormData({ ...formData, bay: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
                {errors.bay && (
                  <p className="mt-1 text-sm text-red-600">{errors.bay}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Row <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.row}
                  onChange={(e) => setFormData({ ...formData, row: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
                {errors.row && (
                  <p className="mt-1 text-sm text-red-600">{errors.row}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
                {errors.tier && (
                  <p className="mt-1 text-sm text-red-600">{errors.tier}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bin
                </label>
                <input
                  type="text"
                  value={formData.bin || ''}
                  onChange={(e) => setFormData({ ...formData, bin: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Group
                </label>
                <input
                  type="text"
                  value={formData.location_group}
                  onChange={(e) => setFormData({ ...formData, location_group: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="e.g., ZONE-A1"
                />
              </div>
            </div>
          </div>

          {/* Risk Location */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Status</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_risk_location}
                  onChange={(e) => setFormData({ ...formData, is_risk_location: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Mark as Risk Location</span>
              </label>

              {formData.is_risk_location && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.risk_reason || ''}
                    onChange={(e) => setFormData({ ...formData, risk_reason: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Explain why this is a risk location..."
                    required={formData.is_risk_location}
                  />
                  {errors.risk_reason && (
                    <p className="mt-1 text-sm text-red-600">{errors.risk_reason}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Location'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

