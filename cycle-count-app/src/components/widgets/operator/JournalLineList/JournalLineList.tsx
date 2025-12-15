// ============================================================================
// JOURNAL LINE LIST - Widget for displaying journal lines with status
// ============================================================================

'use client';

interface JournalLine {
  id: string;
  locationCode: string;
  partNumber: string;
  expectedQty: number;
  status: 'Unstarted' | 'In Progress' | 'Completed' | 'Needs Recount';
  countValue?: number;
}

interface JournalLineListProps {
  lines: JournalLine[];
  onSelectLine: (lineId: string) => void;
}

export function JournalLineList({ lines, onSelectLine }: JournalLineListProps) {
  const getStatusBadge = (status: JournalLine['status']) => {
    const styles = {
      'Unstarted': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'Needs Recount': 'bg-red-100 text-red-800'
    };
    return styles[status] || styles.Unstarted;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Journal Lines</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {lines.map((line) => (
          <button
            key={line.id}
            onClick={() => onSelectLine(line.id)}
            className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{line.locationCode}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadge(line.status)}`}>
                    {line.status}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Part: {line.partNumber} • Expected: {line.expectedQty}
                  {line.countValue !== undefined && ` • Counted: ${line.countValue}`}
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
