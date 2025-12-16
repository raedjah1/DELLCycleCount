// ============================================================================
// JOURNAL CARD WIDGET - Individual journal display with progress
// ============================================================================

'use client';

import { Journal } from '@/lib/services/journalService';

interface JournalCardProps {
  journal: Journal;
  onOpenJournal: (journalId: string) => void;
  className?: string;
}

export function JournalCard({ journal, onOpenJournal, className = '' }: JournalCardProps) {
  const getStatusColor = (status: Journal['status']) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = () => {
    return journal.total_lines > 0 ? (journal.completed_lines / journal.total_lines) * 100 : 0;
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={() => onOpenJournal(journal.id)}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{journal.journal_number}</h3>
          <p className="text-sm text-gray-600">
            {journal.warehouse} • {journal.zone}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(journal.status)}`}>
          {formatStatus(journal.status)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{journal.completed_lines} / {journal.total_lines} locations</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Assigned {new Date(journal.assigned_date).toLocaleDateString()}
        </div>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onOpenJournal(journal.id);
          }}
        >
          {journal.status === 'assigned' ? 'Start Counting' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
