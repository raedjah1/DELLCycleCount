// ============================================================================
// ZONES MANAGEMENT - Create and manage zones
// ============================================================================

'use client';

import { useState } from 'react';

export default function ZonesManagementPage() {
  const [activeTab, setActiveTab] = useState<'manage' | 'import'>('manage');
  const [zones] = useState([
    {
      id: '1',
      code: 'ZONE-A1',
      name: 'Zone A1',
      description: 'Raw Goods Zone A1',
      warehouse: 'Reimage',
      journalSizeDefault: 30
    },
    {
      id: '2',
      code: 'ZONE-A2',
      name: 'Zone A2',
      description: 'Raw Goods Zone A2',
      warehouse: 'Reimage',
      journalSizeDefault: 30
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Zones Management</h1>
          <p className="text-gray-600 mt-2">Create and manage warehouse zones</p>
        </div>

        {/* Tabs */}
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
                Manage Zones
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'import'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Import Zones
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'manage' && (
              <div>
                <div className="flex justify-end mb-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Add Zone
                  </button>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Journal Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {zones.map((zone) => (
                        <tr key={zone.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{zone.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zone.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zone.warehouse}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zone.journalSizeDefault} lines</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                            <button className="text-red-600 hover:text-red-800">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'import' && (
              <div className="max-w-2xl">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Import Zones</h3>
                  <p className="mt-2 text-sm text-gray-500">Upload Excel file to import zones</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Select File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
