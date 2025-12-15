// ============================================================================
// ADD USER FORM - Professional Full-Screen User Creation Form
// ============================================================================
// Location: /components/forms/AddUserForm/
// Purpose: Beautiful, modern form for adding new users to the system

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddUserFormProps {
  onClose: () => void;
  onSave: (userData: UserFormData) => Promise<void>;
}

export interface UserFormData {
  name: string;
  email: string;
  role: string;
  shift: string;
  zones: string[];
  isActive: boolean;
  isVerifiedCounter: boolean;
}

const ROLES = [
  { value: 'Admin', label: 'Admin' },
  { value: 'IC_Manager', label: 'IC Manager' },
  { value: 'Warehouse_Manager', label: 'Warehouse Manager' },
  { value: 'Warehouse_Supervisor', label: 'Warehouse Supervisor' },
  { value: 'Lead', label: 'Lead' },
  { value: 'Operator', label: 'Operator' },
  { value: 'Viewer', label: 'Viewer' }
];

const SHIFTS = [
  { value: 'Day', label: 'Day Shift' },
  { value: 'Night', label: 'Night Shift' },
  { value: 'Swing', label: 'Swing Shift' }
];

const AVAILABLE_ZONES = [
  'ZONE-A1', 'ZONE-A2', 'ZONE-A3',
  'ZONE-B1', 'ZONE-B2', 'ZONE-B3',
  'ZONE-C1', 'ZONE-C2', 'ZONE-C3',
  'All Zones'
];

export function AddUserForm({ onClose, onSave }: AddUserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'Operator',
    shift: 'Day',
    zones: [],
    isActive: true,
    isVerifiedCounter: false
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.shift) {
      newErrors.shift = 'Shift is required';
    }

    if (formData.zones.length === 0) {
      newErrors.zones = 'At least one zone must be selected';
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
      onClose();
    } catch (error: any) {
      setErrors({ form: error.message || 'Failed to create user' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleZone = (zone: string) => {
    if (zone === 'All Zones') {
      setFormData(prev => ({
        ...prev,
        zones: prev.zones.length === AVAILABLE_ZONES.length ? [] : AVAILABLE_ZONES
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        zones: prev.zones.includes(zone)
          ? prev.zones.filter(z => z !== zone)
          : [...prev.zones, zone]
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
              <p className="text-sm text-gray-500 mt-1">Create a new user account for the warehouse system</p>
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
          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{errors.form}</p>
            </div>
          )}

          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({...formData, name: e.target.value});
                      if (errors.name) setErrors({...errors, name: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.name 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      if (errors.email) setErrors({...errors, email: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="john.doe@reconext.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Role & Access */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role & Access</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => {
                      setFormData({...formData, role: e.target.value});
                      if (errors.role) setErrors({...errors, role: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.role 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    {ROLES.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shift <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) => {
                      setFormData({...formData, shift: e.target.value});
                      if (errors.shift) setErrors({...errors, shift: ''});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.shift 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    {SHIFTS.map(shift => (
                      <option key={shift.value} value={shift.value}>
                        {shift.label}
                      </option>
                    ))}
                  </select>
                  {errors.shift && (
                    <p className="mt-1 text-sm text-red-600">{errors.shift}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Zone Access */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Zone Access <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {AVAILABLE_ZONES.map(zone => (
                  <label
                    key={zone}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.zones.includes(zone) || (zone === 'All Zones' && formData.zones.length === AVAILABLE_ZONES.length)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.zones.includes(zone) || (zone === 'All Zones' && formData.zones.length === AVAILABLE_ZONES.length)}
                      onChange={() => toggleZone(zone)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">{zone}</span>
                  </label>
                ))}
              </div>
              {errors.zones && (
                <p className="mt-2 text-sm text-red-600">{errors.zones}</p>
              )}
            </div>

            {/* Additional Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-900">Active User</span>
                    <p className="text-xs text-gray-500 mt-1">User can sign in and access the system</p>
                  </div>
                </label>

                {['Lead', 'Warehouse_Supervisor', 'IC_Manager', 'Warehouse_Manager'].includes(formData.role) && (
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isVerifiedCounter}
                      onChange={(e) => setFormData({...formData, isVerifiedCounter: e.target.checked})}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-900">Verified Counter</span>
                      <p className="text-xs text-gray-500 mt-1">Requires dual approval from IC Manager and Warehouse Manager</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                  </svg>
                  Creating User...
                </span>
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
