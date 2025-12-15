// ============================================================================
// MSAL PROVIDER - Microsoft Authentication Provider
// ============================================================================
// Wraps the app to provide Microsoft authentication context

'use client';

import { MsalProvider as BaseMsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, validateMsalEnvironment } from '@/lib/auth/msalConfig';
import { ReactNode, useMemo } from 'react';

interface MsalProviderProps {
  children: ReactNode;
}

export function MsalProvider({ children }: MsalProviderProps) {
  // Validate environment configuration
  const { isValid, errors } = validateMsalEnvironment();
  
  // Create MSAL instance
  const msalInstance = useMemo(() => {
    try {
      return new PublicClientApplication(msalConfig);
    } catch (error) {
      console.error('❌ MSAL Configuration Error:', error);
      return null;
    }
  }, []);

  // Show configuration errors in development
  if (!isValid && process.env.NODE_ENV === 'development') {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            🚨 Microsoft Authentication Configuration Required
          </h1>
          <div className="space-y-4">
            <p className="text-gray-700">
              To enable Microsoft authentication, please configure the following environment variables:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm">
{`# Add to your .env.local file:
NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=http://localhost:3000`}
              </pre>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Configuration Errors:</h3>
              <ul className="text-yellow-700 list-disc ml-4">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh After Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if MSAL instance couldn't be created
  if (!msalInstance) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">
            ❌ MSAL Initialization Failed
          </h1>
          <p className="text-gray-700 mb-4">
            Could not initialize Microsoft authentication. Please check your configuration.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <BaseMsalProvider instance={msalInstance}>
      {children}
    </BaseMsalProvider>
  );
}
