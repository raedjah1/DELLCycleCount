// ============================================================================
// JOURNAL DETAIL SCREEN - View journal progress and navigate to count lines
// ============================================================================

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { JournalLineList } from '@/components/widgets/operator/JournalLineList';

export default function JournalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const journalId = params.id as string;

  // Mock data - will be replaced with real data from API
  const [journal] = useState({
    id: journalId,
    zone: 'ZONE-A1',
    warehouse: 'Reimage',
    assignedDate: '2024-12-15T08:00:00Z',
    totalLines: 30,
    completedLines: 12
  });

  const [lines] = useState([
    {
      id: '1',
      locationCode: 'Reimage.ARB.AB.01.01A',
      partNumber: 'PART-001',
      expectedQty: 10,
      status: 'Completed' as const,
      countValue: 10
    },
    {
      id: '2',
      locationCode: 'Reimage.ARB.AB.01.02A',
      partNumber: 'PART-002',
      expectedQty: 5,
      status: 'In Progress' as const,
      countValue: 5
    },
    {
      id: '3',
      locationCode: 'Reimage.ARB.AB.01.03A',
      partNumber: 'PART-003',
      expectedQty: 8,
      status: 'Unstarted' as const
    }
  ]);

  const nextIncompleteLine = lines.find(line => 
    line.status === 'Unstarted' || line.status === 'In Progress'
  );

  const handleStartNext = () => {
    if (nextIncompleteLine) {
      router.push(`/operator/journals/${journalId}/count/${nextIncompleteLine.id}`);
    }
  };

  const handleSelectLine = (lineId: string) => {
    router.push(`/operator/journals/${journalId}/count/${lineId}`);
  };

  const progress = journal.totalLines > 0 
    ? Math.round((journal.completedLines / journal.totalLines) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/operator/dashboard')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Journal #{journal.id}</h1>
              <p className="text-gray-600 mt-2">
                {journal.zone} • {journal.warehouse}
              </p>
            </div>
            <span className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 rounded-lg">
              {journal.completedLines} of {journal.totalLines} completed
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium text-gray-900">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Quick Action */}
        {nextIncompleteLine && (
          <div className="mb-6">
            <button
              onClick={handleStartNext}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Start Next Line
            </button>
          </div>
        )}

        {/* Journal Lines */}
        <JournalLineList lines={lines} onSelectLine={handleSelectLine} />
      </div>
    </div>
  );
}
