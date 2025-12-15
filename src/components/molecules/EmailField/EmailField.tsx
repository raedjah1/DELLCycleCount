// ============================================================================
// EMAIL FIELD MOLECULE - Combines Input + Icon + Label
// ============================================================================
// Location: /components/molecules/EmailField/
// Purpose: Email input with validation and visual feedback

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export function EmailField({ value, onChange, disabled = false, error }: EmailFieldProps) {
  return (
    <div>
      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
        Email Address
      </label>
      <div className="relative">
        {/* Email Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" 
            />
          </svg>
        </div>
        
        {/* Email Input */}
        <input
          id="email"
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          disabled={disabled}
          className={`
            w-full pl-12 pr-4 py-4 border rounded-xl text-gray-900 placeholder-gray-500 
            focus:outline-none focus:ring-2 transition-all duration-200 
            bg-white/70 backdrop-blur-sm hover:border-gray-400 disabled:opacity-50
            ${error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
          `}
          placeholder="Enter your email address"
        />
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
