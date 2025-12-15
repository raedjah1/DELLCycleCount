// ============================================================================
// DISPATCH POOL ALERT - Widget showing unassigned tasks count
// ============================================================================

'use client';

interface DispatchPoolAlertProps {
  count: number;
  onClick: () => void;
}

export function DispatchPoolAlert({ count, onClick }: DispatchPoolAlertProps) {
  if (count === 0) return null;

  return (
    <div
      onClick={onClick}
      className="bg-red-50 border-2 border-red-200 rounded-lg p-4 cursor-pointer hover:bg-red-100 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-900">Dispatch Pool Alert</h3>
            <p className="text-sm text-red-700 mt-1">
              {count} {count === 1 ? 'task' : 'tasks'} waiting for assignment
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full text-sm font-bold">
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}
