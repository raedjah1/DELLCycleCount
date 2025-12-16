// ============================================================================
// COMPACT JOURNAL LIST WIDGET - Recently completed journals display
// ============================================================================

'use client';

import { Journal } from '@/lib/services/journalService';

interface CompactJournalListProps {
  journals: Journal[];
  title: string;
  maxItems?: number;
  className?: string;
}

export function CompactJournalList({ 
  journals, 
  title, 
  maxItems = 3, 
  className = '' 
}: CompactJournalListProps) {
  const displayJournals = journals.slice(0, maxItems);

  if (journals.length === 0) return null;

  return (
    <div className={className}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-3">
        {displayJournals.map((journal) => (
          <div
            key={journal.id}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{journal.journal_number}</h4>
                <p className="text-sm text-gray-600">
                  {journal.warehouse} • {journal.zone} • {journal.total_lines} locations
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Completed
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
