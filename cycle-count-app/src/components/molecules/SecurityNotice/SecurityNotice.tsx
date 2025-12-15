// ============================================================================
// SECURITY NOTICE MOLECULE - Icon + Text Message
// ============================================================================
// Location: /components/molecules/SecurityNotice/
// Purpose: Reusable security/info notice with icon and messaging

interface SecurityNoticeProps {
  title?: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export function SecurityNotice({ 
  title = "✅ MODULAR ARCHITECTURE SUCCESS!",
  message = "This system uses Microsoft enterprise authentication with multi-factor authentication (MFA) for enhanced security.",
  type = "info"
}: SecurityNoticeProps) {
  
  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    info: "bg-blue-50 border-blue-200 text-blue-800", 
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };

  const iconColors = {
    success: "text-green-600",
    info: "text-blue-600",
    warning: "text-yellow-600", 
    error: "text-red-600"
  };

  const messageColors = {
    success: "text-green-600",
    info: "text-blue-600",
    warning: "text-yellow-600",
    error: "text-red-600"
  };

  return (
    <div className={`p-4 border rounded-xl ${typeStyles[type]}`}>
      <div className="flex items-start space-x-3">
        {/* Security Shield Icon */}
        <svg 
          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColors[type]}`}
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
          <p className="text-sm font-semibold">
            {title}
          </p>
          <p className={`text-sm mt-1 ${messageColors[type]}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
