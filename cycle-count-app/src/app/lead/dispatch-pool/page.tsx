// ============================================================================
// DISPATCH POOL SCREEN - View and assign unassigned recount tasks
// ============================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DispatchPoolPage() {
  const router = useRouter();

  // Mock data
  const [tasks] = useState([
    {
      id: '1',
      locationCode: 'Reimage.ARB.AB.01.01A',
      partNumber: 'PART-001',
      countType: 'Count 2',
      timeInPool: '2 hours',
      priority: 'High'
    },
    {
      id: '2',
      locationCode: 'Reimage.ARB.AB.01.02A',
      partNumber: 'PART-002',
      countType: 'Count 2',
      timeInPool: '1 hour',
      priority: 'Medium'
    }
  ]);

  const [availableOperators] = useState([
    { id: '1', name: 'John Smith', workload: 'Light', zone: 'ZONE-A1' },
    { id: '2', name: 'Maria Garcia', workload: 'Medium', zone: 'ZONE-A2' }
  ]);

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
          <h1 className="text-3xl font-bold text-gray-900">Dispatch Pool</h1>
          <p className="text-gray-600 mt-2">Assign unassigned recount tasks to available operators</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Unassigned Tasks</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <div key={task.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{task.locationCode}</h3>
                        <p className="text-sm text-gray-600 mt-1">Part: {task.partNumber}</p>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        {task.countType}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Time in Pool</span>
                        <p className="font-medium text-gray-900">{task.timeInPool}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Priority</span>
                        <p className="font-medium text-gray-900">{task.priority}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Assign
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Auto-assign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Available Operators */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Available Operators</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {availableOperators.map((operator) => (
                  <div key={operator.id} className="p-4">
                    <div className="font-medium text-gray-900">{operator.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {operator.workload} workload • {operator.zone}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
