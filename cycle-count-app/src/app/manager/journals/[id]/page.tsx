// ============================================================================
// JOURNAL DETAIL PAGE - Manager view of journal with all lines
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { JournalService, Journal, JournalLine } from '@/lib/services/journalService';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';
import { EmptyState } from '@/components/widgets/operator/EmptyState/EmptyState';

export default function ManagerJournalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [journal, setJournal] = useState<(Journal & { lines: JournalLine[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unstarted' | 'in_progress' | 'completed' | 'needs_recount'>('all');

  const journalId = params.id as string;

  useEffect(() => {
    if (journalId) {
      loadJournal();
    }
  }, [journalId]);

  const loadJournal = async () => {
    try {
      setLoading(true);
      const data = await JournalService.getJournalWithLines(journalId);
      setJournal(data);
    } catch (error) {
      console.error('Failed to load journal:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: JournalLine['status']) => {
    switch (status) {
      case 'Unstarted': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Needs Recount': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLines = journal?.lines.filter(line => {
    if (filter === 'all') return true;
    if (filter === 'needs_recount') return line.status === 'Needs Recount';
    return line.status.toLowerCase().replace(' ', '_') === filter;
  }) || [];

  const progressPercentage = journal ? (journal.completed_lines / journal.total_lines) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner message="Loading journal..." className="min-h-screen" />
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Journal Not Found</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <button
            onClick={() => router.push('/manager/journals')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Journals
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{journal.journal_number}</h1>
          <p className="text-gray-600">
            {journal.warehouse} • {journal.zone} • {journal.total_lines} locations
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{journal.completed_lines} / {journal.total_lines} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All ({journal.lines.length})
            </button>
            <button
              onClick={() => setFilter('unstarted')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unstarted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Pending ({journal.lines.filter(l => l.status === 'Unstarted').length})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'in_progress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              In Progress ({journal.lines.filter(l => l.status === 'In Progress').length})
            </button>
            <button
              onClick={() => setFilter('needs_recount')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'needs_recount'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Needs Recount ({journal.lines.filter(l => l.status === 'Needs Recount').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Completed ({journal.lines.filter(l => l.status === 'Completed').length})
            </button>
          </div>
        </div>

        {/* Journal Lines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLines.map((line) => (
                  <tr key={line.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{line.sequence_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {line.location.location_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {line.item.part_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {line.expected_qty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(line.status)}`}>
                        {line.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => router.push(`/manager/variance-review`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Variance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredLines.length === 0 && (
          <EmptyState
            title="No Lines Found"
            description="No journal lines match your current filter."
            className="bg-white rounded-xl border border-gray-200 mt-6"
          />
        )}
      </div>
    </div>
  );
}
