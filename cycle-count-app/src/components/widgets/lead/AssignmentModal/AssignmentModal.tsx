// ============================================================================
// ASSIGNMENT MODAL WIDGET - Assign journal to operator
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { OperatorStatus } from '@/lib/services/leadService';
import { LeadService } from '@/lib/services/leadService';

interface AssignmentModalProps {
  journalId: string;
  journalNumber: string;
  operators: OperatorStatus[];
  onClose: () => void;
  onAssigned: () => void;
  className?: string;
}

export function AssignmentModal({
  journalId,
  journalNumber,
  operators,
  onClose,
  onAssigned,
  className = ''
}: AssignmentModalProps) {
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableOperators = operators.filter(op => op.status === 'Available' || op.status === 'Working');

  const handleAssign = async () => {
    if (!selectedOperatorId) {
      setError('Please select an operator');
      return;
    }

    try {
      setAssigning(true);
      setError(null);
      await LeadService.assignJournal(journalId, selectedOperatorId);
      onAssigned();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to assign journal');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${className}`}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Assign Journal</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">Journal:</p>
          <p className="font-medium text-gray-900">{journalNumber}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Operator
          </label>
          <select
            value={selectedOperatorId}
            onChange={(e) => setSelectedOperatorId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose an operator...</option>
            {availableOperators.map((operator) => (
              <option key={operator.id} value={operator.id}>
                {operator.name} ({operator.status}) - {operator.activeJournals} active journals
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={assigning || !selectedOperatorId}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              assigning || !selectedOperatorId
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {assigning ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
}
