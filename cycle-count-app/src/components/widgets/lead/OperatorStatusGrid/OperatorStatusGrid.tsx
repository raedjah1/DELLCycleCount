// ============================================================================
// OPERATOR STATUS GRID WIDGET - Grid of operator status cards
// ============================================================================

'use client';

import { OperatorStatus } from '@/lib/services/leadService';
import { OperatorStatusCard } from '../OperatorStatusCard/OperatorStatusCard';

interface OperatorStatusGridProps {
  operators: OperatorStatus[];
  onAssignWork?: (operatorId: string) => void;
  onViewDetails?: (operatorId: string) => void;
  filter?: 'all' | 'available' | 'working' | 'on_break';
  className?: string;
}

export function OperatorStatusGrid({ 
  operators, 
  onAssignWork,
  onViewDetails,
  filter = 'all',
  className = '' 
}: OperatorStatusGridProps) {
  const filteredOperators = operators.filter(op => {
    if (filter === 'all') return true;
    if (filter === 'available') return op.status === 'Available';
    if (filter === 'working') return op.status === 'Working';
    if (filter === 'on_break') return op.status === 'On Break' || op.status === 'On Lunch';
    return true;
  });

  if (filteredOperators.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No operators found</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {filteredOperators.map((operator) => (
        <OperatorStatusCard
          key={operator.id}
          operator={operator}
          onAssignWork={onAssignWork}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
