// ============================================================================
// EDIT LOCATION MODAL
// ============================================================================

'use client';

import { useState } from 'react';
import { Location } from '@/lib/services/locationService';

interface EditLocationModalProps {
  location: Location;
  onClose: () => void;
  onSave: (location: Location, updates: Partial<Location>) => Promise<void>;
}

export default function EditLocationModal({ location, onClose, onSave }: EditLocationModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    warehouse: location.warehouse || '',
    building: location.building,
    bay: location.bay,
    row: location.row,
    tier: location.tier,
    location_group: location.location_group || '',
    is_risk_location: location.is_risk_location,
    risk_reason: location.risk_reason || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(location, formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Edit Location</h3>
          <p className="text-sm text-gray-500 mt-1">Location Code: {location.location_code}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
              <input
                type="text"
                value={formData.warehouse}
                onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Group</label>
              <input
                type="text"
                value={formData.location_group}
                onChange={(e) => setFormData({ ...formData, location_group: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
              <input
                type="text"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bay</label>
              <input
                type="text"
                value={formData.bay}
                onChange={(e) => setFormData({ ...formData, bay: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Row</label>
              <input
                type="text"
                value={formData.row}
                onChange={(e) => setFormData({ ...formData, row: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
              <input
                type="text"
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_risk_location}
                onChange={(e) => setFormData({ ...formData, is_risk_location: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Risk Location</span>
            </label>
          </div>
          
          {formData.is_risk_location && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Risk Reason</label>
              <textarea
                value={formData.risk_reason}
                onChange={(e) => setFormData({ ...formData, risk_reason: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

