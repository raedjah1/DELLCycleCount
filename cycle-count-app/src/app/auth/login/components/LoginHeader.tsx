// ============================================================================
// LOGIN HEADER COMPONENT - Pure & Modular
// ============================================================================
// Single responsibility: Display login header with icon and welcome message

export function LoginHeader() {
  return (
    <div className="text-center mb-8">
      {/* Security Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
          />
        </svg>
      </div>

      {/* Welcome Text */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome Back
      </h1>
      <p className="text-gray-600 text-lg">
        Sign in to access your warehouse management dashboard
      </p>
    </div>
  );
}
