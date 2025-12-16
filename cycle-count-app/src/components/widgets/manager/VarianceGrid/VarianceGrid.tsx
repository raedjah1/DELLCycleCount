// ============================================================================
// VARIANCE GRID WIDGET - Grid of variance cards
// ============================================================================

'use client';

import { Variance } from '@/lib/services/managerService';
import { VarianceCard } from '../VarianceCard/VarianceCard';

interface VarianceGridProps {
  variances: Variance[];
  selectedVarianceId?: string;
  onSelectVariance: (variance: Variance) => void;
  className?: string;
}

export function VarianceGrid({ 
  variances, 
  selectedVarianceId,
  onSelectVariance,
  className = '' 
}: VarianceGridProps) {
  if (variances.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 p-4 bg-gray-100 rounded-full">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500">No variances to review</p>
        <p className="text-sm text-gray-400 mt-1">All counts match expected quantities</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {variances.map((variance) => (
        <VarianceCard
          key={variance.id}
          variance={variance}
          onSelect={onSelectVariance}
          isSelected={selectedVarianceId === variance.id}
        />
      ))}
    </div>
  );
}
