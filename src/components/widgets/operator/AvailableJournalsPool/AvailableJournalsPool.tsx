// ============================================================================
// AVAILABLE JOURNALS POOL - Widget for claim-based journal assignment
// ============================================================================

'use client';

interface Journal {
  id: string;
  zone: string;
  totalLines: number;
  warehouse: string;
  createdDate: string;
}

interface AvailableJournalsPoolProps {
  journals: Journal[];
  onClaim: (journalId: string) => void;
}

export function AvailableJournalsPool({ journals, onClaim }: AvailableJournalsPoolProps) {
  if (journals.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500 text-center">No journals available in the pool</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Journals</h3>
      <div className="space-y-3">
        {journals.map((journal) => (
          <div
            key={journal.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">Journal #{journal.id}</span>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                  {journal.zone}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {journal.totalLines} lines • {journal.warehouse}
              </div>
            </div>
            <button
              onClick={() => onClaim(journal.id)}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Claim
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
