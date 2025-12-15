// ============================================================================
// MICROSOFT SIGN-IN BUTTON ATOM - REAL MICROSOFT AUTHENTICATION
// ============================================================================
// Location: /components/atoms/MicrosoftSignInButton/
// Purpose: Real Microsoft authentication button with MSAL integration

'use client';

import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/lib/auth/msalConfig';

interface MicrosoftSignInButtonProps {
  onSuccess?: (account: any) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  text?: string;
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function MicrosoftSignInButton({
  onSuccess,
  onError,
  disabled = false,
  text = "Sign in with Microsoft",
  variant = 'primary',
  size = 'lg'
}: MicrosoftSignInButtonProps) {
  const { instance, accounts } = useMsal();

  const handleMicrosoftSignIn = async () => {
    try {
      // Check if Azure is configured
      const clientId = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID;
      if (!clientId || clientId === "development-mode") {
        // Show configuration instructions
        alert(`🔧 AZURE CONFIGURATION REQUIRED\n\nTo enable real Microsoft authentication:\n\n1. Go to Azure Portal (portal.azure.com)\n2. Create an App Registration\n3. Set environment variables\n4. See AZURE_SETUP_GUIDE.md for details`);
        return;
      }

      console.log('🔄 Starting Microsoft Authentication...');
      
      // Use MSAL to authenticate with Microsoft
      const loginResponse = await instance.loginPopup(loginRequest);
      
      if (loginResponse.account) {
        console.log('✅ Microsoft Sign-In Success!', {
          name: loginResponse.account.name,
          username: loginResponse.account.username,
          tenantId: loginResponse.account.tenantId
        });
        
        onSuccess?.(loginResponse.account);
      }
    } catch (error: any) {
      console.error('❌ Microsoft Sign-In Error:', error);
      
      let errorMessage = 'Microsoft authentication failed';
      
      // Handle specific MSAL errors
      if (error.errorCode) {
        switch (error.errorCode) {
          case 'user_cancelled':
            errorMessage = 'Authentication was cancelled by user';
            break;
          case 'consent_required':
            errorMessage = 'Additional permissions required';
            break;
          case 'interaction_required':
            errorMessage = 'User interaction required';
            break;
          default:
            errorMessage = `Authentication error: ${error.errorMessage || error.message}`;
        }
      }
      
      onError?.(errorMessage);
    }
  };

  const variantStyles = {
    primary: 'bg-[#0078d4] hover:bg-[#106ebe] text-white border-[#0078d4]',
    outline: 'bg-white hover:bg-gray-50 text-[#0078d4] border-[#0078d4] border-2'
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base', 
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      type="button"
      onClick={handleMicrosoftSignIn}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-semibold rounded-lg
        transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
        shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
      `}
    >
      {/* Microsoft Logo */}
      <svg
        className="w-5 h-5 mr-3"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="1" y="1" width="9" height="9" fill="#F25022" />
        <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
        <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
        <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
      </svg>
      
      {/* Button Text */}
      {text}
    </button>
  );
}
