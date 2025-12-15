// ============================================================================
// OPERATOR STATUS SCREEN - View operator availability and workload
// ============================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OperatorStatusPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data
  const [operators] = useState([
    {
      id: '1',
      name: 'John Smith',
      shift: 'Day',
      status: 'Present/Available' as const,
      currentJournal: 'JRN-2024-001',
      linesCompletedToday: 25,
      zone: 'ZONE-A1',
      lastActivity: '2024-12-15T14:30:00Z'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      shift: 'Day',
      status: 'On Break' as const,
      currentJournal: 'JRN-2024-002',
      linesCompletedToday: 18,
      zone: 'ZONE-A2',
      lastActivity: '2024-12-15T14:00:00Z'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      shift: 'Night',
      status: 'On Lunch' as const,
      currentJournal: null,
      linesCompletedToday: 12,
      zone: 'ZONE-B1',
      lastActivity: '2024-12-15T13:45:00Z'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      shift: 'Day',
      status: 'Present/Available' as const,
      currentJournal: null,
      linesCompletedToday: 0,
      zone: 'ZONE-C1',
      lastActivity: '2024-12-15T08:00:00Z'
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Present/Available': 'bg-green-100 text-green-800',
      'On Break': 'bg-yellow-100 text-yellow-800',
      'On Lunch': 'bg-orange-100 text-orange-800',
      'Not Available': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors['Not Available'];
  };

  const filteredOperators = filterStatus === 'all'
    ? operators
    : operators.filter(op => op.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/lead/dashboard')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Operator Status</h1>
              <p className="text-gray-600 mt-2">View operator availability and workload</p>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="all">All Status</option>
                <option value="Present/Available">Available</option>
                <option value="On Break">On Break</option>
                <option value="On Lunch">On Lunch</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOperators.map((operator) => (
            <div key={operator.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{operator.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{operator.shift} Shift</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(operator.status)}`}>
                  {operator.status}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Zone</span>
                  <p className="font-medium text-gray-900">{operator.zone}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Current Journal</span>
                  <p className="font-medium text-gray-900">
                    {operator.currentJournal || 'None'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Lines Completed Today</span>
                  <p className="text-2xl font-bold text-blue-600">{operator.linesCompletedToday}</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Last Activity: {new Date(operator.lastActivity).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOperators.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No operators found with the selected status</p>
          </div>
        )}
      </div>
    </div>
  );
}
