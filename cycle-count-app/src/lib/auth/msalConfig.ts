// ============================================================================
// MICROSOFT AUTHENTICATION CONFIGURATION (Development Ready)
// ============================================================================
// MSAL configuration for Microsoft Entra ID (Azure AD) authentication

// ============================================================================
// DEVELOPMENT CONFIGURATION
// ============================================================================
export const msalConfig = {
  auth: {
    // TODO: Replace with your Azure App Registration Client ID
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || "development-mode",
    
    // TODO: Replace with your Azure tenant ID
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
};

// ============================================================================
// LOGIN REQUEST CONFIGURATION
// ============================================================================
export const loginRequest = {
  scopes: [
    "User.Read",           // Read user profile
    "User.Read.All",       // Read all users (for role management)
    "Directory.Read.All",  // Read directory data (for group membership)
  ],
  prompt: "select_account" as const, // Always show account selection
};

// ============================================================================
// GRAPH API CONFIGURATION
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
  
  if (!process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || process.env.NEXT_PUBLIC_AZURE_CLIENT_ID === "development-mode") {
    errors.push("Azure configuration pending - see AZURE_SETUP_GUIDE.md");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
