// ============================================================================
// OPERATOR STATUS WIDGET - Shows operator's current status and quick stats
// ============================================================================

'use client';

interface OperatorStatusWidgetProps {
  status: 'Present/Available' | 'On Break' | 'On Lunch' | 'Not Available';
  todayCounts: number;
  accuracyRate: number;
  onStatusChange?: (status: string) => void;
}

export function OperatorStatusWidget({
  status,
  todayCounts,
  accuracyRate,
  onStatusChange
}: OperatorStatusWidgetProps) {
  const statusColors = {
    'Present/Available': 'bg-green-100 text-green-800',
    'On Break': 'bg-yellow-100 text-yellow-800',
    'On Lunch': 'bg-orange-100 text-orange-800',
    'Not Available': 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Status</h3>
      
      <div className="space-y-4">
        <div>
          <span className="text-sm text-gray-600">Current Status</span>
          <div className="mt-2">
            <span className={`px-3 py-1.5 text-sm font-medium rounded-lg ${statusColors[status]}`}>
              {status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <span className="text-sm text-gray-600">Today's Counts</span>
            <p className="text-2xl font-bold text-gray-900 mt-1">{todayCounts}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Accuracy Rate</span>
            <p className="text-2xl font-bold text-gray-900 mt-1">{accuracyRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
