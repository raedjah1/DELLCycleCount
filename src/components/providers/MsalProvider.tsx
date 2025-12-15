// ============================================================================
// MSAL PROVIDER - REAL Microsoft Authentication Provider
// ============================================================================
// Wraps the app to provide Microsoft authentication context

'use client';

import { ReactNode, useMemo } from 'react';
import { MsalProvider as BaseMsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, validateMsalEnvironment } from '@/lib/auth/msalConfig';

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

  // Show configuration banner in development when Azure isn't configured
  if (!isValid && process.env.NODE_ENV === 'development') {
    return (
      <div className="relative">
        {/* Configuration Required Banner */}
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white text-center py-3 text-sm font-medium z-50 shadow-lg">
          <div className="flex items-center justify-center space-x-2">
            <span>🔧</span>
            <span><strong>AZURE SETUP REQUIRED:</strong> Configure Azure App Registration to Enable Microsoft Authentication</span>
            <span>📖</span>
          </div>
        </div>
        
        {/* Add top padding to account for banner */}
        <div className="pt-16">
          {/* Mock Provider for Development */}
          <MockMsalProvider>
            {children}
          </MockMsalProvider>
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

  // Use real MSAL provider when configured
  return (
    <BaseMsalProvider instance={msalInstance}>
      {children}
    </BaseMsalProvider>
  );
}

// ============================================================================
// MOCK MSAL PROVIDER - For Development Without Azure
// ============================================================================
function MockMsalProvider({ children }: { children: ReactNode }) {
  // Mock MSAL context for development
  const mockMsalContext = {
    instance: {
      loginPopup: async () => {
        throw new Error('Azure not configured - see AZURE_SETUP_GUIDE.md');
      }
    },
    accounts: []
  };

  return (
    <div>
      {children}
    </div>
  );
}
