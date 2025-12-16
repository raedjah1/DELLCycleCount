// ============================================================================
// SUBMIT BUTTON WIDGET - Count submission with loading state
// ============================================================================

'use client';

interface SubmitButtonProps {
  onSubmit: () => void;
  disabled: boolean;
  loading: boolean;
  label: string;
  className?: string;
}

export function SubmitButton({ 
  onSubmit, 
  disabled, 
  loading, 
  label,
  className = '' 
}: SubmitButtonProps) {
  return (
    <button
      onClick={onSubmit}
      disabled={disabled || loading}
      className={`w-full py-4 rounded-lg font-medium transition-colors ${
        disabled || loading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
      } ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
          Submitting...
        </div>
      ) : (
        label
      )}
    </button>
  );
}
