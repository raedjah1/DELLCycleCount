// ============================================================================
// SUBMIT BUTTON COMPONENT - Atomic & Pure
// ============================================================================
// Single responsibility: Submit button with loading states and animations

interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`
        w-full py-4 px-6 text-lg font-semibold rounded-xl text-white 
        transition-all duration-200 transform shadow-lg hover:shadow-xl
        ${isLoading 
          ? 'bg-gray-400 cursor-not-allowed opacity-75' 
          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98]'
        }
      `}
    >
      {isLoading ? (
        <span className="flex items-center justify-center space-x-2">
          {/* Loading Spinner */}
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Signing In...</span>
        </span>
      ) : (
        'Sign In to Dashboard'
      )}
    </button>
  );
}
