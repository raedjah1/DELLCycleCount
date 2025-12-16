// ============================================================================
// DISPATCH POOL CARD WIDGET - Unassigned journal display
// ============================================================================

'use client';

import { UnassignedJournal } from '@/lib/services/leadService';

interface DispatchPoolCardProps {
  journal: UnassignedJournal;
  onAssign: (journalId: string) => void;
  onViewDetails?: (journalId: string) => void;
  className?: string;
}

export function DispatchPoolCard({ 
  journal, 
  onAssign,
  onViewDetails,
  className = '' 
}: DispatchPoolCardProps) {
  const getPriorityColor = (priority: UnassignedJournal['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: UnassignedJournal['priority']) => {
    switch (priority) {
      case 'critical': return '🔴';
      case 'urgent': return '🟠';
      default: return '⚪';
    }
  };

  const ageHours = (new Date().getTime() - new Date(journal.created_at).getTime()) / (1000 * 60 * 60);
  const ageText = ageHours < 1 
    ? `${Math.round(ageHours * 60)}m ago`
    : ageHours < 24 
    ? `${Math.round(ageHours)}h ago`
    : `${Math.round(ageHours / 24)}d ago`;

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border ${getPriorityColor(journal.priority)} ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getPriorityIcon(journal.priority)}</span>
            <h3 className="font-semibold text-gray-900">{journal.journal_number}</h3>
          </div>
          <p className="text-sm text-gray-600">
            {journal.warehouse} • {journal.zone}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(journal.priority)}`}>
          {journal.priority}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <span className="text-gray-600">Locations</span>
          <p className="font-medium text-gray-900">{journal.total_lines}</p>
        </div>
        <div>
          <span className="text-gray-600">Age</span>
          <p className="font-medium text-gray-900">{ageText}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onAssign(journal.id)}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Assign Now
        </button>
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(journal.id)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            View
          </button>
        )}
      </div>
    </div>
  );
}
