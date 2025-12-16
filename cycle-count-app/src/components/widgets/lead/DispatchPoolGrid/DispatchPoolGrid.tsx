// ============================================================================
// DISPATCH POOL GRID WIDGET - Grid of unassigned journals
// ============================================================================

'use client';

import { UnassignedJournal } from '@/lib/services/leadService';
import { DispatchPoolCard } from '../DispatchPoolCard/DispatchPoolCard';

interface DispatchPoolGridProps {
  journals: UnassignedJournal[];
  onAssign: (journalId: string) => void;
  onViewDetails?: (journalId: string) => void;
  filter?: 'all' | 'urgent' | 'critical';
  className?: string;
}

export function DispatchPoolGrid({ 
  journals, 
  onAssign,
  onViewDetails,
  filter = 'all',
  className = '' 
}: DispatchPoolGridProps) {
  const filteredJournals = journals.filter(journal => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return journal.priority === 'urgent' || journal.priority === 'critical';
    if (filter === 'critical') return journal.priority === 'critical';
    return true;
  });

  // Sort by priority (critical first)
  const sortedJournals = [...filteredJournals].sort((a, b) => {
    const priorityOrder = { critical: 0, urgent: 1, normal: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (sortedJournals.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 p-4 bg-gray-100 rounded-full">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500">No unassigned journals</p>
        <p className="text-sm text-gray-400 mt-1">All work is assigned!</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {sortedJournals.map((journal) => (
        <DispatchPoolCard
          key={journal.id}
          journal={journal}
          onAssign={onAssign}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
