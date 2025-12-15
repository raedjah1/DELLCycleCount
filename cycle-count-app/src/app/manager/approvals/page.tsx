// ============================================================================
// APPROVAL QUEUE - Review and approve adjustments (especially Finished Goods)
// ============================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApprovalQueuePage() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Mock data
  const [approvals] = useState([
    {
      id: '1',
      partNumber: 'PART-001',
      locationCode: 'Reimage.ARB.AB.01.01A',
      expected: 10,
      count: 8,
      delta: -2,
      warehouseType: 'Finishedgoods',
      photoUrl: '/placeholder-photo.jpg',
      requestedBy: 'John Smith',
      requestedDate: '2024-12-15T10:30:00Z',
      isHighImpact: true,
      icManagerApproval: 'approved',
      warehouseManagerApproval: 'pending'
    },
    {
      id: '2',
      partNumber: 'PART-002',
      locationCode: 'Reimage.ARB.AB.01.02A',
      expected: 5,
      count: 5,
      delta: 0,
      warehouseType: 'Rawgoods',
      requestedBy: 'Maria Garcia',
      requestedDate: '2024-12-15T09:15:00Z',
      isHighImpact: false,
      icManagerApproval: null,
      warehouseManagerApproval: null
    }
  ]);

  const selectedApproval = approvals.find(a => a.id === selectedItem);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/manager/dashboard')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Approval Queue</h1>
          <p className="text-gray-600 mt-2">Review and approve adjustment requests</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Approval List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {approvals.map((approval) => (
                  <div
                    key={approval.id}
                    onClick={() => setSelectedItem(approval.id)}
                    className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedItem === approval.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{approval.partNumber}</span>
                          {approval.isHighImpact && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                              High Impact
                            </span>
                          )}
                          {approval.warehouseType === 'Finishedgoods' && (
                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                              Finished Goods
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{approval.locationCode}</p>
                      </div>
                      {approval.photoUrl && (
                        <img
                          src={approval.photoUrl}
                          alt="Location"
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Expected</span>
                        <p className="font-medium text-gray-900">{approval.expected}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Count</span>
                        <p className="font-medium text-gray-900">{approval.count}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Delta</span>
                        <p className={`font-medium ${approval.delta < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {approval.delta > 0 ? '+' : ''}{approval.delta}
                        </p>
                      </div>
                    </div>
                    {approval.isHighImpact && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-4 text-xs">
                          <span className={`px-2 py-1 rounded ${
                            approval.icManagerApproval === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            IC Manager: {approval.icManagerApproval || 'Pending'}
                          </span>
                          <span className={`px-2 py-1 rounded ${
                            approval.warehouseManagerApproval === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            Warehouse Manager: {approval.warehouseManagerApproval || 'Pending'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detail View */}
          <div>
            {selectedApproval ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Details</h3>
                <div className="space-y-4">
                  {selectedApproval.photoUrl && (
                    <div>
                      <img
                        src={selectedApproval.photoUrl}
                        alt="Location label"
                        className="w-full rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-600">Requested By</span>
                    <p className="font-medium text-gray-900">{selectedApproval.requestedBy}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Date</span>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedApproval.requestedDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                      Approve
                    </button>
                    <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-gray-500 text-center">Select an item to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
