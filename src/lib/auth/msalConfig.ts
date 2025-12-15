// ============================================================================
// MICROSOFT AUTHENTICATION CONFIGURATION
// ============================================================================
// MSAL configuration for Microsoft Entra ID (Azure AD) authentication

import { Configuration, PopupRequest } from '@azure/msal-browser';

// ============================================================================
// MSAL CONFIGURATION
// ============================================================================
export const msalConfig: Configuration = {
  auth: {
    // TODO: Replace with your Azure App Registration Client ID
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || "your-client-id-here",
    
    // TODO: Replace with your Azure tenant ID or use 'common' for multi-tenant
    authority: process.env.NEXT_PUBLIC_AZURE_AUTHORITY || "https://login.microsoftonline.com/common",
    
    // Redirect URI - where Microsoft will redirect after authentication
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/auth/callback",
    
    // Post logout redirect URI
    postLogoutRedirectUri: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI || "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage", // Store tokens in session storage
    storeAuthStateInCookie: false,   // Disable for SPA
  },
  system: {
    allowNativeBroker: false, // Disable WAM Broker
  },
};

// ============================================================================
// LOGIN REQUEST CONFIGURATION
// ============================================================================
export const loginRequest: PopupRequest = {
  scopes: [
    "User.Read",           // Read user profile
    "User.Read.All",       // Read all users (for role management)
    "Directory.Read.All",  // Read directory data (for group membership)
  ],
  prompt: "select_account", // Always show account selection
};

// ============================================================================
// GRAPH API SCOPES (for accessing user data)
// ============================================================================
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphUsersEndpoint: "https://graph.microsoft.com/v1.0/users",
  graphGroupsEndpoint: "https://graph.microsoft.com/v1.0/me/memberOf",
};

// ============================================================================
// ROLE MAPPING CONFIGURATION
// ============================================================================
// Map Azure AD groups to warehouse application roles
export const ROLE_MAPPING = {
  // TODO: Replace with your actual Azure AD group IDs
  "warehouse-admins": "admin",
  "warehouse-ic-managers": "ic_manager", 
  "warehouse-managers": "warehouse_manager",
  "warehouse-supervisors": "warehouse_supervisor",
  "warehouse-leads": "lead",
  "warehouse-operators": "operator",
  "warehouse-viewers": "viewer",
} as const;

// ============================================================================
// ENVIRONMENT VALIDATION
// ============================================================================
export function validateMsalEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || process.env.NEXT_PUBLIC_AZURE_CLIENT_ID === "your-client-id-here") {
    errors.push("NEXT_PUBLIC_AZURE_CLIENT_ID is not configured");
  }
  
  if (!process.env.NEXT_PUBLIC_AZURE_AUTHORITY || process.env.NEXT_PUBLIC_AZURE_AUTHORITY === "https://login.microsoftonline.com/common") {
    errors.push("NEXT_PUBLIC_AZURE_AUTHORITY should be configured with your tenant");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
