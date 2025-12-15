// ============================================================================
// PROGRESS BAR - Reusable progress bar component
// ============================================================================

'use client';

interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

const colorClasses = {
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  yellow: 'bg-yellow-600',
  red: 'bg-red-600'
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3'
};

export function ProgressBar({
  value,
  max,
  showLabel = true,
  color = 'blue',
  size = 'md'
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  const colorClass = colorClasses[color];
  const sizeClass = sizeClasses[size];

  return (
    <div>
      {showLabel && (
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">
            {value} of {max} ({percentage}%)
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClass}`}>
        <div
          className={`${colorClass} ${sizeClass} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
