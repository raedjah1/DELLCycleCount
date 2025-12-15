// ============================================================================
// ACTIVE OPERATORS LIST - Widget showing operator status and workload
// ============================================================================

'use client';

interface Operator {
  id: string;
  name: string;
  currentJournal?: string;
  status: 'Present/Available' | 'On Break' | 'On Lunch' | 'Not Available';
  zone: string;
}

interface ActiveOperatorsListProps {
  operators: Operator[];
  onViewDetails: (operatorId: string) => void;
}

export function ActiveOperatorsList({ operators, onViewDetails }: ActiveOperatorsListProps) {
  const getStatusColor = (status: Operator['status']) => {
    const colors = {
      'Present/Available': 'bg-green-100 text-green-800',
      'On Break': 'bg-yellow-100 text-yellow-800',
      'On Lunch': 'bg-orange-100 text-orange-800',
      'Not Available': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors['Not Available'];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Active Operators</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {operators.map((operator) => (
          <div
            key={operator.id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium text-gray-900">{operator.name}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(operator.status)}`}>
                    {operator.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {operator.currentJournal ? (
                    <>Journal: {operator.currentJournal} • Zone: {operator.zone}</>
                  ) : (
                    <>No active journal • Zone: {operator.zone}</>
                  )}
                </div>
              </div>
              <button
                onClick={() => onViewDetails(operator.id)}
                className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
