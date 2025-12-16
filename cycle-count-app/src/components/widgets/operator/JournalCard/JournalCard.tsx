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
      className={`bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={() => onOpenJournal(journal.id)}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{journal.journal_number}</h3>
          <p className="text-sm text-gray-600 mt-0.5">
            {journal.warehouse} • {journal.zone}
          </p>
        </div>
        <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 ${getStatusColor(journal.status)}`}>
          {formatStatus(journal.status)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3 sm:mb-4">
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{journal.completed_lines} / {journal.total_lines} locations</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
          <div
            className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
          Assigned {new Date(journal.assigned_date).toLocaleDateString()}
        </div>
        <button 
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onOpenJournal(journal.id);
          }}
        >
          {journal.status === 'assigned' ? 'Start' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
