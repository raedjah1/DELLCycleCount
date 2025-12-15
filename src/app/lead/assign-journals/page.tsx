// ============================================================================
// JOURNAL ASSIGNMENT SCREEN - Assign or reassign journals to operators
// ============================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JournalAssignmentPage() {
  const router = useRouter();
  const [selectedJournal, setSelectedJournal] = useState<string | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);

  // Mock data
  const [availableJournals] = useState([
    {
      id: 'JRN-2024-004',
      zone: 'ZONE-A1',
      lineCount: 30,
      createdDate: '2024-12-15T08:00:00Z',
      warehouse: 'Reimage'
    },
    {
      id: 'JRN-2024-005',
      zone: 'ZONE-A2',
      lineCount: 30,
      createdDate: '2024-12-15T08:00:00Z',
      warehouse: 'Reimage'
    },
    {
      id: 'JRN-2024-006',
      zone: 'ZONE-B1',
      lineCount: 30,
      createdDate: '2024-12-15T08:00:00Z',
      warehouse: 'Reimage'
    }
  ]);

  const [operators] = useState([
    {
      id: '1',
      name: 'John Smith',
      status: 'Present/Available' as const,
      currentJournal: null,
      zone: 'ZONE-A1'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      status: 'Present/Available' as const,
      currentJournal: 'JRN-2024-001',
      zone: 'ZONE-A2'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      status: 'On Break' as const,
      currentJournal: null,
      zone: 'ZONE-B1'
    }
  ]);

  const handleAssign = () => {
    if (selectedJournal && selectedOperator) {
      // TODO: Assign journal logic
      console.log('Assign journal:', selectedJournal, 'to operator:', selectedOperator);
      alert('Journal assigned successfully!');
      setSelectedJournal(null);
      setSelectedOperator(null);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Assign Journals</h1>
          <p className="text-gray-600 mt-2">Assign or reassign journals to operators</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Journals */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Available Journals</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {availableJournals.map((journal) => (
                  <button
                    key={journal.id}
                    onClick={() => setSelectedJournal(journal.id)}
                    className={`w-full p-6 text-left hover:bg-gray-50 transition-colors ${
                      selectedJournal === journal.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900">Journal #{journal.id}</span>
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                            {journal.zone}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {journal.lineCount} lines • {journal.warehouse}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Created: {new Date(journal.createdDate).toLocaleDateString()}
                        </div>
                      </div>
                      {selectedJournal === journal.id && (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Operators */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Operators</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {operators.map((operator) => {
                  const isAvailable = operator.status === 'Present/Available';
                  return (
                    <button
                      key={operator.id}
                      onClick={() => isAvailable && setSelectedOperator(operator.id)}
                      disabled={!isAvailable}
                      className={`w-full p-6 text-left transition-colors ${
                        !isAvailable
                          ? 'opacity-50 cursor-not-allowed'
                          : selectedOperator === operator.id
                          ? 'bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">{operator.name}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {operator.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Zone: {operator.zone}
                          </div>
                          {operator.currentJournal && (
                            <div className="text-xs text-orange-600 mt-1">
                              Current: {operator.currentJournal}
                            </div>
                          )}
                        </div>
                        {selectedOperator === operator.id && (
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assignment Action */}
            {selectedJournal && selectedOperator && (
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h3>
                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-sm text-gray-600">Journal</span>
                    <p className="font-medium text-gray-900">
                      {availableJournals.find(j => j.id === selectedJournal)?.id}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Operator</span>
                    <p className="font-medium text-gray-900">
                      {operators.find(o => o.id === selectedOperator)?.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAssign}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Assign Journal
                  </button>
                  <button
                    onClick={() => {
                      setSelectedJournal(null);
                      setSelectedOperator(null);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
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
