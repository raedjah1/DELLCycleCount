// ============================================================================
// LEAD DASHBOARD - Overview of work assignment and dispatch pool
// ============================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DispatchPoolAlert } from '@/components/widgets/lead/DispatchPoolAlert';
import { ActiveOperatorsList } from '@/components/widgets/lead/ActiveOperatorsList';

export default function LeadDashboardPage() {
  const router = useRouter();

  // Mock data
  const [dispatchPoolCount] = useState(5);
  const [operators] = useState([
    {
      id: '1',
      name: 'John Smith',
      currentJournal: 'JRN-2024-001',
      status: 'Present/Available' as const,
      zone: 'ZONE-A1'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      currentJournal: 'JRN-2024-002',
      status: 'On Break' as const,
      zone: 'ZONE-A2'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      status: 'On Lunch' as const,
      zone: 'ZONE-B1'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lead Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage work assignment and dispatch pool</p>
        </div>

        <div className="space-y-6">
          {/* Dispatch Pool Alert */}
          <DispatchPoolAlert
            count={dispatchPoolCount}
            onClick={() => router.push('/lead/dispatch-pool')}
          />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/lead/dispatch-pool')}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Dispatch Pool</h3>
              </div>
              <p className="text-sm text-gray-600 mt-2">Manage unassigned tasks</p>
            </button>

            <button
              onClick={() => router.push('/lead/assign-journals')}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Assign Work</h3>
              </div>
              <p className="text-sm text-gray-600 mt-2">Assign journals to operators</p>
            </button>

            <button
              onClick={() => router.push('/lead/operator-status')}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Operator Status</h3>
              </div>
              <p className="text-sm text-gray-600 mt-2">View operator availability</p>
            </button>
          </div>

          {/* Active Operators */}
          <ActiveOperatorsList
            operators={operators}
            onViewDetails={(id) => router.push(`/lead/operators/${id}`)}
          />
        </div>
      </div>
    </div>
  );
}