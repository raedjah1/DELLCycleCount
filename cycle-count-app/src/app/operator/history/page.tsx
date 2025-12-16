// ============================================================================
// OPERATOR HISTORY - View completed work history
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { JournalService, Journal } from '@/lib/services/journalService';
import { LoadingSpinner, EmptyState } from '@/components/widgets/operator';

interface HistoryEntry {
  id: string;
  journal_number: string;
  completed_at: string;
  total_locations: number;
  completed_locations: number;
  accuracy: number;
  warehouse: string;
  zone: string;
}

export default function OperatorHistoryPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadHistory();
  }, [dateRange]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const journals = await JournalService.getAssignedJournals(user?.id || '');
      
      // Filter completed journals and convert to history entries
      const completedJournals = journals.filter(j => j.status === 'completed');
      
      const historyEntries: HistoryEntry[] = completedJournals.map(journal => ({
        id: journal.id,
        journal_number: journal.journal_number,
        completed_at: journal.updated_at || journal.created_at,
        total_locations: journal.total_lines,
        completed_locations: journal.completed_lines,
        accuracy: journal.total_lines > 0 ? (journal.completed_lines / journal.total_lines) * 100 : 0,
        warehouse: journal.warehouse,
        zone: journal.zone
      }));
      
      // Sort by completed date (newest first)
      historyEntries.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
      
      setHistory(historyEntries);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalCompleted = history.length;
  const totalLocations = history.reduce((sum, entry) => sum + entry.completed_locations, 0);
  const avgAccuracy = history.length > 0 
    ? history.reduce((sum, entry) => sum + entry.accuracy, 0) / history.length 
    : 0;

  if (loading) {
    return <LoadingSpinner message="Loading history..." className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Work History</h1>
            <p className="text-gray-600 mt-1 text-sm">View your completed count journals and performance</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg text-xs sm:text-sm flex-shrink-0"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{totalCompleted}</p>
                <p className="text-xs text-gray-600">Journals Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{totalLocations}</p>
                <p className="text-xs text-gray-600">Locations Counted</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{avgAccuracy.toFixed(1)}%</p>
                <p className="text-xs text-gray-600">Avg Accuracy</p>
              </div>
            </div>
          </div>
        </div>

        {/* History List */}
        {history.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/operator/journals/${entry.id}`)}
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{entry.journal_number}</h3>
                      <span className="px-2 py-0.5 sm:py-1 text-xs font-medium bg-green-100 text-green-800 rounded flex-shrink-0">
                        Completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {entry.warehouse} • {entry.zone}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Completed: {formatDate(entry.completed_at)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Locations</span>
                    <p className="font-medium text-gray-900">
                      {entry.completed_locations} / {entry.total_locations}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Completion</span>
                    <p className="font-medium text-green-600">
                      {entry.accuracy.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Progress</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${entry.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/operator/journals/${entry.id}`);
                    }}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No History Found"
            description="You haven't completed any journals yet. Start counting to see your history here."
            className="bg-white rounded-xl border border-gray-200"
          />
        )}
      </div>
    </div>
  );
}
