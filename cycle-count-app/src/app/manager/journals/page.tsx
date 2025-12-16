// ============================================================================
// JOURNALS PAGE - View all journals and their status
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JournalService, Journal } from '@/lib/services/journalService';
import { JournalCard } from '@/components/widgets/operator/JournalCard/JournalCard';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';
import { EmptyState } from '@/components/widgets/operator/EmptyState/EmptyState';

export default function ManagerJournalsPage() {
  const router = useRouter();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'assigned' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    loadJournals();
  }, [filter]);

  const loadJournals = async () => {
    try {
      setLoading(true);
      const allJournals = await JournalService.getAllJournals();

      let filtered = allJournals;
      if (filter === 'assigned') {
        filtered = filtered.filter(j => j.status === 'assigned');
      } else if (filter === 'in_progress') {
        filtered = filtered.filter(j => j.status === 'in_progress');
      } else if (filter === 'completed') {
        filtered = filtered.filter(j => j.status === 'completed');
      }

      setJournals(filtered);
    } catch (error) {
      console.error('Failed to load journals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenJournal = (journalId: string) => {
    router.push(`/manager/journals/${journalId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner message="Loading journals..." className="min-h-screen" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Journals</h1>
          <p className="text-gray-600">View and monitor all counting journals</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All ({journals.length})
            </button>
            <button
              onClick={() => setFilter('assigned')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'assigned'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Assigned
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'in_progress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Journals Grid */}
        {journals.length > 0 ? (
          <div className="space-y-4">
            {journals.map((journal) => (
              <JournalCard
                key={journal.id}
                journal={journal}
                onOpenJournal={handleOpenJournal}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Journals"
            description="No journals found for the selected filters."
            className="bg-white rounded-xl border border-gray-200"
          />
        )}
      </div>
    </div>
  );
}
