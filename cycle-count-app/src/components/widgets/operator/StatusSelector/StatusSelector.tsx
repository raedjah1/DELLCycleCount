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
      <span className="text-sm text-gray-600 hidden sm:inline">Status:</span>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as any)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <option value="Available">🟢 Available</option>
        <option value="On Break">🟡 On Break</option>
        <option value="On Lunch">🔴 On Lunch</option>
      </select>
    </div>
  );
}
