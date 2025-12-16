// ============================================================================
// REVIEW CYCLE SELECTOR WIDGET - Select review cycle for count plans
// ============================================================================

'use client';

import { ReviewCycle } from '@/lib/services/countPlanService';

interface ReviewCycleSelectorProps {
  cycles: ReviewCycle[];
  selectedCycleId: string | null;
  onCycleChange: (cycleId: string | null) => void;
  onCreateNew?: () => void;
  className?: string;
}

export function ReviewCycleSelector({
  cycles,
  selectedCycleId,
  onCycleChange,
  onCreateNew,
  className = ''
}: ReviewCycleSelectorProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <label className="text-sm font-medium text-gray-700">Review Cycle:</label>
      <select
        value={selectedCycleId || ''}
        onChange={(e) => onCycleChange(e.target.value || null)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <option value="">All Cycles</option>
        {cycles.map((cycle) => (
          <option key={cycle.id} value={cycle.id}>
            {new Date(cycle.cycle_date).toLocaleDateString()} ({cycle.status})
          </option>
        ))}
      </select>
      {onCreateNew && (
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          New Cycle
        </button>
      )}
    </div>
  );
}
