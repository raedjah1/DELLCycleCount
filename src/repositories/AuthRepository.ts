// ============================================================================
// AUTHENTICATION REPOSITORY - Data Access Layer
// ============================================================================
// Handles all database operations for authentication, separated from business logic

import { supabase } from '@/lib/supabase/client';
import { User, LoginFormData, ApiResponse, AvailabilityStatus } from '@/types';

export class AuthRepository {
  /**
   * Sign in user with email/password
   */
  async signIn(credentials: LoginFormData): Promise<ApiResponse<User>> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError || !authData.user) {
        return {
          success: false,
          error: authError?.message || 'Authentication failed',
          data: null as any
        };
      }

      // Get user profile from custom users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', credentials.email)
        .single();

      if (userError || !userData) {
        return {
          success: false,
          error: 'User profile not found',
          data: null as any
        };
      }

      return {
        success: true,
        data: userData,
        error: undefined
      };
    } catch (error) {
      return {
        success: false,
        error: 'Database connection error',
        data: null as any
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: error.message,
          data: undefined as any
        };
      }

      return {
        success: true,
        data: undefined as any,
        error: undefined
      };
    } catch (error) {
      return {
        success: false,
        error: 'Sign out failed',
        data: undefined as any
      };
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        return {
          success: true,
          data: null,
          error: undefined
        };
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', authUser.email)
        .single();

      if (error) {
        return {
          success: false,
          error: 'Failed to fetch user profile',
          data: null
        };
      }

      return {
        success: true,
        data: userData,
        error: undefined
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get current user',
        data: null
      };
    }
  }

  /**
   * Update user availability status
   */
  async updateAvailabilityStatus(
    userId: string, 
    status: AvailabilityStatus
  ): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          availability_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        return {
          success: false,
          error: 'Failed to update availability status',
          data: undefined as any
        };
      }

      return {
        success: true,
        data: undefined as any,
        error: undefined
      };
    } catch (error) {
      return {
        success: false,
        error: 'Database update failed',
        data: undefined as any
      };
    }
  }

  /**
   * Update user verified counter status
   */
  async updateVerifiedCounterStatus(
    userId: string, 
    isVerified: boolean
  ): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_verified_counter: isVerified,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        return {
          success: false,
          error: 'Failed to update verified counter status',
          data: undefined as any
        };
      }

      return {
        success: true,
        data: undefined as any,
        error: undefined
      };
    } catch (error) {
      return {
        success: false,
        error: 'Database update failed',
        data: undefined as any
      };
    }
  }
}
