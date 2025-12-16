// ============================================================================
// STATUS SELECTOR WIDGET - Operator availability status control
// ============================================================================

'use client';

interface StatusSelectorProps {
  status: 'Available' | 'On Break' | 'On Lunch';
  onStatusChange: (status: 'Available' | 'On Break' | 'On Lunch') => void;
  className?: string;
}

export function StatusSelector({ status, onStatusChange, className = '' }: StatusSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Status:</span>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as any)}
        className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
      >
        <option value="Available" className="text-gray-900">🟢 Available</option>
        <option value="On Break" className="text-gray-900">🟡 On Break</option>
        <option value="On Lunch" className="text-gray-900">🔴 On Lunch</option>
      </select>
    </div>
  );
}
