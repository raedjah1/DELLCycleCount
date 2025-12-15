// ============================================================================
// ACTIVE JOURNAL CARD - Widget for displaying operator's active journal
// ============================================================================

'use client';

interface ActiveJournalCardProps {
  journal: {
    id: string;
    zone: string;
    totalLines: number;
    completedLines: number;
    warehouse: string;
    assignedDate: string;
  };
  onContinue: () => void;
}

export function ActiveJournalCard({ journal, onContinue }: ActiveJournalCardProps) {
  const progress = journal.totalLines > 0 
    ? Math.round((journal.completedLines / journal.totalLines) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Active Journal</h3>
          <p className="text-sm text-gray-500 mt-1">Journal #{journal.id}</p>
        </div>
        <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          {journal.zone}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">
              {journal.completedLines} of {journal.totalLines} lines
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Warehouse</span>
            <p className="font-medium text-gray-900 mt-1">{journal.warehouse}</p>
          </div>
          <div>
            <span className="text-gray-500">Assigned</span>
            <p className="font-medium text-gray-900 mt-1">
              {new Date(journal.assignedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Continue Journal
        </button>
      </div>
    </div>
  );
}
