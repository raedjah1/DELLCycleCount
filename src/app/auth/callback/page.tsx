// ============================================================================
// MICROSOFT AUTHENTICATION CALLBACK PAGE
// ============================================================================
// This page handles the redirect from Microsoft after authentication

'use client';

import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';

export default function AuthCallbackPage() {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    // Handle the redirect promise from Microsoft
    instance.handleRedirectPromise()
      .then((tokenResponse) => {
        if (tokenResponse && tokenResponse.account) {
          console.log('✅ Microsoft Authentication Successful!', {
            name: tokenResponse.account.name,
            username: tokenResponse.account.username,
            tenantId: tokenResponse.account.tenantId
          });
          
          // Redirect to dashboard or main app
          window.location.href = '/dashboard';
        } else if (accounts.length > 0) {
          // User is already authenticated
          console.log('✅ User already authenticated:', accounts[0]);
          window.location.href = '/dashboard';
        }
      })
      .catch((error) => {
        console.error('❌ Authentication callback error:', error);
        // Redirect back to login with error
        window.location.href = '/auth/login?error=callback_failed';
      });
  }, [instance, accounts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* Loading Animation */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg 
              className="animate-spin w-8 h-8 text-blue-600" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>

        {/* Status Messages */}
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Completing Microsoft Authentication
        </h1>
        <p className="text-gray-600 mb-6">
          Please wait while we process your authentication...
        </p>

        {/* Microsoft Logo */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" viewBox="0 0 21 21" fill="none">
            <rect x="1" y="1" width="9" height="9" fill="#F25022" />
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
            <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
          </svg>
          <span>Secured by Microsoft</span>
        </div>

        {/* Fallback Button */}
        <div className="mt-8">
          <button
            onClick={() => window.location.href = '/auth/login'}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}
