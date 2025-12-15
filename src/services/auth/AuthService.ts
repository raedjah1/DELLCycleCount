// ============================================================================
// AUTHENTICATION SERVICE - Pure Business Logic
// ============================================================================
// Handles all authentication business logic, separated from UI concerns

import { User, LoginFormData, ApiResponse } from '@/types';
import { AuthRepository } from '@/repositories/AuthRepository';
import { validateLoginCredentials } from '@/lib/validations/auth';

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  /**
   * Authenticate user and update availability status
   */
  async signIn(credentials: LoginFormData): Promise<ApiResponse<User>> {
    try {
      // 1. Validate input (business rule)
      const validationResult = validateLoginCredentials(credentials);
      if (!validationResult.success) {
        return {
          success: false,
          error: 'Invalid credentials format',
          data: null as any
        };
      }

      // 2. Attempt authentication
      const authResult = await this.authRepository.signIn(credentials);
      if (!authResult.success) {
        return authResult;
      }

      // 3. Business rule: Update operator availability on sign-in
      if (authResult.data.role === 'operator') {
        await this.authRepository.updateAvailabilityStatus(
          authResult.data.id,
          'present_available'
        );
      }

      return authResult;
    } catch (error) {
      return {
        success: false,
        error: 'Authentication service error',
        data: null as any
      };
    }
  }

  /**
   * Sign out user and update availability status
   */
  async signOut(userId: string): Promise<ApiResponse<void>> {
    try {
      // 1. Business rule: Update operator availability on sign-out
      const user = await this.authRepository.getCurrentUser();
      if (user.data?.role === 'operator') {
        await this.authRepository.updateAvailabilityStatus(
          userId,
          'not_available'
        );
      }

      // 2. Sign out
      return await this.authRepository.signOut();
    } catch (error) {
      return {
        success: false,
        error: 'Sign out service error',
        data: undefined as any
      };
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    return await this.authRepository.getCurrentUser();
  }

  /**
   * Business rule: Check if user can perform action based on role
   */
  canPerformAction(user: User, action: string): boolean {
    const rolePermissions = {
      admin: ['*'], // All actions
      ic_manager: ['approve_variance', 'review_variance', 'manage_verified_counter'],
      warehouse_manager: ['approve_variance', 'review_variance', 'manage_verified_counter'],
      warehouse_supervisor: ['assign_work', 'review_variance'],
      lead: ['assign_work', 'manage_dispatch'],
      operator: ['submit_count', 'capture_serial'],
      viewer: ['view_reports']
    };

    const permissions = rolePermissions[user.role] || [];
    return permissions.includes('*') || permissions.includes(action);
  }

  /**
   * Business rule: Check if user is verified counter
   */
  isVerifiedCounter(user: User): boolean {
    return user.is_verified_counter && ['lead', 'warehouse_supervisor', 'ic_manager', 'warehouse_manager'].includes(user.role);
  }
}
