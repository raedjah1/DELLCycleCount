// ============================================================================
// JOURNAL DETAIL - Navigate through counting locations
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { JournalService, Journal, JournalLine } from '@/lib/services/journalService';

export default function JournalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useCurrentUser();
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

  const getStatusIcon = (status: JournalLine['status']) => {
    switch (status) {
      case 'Unstarted': return '⚪';
      case 'In Progress': return '🔵';
      case 'Completed': return '✅';
      case 'Needs Recount': return '🟡';
      default: return '⚪';
    }
  };

  const getNextUnstartedLine = () => {
    if (!journal) return null;
    return journal.lines.find(line => line.status === 'Unstarted') || 
           journal.lines.find(line => line.status === 'Needs Recount') ||
           journal.lines.find(line => line.status === 'In Progress');
  };

  const filteredLines = journal?.lines.filter(line => {
    if (filter === 'all') return true;
    if (filter === 'needs_recount') return line.status === 'Needs Recount';
    return line.status.toLowerCase().replace(' ', '_') === filter;
  }) || [];

  const progressPercentage = journal ? (journal.completed_lines / journal.total_lines) * 100 : 0;
  const nextLine = getNextUnstartedLine();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading journal...</p>
        </div>
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{journal.journal_number}</h1>
              <p className="text-gray-600">
                {journal.warehouse} • {journal.zone} • {journal.total_lines} locations
              </p>
            </div>

            {/* Quick Continue Button */}
            {nextLine && (
              <button
                onClick={() => router.push(`/operator/journals/${journal.id}/count/${nextLine.id}`)}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                {nextLine.status === 'Unstarted' ? 'Start Next' : 'Continue'}
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
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
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              All ({journal.lines.length})
            </button>
            <button
              onClick={() => setFilter('unstarted')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unstarted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Pending ({journal.lines.filter(l => l.status === 'Unstarted').length})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'in_progress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              In Progress ({journal.lines.filter(l => l.status === 'In Progress').length})
            </button>
            <button
              onClick={() => setFilter('needs_recount')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'needs_recount'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Needs Recount ({journal.lines.filter(l => l.status === 'Needs Recount').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Completed ({journal.lines.filter(l => l.status === 'Completed').length})
            </button>
          </div>
        </div>

        {/* Journal Lines */}
        <div className="space-y-3">
          {filteredLines.map((line) => (
            <div
              key={line.id}
              className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border hover:shadow-md transition-all cursor-pointer ${
                line.status === 'Needs Recount' ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
              }`}
              onClick={() => router.push(`/operator/journals/${journal.id}/count/${line.id}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getStatusIcon(line.status)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-semibold text-gray-900">#{line.sequence_number}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(line.status)}`}>
                        {line.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{line.location.location_code}</p>
                  </div>
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Part Number</span>
                  <p className="font-medium text-gray-900">{line.item.part_no}</p>
                </div>
                <div>
                  <span className="text-gray-600">Expected Qty</span>
                  <p className="font-medium text-gray-900">{line.expected_qty}</p>
                </div>
                <div>
                  <span className="text-gray-600">Location</span>
                  <p className="font-medium text-gray-900 truncate">
                    {line.location.building}-{line.location.bay}-{line.location.row}-{line.location.tier}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Serial Tracking</span>
                  <p className="font-medium text-gray-900">
                    {line.item.serial_flag === 'Y' ? '✓ Required' : '✗ No'}
                  </p>
                </div>
              </div>

              {line.item.description && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600 truncate">{line.item.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredLines.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 p-4 bg-gray-100 rounded-full">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Lines Found</h3>
            <p className="text-gray-600">No journal lines match your current filter.</p>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      {nextLine && (
        <div className="fixed bottom-6 right-6 sm:hidden">
          <button
            onClick={() => router.push(`/operator/journals/${journal.id}/count/${nextLine.id}`)}
            className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}