// ============================================================================
// DELETE LOCATION MODAL
// ============================================================================

'use client';

import { useState } from 'react';
import { Location } from '@/lib/services/locationService';

interface DeleteLocationModalProps {
  location: Location;
  onClose: () => void;
  onConfirm: (location: Location) => Promise<void>;
}

export default function DeleteLocationModal({ location, onClose, onConfirm }: DeleteLocationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(location);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-red-900">Delete Location</h3>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-4">
            Are you sure you want to delete location <span className="font-mono font-semibold">{location.location_code}</span>?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

