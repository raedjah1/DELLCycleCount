// ============================================================================
// AUTHENTICATION SERVICE - Mock Authentication for Development
// ============================================================================
// Simple authentication service for warehouse management system

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'IC_Manager' | 'Warehouse_Manager' | 'Warehouse_Supervisor' | 'Lead' | 'Operator' | 'Viewer';
  shift?: 'A' | 'B' | 'C';
  isVerifiedCounter?: boolean;
  presenceStatus: 'Present_Available' | 'On_Break' | 'On_Lunch' | 'Not_Available';
}

// Mock user database
const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'raed.jah@reconext.com',
    fullName: 'Raed Jah',
    role: 'Admin',
    shift: 'A',
    isVerifiedCounter: true,
    presenceStatus: 'Present_Available'
  },
  {
    id: 'user-2', 
    email: 'operator1@dell.com',
    fullName: 'John Smith',
    role: 'Operator',
    shift: 'A',
    isVerifiedCounter: false,
    presenceStatus: 'Not_Available'
  },
  {
    id: 'user-3',
    email: 'manager1@dell.com', 
    fullName: 'Sarah Johnson',
    role: 'IC_Manager',
    shift: 'A',
    isVerifiedCounter: true,
    presenceStatus: 'Present_Available'
  },
  {
    id: 'user-4',
    email: 'lead1@dell.com',
    fullName: 'Mike Davis',
    role: 'Lead', 
    shift: 'B',
    isVerifiedCounter: false,
    presenceStatus: 'Present_Available'
  }
];

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export class AuthService {
  private static currentUser: User | null = null;

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<AuthResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find user by email
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return {
        success: false,
        error: 'Email not found. Please contact your administrator.'
      };
    }

    // For development: accept any password for valid users
    // In production: this would validate against real authentication
    if (password.length < 3) {
      return {
        success: false,
        error: 'Password must be at least 3 characters.'
      };
    }

    // Set user as present/available on sign-in (Section 8.2)
    if (user.role === 'Operator') {
      user.presenceStatus = 'Present_Available';
    }

    this.currentUser = user;
    
    // Store in localStorage for persistence
    localStorage.setItem('wms_user', JSON.stringify(user));
    
    return {
      success: true,
      user
    };
  }

  // Get current authenticated user
  static getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from localStorage
    const stored = localStorage.getItem('wms_user');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      } catch (error) {
        localStorage.removeItem('wms_user');
      }
    }

    return null;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Sign out user
  static async signOut(): Promise<void> {
    const user = this.getCurrentUser();
    
    // Set operator status to "Not Available" on sign-out (Section 8.2)
    if (user && user.role === 'Operator') {
      user.presenceStatus = 'Not_Available';
    }

    this.currentUser = null;
    localStorage.removeItem('wms_user');
  }

  // Get dashboard route based on user role
  static getDashboardRoute(user: User): string {
    switch (user.role) {
      case 'Admin':
        return '/admin/dashboard';
      case 'IC_Manager':
      case 'Warehouse_Manager':
      case 'Warehouse_Supervisor':
        return '/manager/dashboard';
      case 'Lead':
        return '/lead/dashboard';
      case 'Operator':
        return '/operator/dashboard';
      case 'Viewer':
        return '/viewer/dashboard';
      default:
        return '/admin/dashboard';
    }
  }

  // Check if user has specific permission
  static hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Define permissions by role
    const permissions: Record<string, string[]> = {
      'Admin': ['*'], // Admin has all permissions
      'IC_Manager': ['variance_review', 'approve_adjustments', 'verified_counter_mgmt', 'dispatch_pool'],
      'Warehouse_Manager': ['variance_review', 'approve_adjustments', 'verified_counter_mgmt', 'dispatch_pool'],
      'Warehouse_Supervisor': ['dispatch_pool', 'assign_work', 'operator_status'],
      'Lead': ['assign_work', 'dispatch_pool', 'operator_status'],
      'Operator': ['execute_counts', 'view_journals'],
      'Viewer': ['view_reports']
    };

    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  }

  // Update user presence status (for operators)
  static updatePresenceStatus(status: User['presenceStatus']): void {
    const user = this.getCurrentUser();
    if (user && user.role === 'Operator') {
      user.presenceStatus = status;
      localStorage.setItem('wms_user', JSON.stringify(user));
    }
  }
}
