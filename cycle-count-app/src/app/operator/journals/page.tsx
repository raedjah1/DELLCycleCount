// ============================================================================
// OPERATOR JOURNALS LIST - View all assigned journals
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { JournalService, Journal } from '@/lib/services/journalService';
import { CompactJournalList, LoadingSpinner, EmptyState } from '@/components/widgets/operator';
import { StatusSelector } from '@/components/widgets/operator/StatusSelector/StatusSelector';

export default function OperatorJournalsPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'assigned' | 'in_progress' | 'completed'>('all');
  const [operatorStatus, setOperatorStatus] = useState<'Available' | 'On Break' | 'On Lunch'>('Available');
  
  const handleStatusChange = (status: 'Available' | 'On Break' | 'On Lunch') => {
    setOperatorStatus(status);
  };

  useEffect(() => {
    loadJournals();
  }, [filter]);

  const loadJournals = async () => {
    try {
      setLoading(true);
      const data = await JournalService.getAssignedJournals(user?.id || '');
      setJournals(data);
    } catch (error) {
      console.error('Failed to load journals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJournals = journals.filter(journal => {
    if (filter === 'all') return true;
    if (filter === 'assigned') return journal.status === 'assigned';
    if (filter === 'in_progress') return journal.status === 'in_progress';
    if (filter === 'completed') return journal.status === 'completed';
    return true;
  });

  if (loading) {
    return <LoadingSpinner message="Loading your journals..." className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Journals</h1>
          <p className="text-gray-600 mt-1 text-sm">View and manage your assigned count journals</p>
        </div>

        {/* Status Selector */}
        <div className="mb-4 sm:mb-6">
          <StatusSelector
            status={operatorStatus}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* Filters */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All ({journals.length})
            </button>
            <button
              onClick={() => setFilter('assigned')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === 'assigned'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Assigned ({journals.filter(j => j.status === 'assigned').length})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === 'in_progress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              In Progress ({journals.filter(j => j.status === 'in_progress').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Completed ({journals.filter(j => j.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Journals List */}
        {filteredJournals.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {filteredJournals.map((journal) => (
              <div
                key={journal.id}
                className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/operator/journals/${journal.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{journal.journal_number}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                      {journal.warehouse} • {journal.zone} • {journal.total_lines} locations
                    </p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded flex-shrink-0 ${
                        journal.status === 'completed' ? 'bg-green-100 text-green-800' :
                        journal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {journal.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {journal.completed_lines} / {journal.total_lines} done
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg sm:text-2xl">📋</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Journals Found"
            description="You don't have any journals matching the current filter."
            className="bg-white rounded-xl border border-gray-200"
          />
        )}
      </div>
    </div>
  );
}
