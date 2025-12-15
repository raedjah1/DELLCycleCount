// ============================================================================
// SECURITY NOTICE COMPONENT - Atomic & Pure
// ============================================================================
// Single responsibility: Display enterprise security information

export function SecurityNotice() {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <div className="flex items-start space-x-3">
        {/* Security Shield Icon */}
        <svg 
          className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
          />
        </svg>
        
        {/* Security Message */}
        <div>
          <p className="text-sm font-semibold text-blue-800">
            ✅ MODULAR ARCHITECTURE SUCCESS!
          </p>
          <p className="text-sm text-blue-600 mt-1">
            This system uses Microsoft enterprise authentication with multi-factor authentication (MFA) for enhanced security.
          </p>
        </div>
      </div>
    </div>
  );
}
