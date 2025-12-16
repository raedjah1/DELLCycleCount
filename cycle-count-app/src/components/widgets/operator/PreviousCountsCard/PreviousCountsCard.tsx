// ============================================================================
// PREVIOUS COUNTS CARD WIDGET - Display historical count submissions
// ============================================================================

'use client';

import { CountSubmission } from '@/lib/services/journalService';

interface PreviousCountsCardProps {
  submissions: CountSubmission[];
  className?: string;
}

export function PreviousCountsCard({ submissions, className = '' }: PreviousCountsCardProps) {
  if (submissions.length === 0) return null;

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-3">Previous Counts</h3>
      <div className="space-y-2">
        {submissions.map((submission) => (
          <div key={submission.id} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{submission.count_type}:</span>
            <span className="font-medium">{submission.count_value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
