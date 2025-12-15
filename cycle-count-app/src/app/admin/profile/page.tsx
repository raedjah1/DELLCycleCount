// ============================================================================
// USER PROFILE - Admin Profile Management
// ============================================================================
// User profile page for viewing and editing personal information

'use client';

import { useState } from 'react';

export default function AdminProfilePage() {
  // Mock user data - in production, this would come from auth context
  const [userData, setUserData] = useState({
    name: 'Raed Jah',
    email: 'raed.jah@reconext.com',
    role: 'Admin',
    phone: '+1 (555) 123-4567',
    department: 'IT / Operations',
    employeeId: 'EMP-001234',
    joinDate: '2024-01-15',
    isVerifiedCounter: true,
    shift: 'Day',
    zones: ['All Zones']
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);

  const handleSave = () => {
    setUserData(editedData);
    setIsEditing(false);
    // TODO: Save to backend
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
                <p className="text-blue-100 mt-1">{userData.email}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-white/20 text-white rounded-full">
                    {userData.role}
                  </span>
                  {userData.isVerifiedCounter && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-400/20 text-yellow-100 rounded-full">
                      Verified Counter
                    </span>
                  )}
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editedData.name}
                      onChange={(e) => setEditedData({...editedData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editedData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editedData.phone}
                      onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={editedData.department}
                      onChange={(e) => setEditedData({...editedData, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.phone}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.department}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Employee ID</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.employeeId}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Join Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(userData.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Shift</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.shift} Shift</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Zone Access</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.zones.join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Total Cycle Counts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,247</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Accuracy Rate</p>
              <p className="text-2xl font-bold text-green-600 mt-1">98.5%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Active</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
