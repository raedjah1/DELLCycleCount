// ============================================================================
// VERIFIED COUNTER MANAGEMENT - Grant or revoke Verified Counter certification
// ============================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifiedCounterManagementPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Mock data
  const [users] = useState([
    {
      id: '1',
      name: 'John Smith',
      role: 'Lead',
      isVerifiedCounter: true,
      certifiedDate: '2024-11-15T08:00:00Z',
      certifiedBy: 'IC Manager & Warehouse Manager'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      role: 'Warehouse Supervisor',
      isVerifiedCounter: false,
      pendingRequest: {
        requestedBy: 'IC Manager',
        requestedDate: '2024-12-14T10:00:00Z',
        icManagerApproval: 'approved',
        warehouseManagerApproval: 'pending'
      }
    },
    {
      id: '3',
      name: 'Mike Johnson',
      role: 'Lead',
      isVerifiedCounter: false,
      pendingRequest: null
    }
  ]);

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
          <h1 className="text-3xl font-bold text-gray-900">Verified Counter Management</h1>
          <p className="text-gray-600 mt-2">Grant or revoke Verified Counter certification (requires dual approval)</p>
        </div>

        {/* Pending Requests */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Certification Requests</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="divide-y divide-gray-200">
              {users
                .filter(u => u.pendingRequest)
                .map((user) => (
                  <div key={user.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{user.role}</p>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Pending Approval
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-600">IC Manager</span>
                        <p className={`font-medium mt-1 ${
                          user.pendingRequest?.icManagerApproval === 'approved'
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`}>
                          {user.pendingRequest?.icManagerApproval === 'approved' ? '✓ Approved' : 'Pending'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Warehouse Manager</span>
                        <p className={`font-medium mt-1 ${
                          user.pendingRequest?.warehouseManagerApproval === 'approved'
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`}>
                          {user.pendingRequest?.warehouseManagerApproval === 'approved' ? '✓ Approved' : 'Pending'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                        Approve
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              {users.filter(u => u.pendingRequest).length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No pending certification requests
                </div>
              )}
            </div>
          </div>
        </div>

        {/* All Users */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Users</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certification Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certified Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isVerifiedCounter ? (
                        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Certified
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          Not Certified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.isVerifiedCounter && user.certifiedDate
                          ? new Date(user.certifiedDate).toLocaleDateString()
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.isVerifiedCounter ? (
                        <button className="text-red-600 hover:text-red-800">Revoke</button>
                      ) : (
                        <button className="text-blue-600 hover:text-blue-800">Request Certification</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
