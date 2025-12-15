// ============================================================================
// STATUS BADGE - Reusable status badge component
// ============================================================================

'use client';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const statusColors: Record<string, { bg: string; text: string }> = {
  'Present/Available': { bg: 'bg-green-100', text: 'text-green-800' },
  'On Break': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'On Lunch': { bg: 'bg-orange-100', text: 'text-orange-800' },
  'Not Available': { bg: 'bg-gray-100', text: 'text-gray-800' },
  'Completed': { bg: 'bg-green-100', text: 'text-green-800' },
  'In Progress': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'Unstarted': { bg: 'bg-gray-100', text: 'text-gray-800' },
  'Needs Recount': { bg: 'bg-red-100', text: 'text-red-800' },
  'Pending Review': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'Explained by Transactions': { bg: 'bg-green-100', text: 'text-green-800' },
  'Certified': { bg: 'bg-green-100', text: 'text-green-800' },
  'Not Certified': { bg: 'bg-gray-100', text: 'text-gray-800' }
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm'
};

export function StatusBadge({ status, variant, size = 'md' }: StatusBadgeProps) {
  const colorMap = statusColors[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  const sizeClass = sizeClasses[size];

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${colorMap.bg} ${colorMap.text} ${sizeClass}`}>
      {status}
    </span>
  );
}
