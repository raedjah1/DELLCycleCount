// ============================================================================
// AUTHENTICATION HOOK - React Logic Layer
// ============================================================================
// Custom hook that bridges UI components with business logic services

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginFormData, ApiResponse } from '@/types';
import { AuthService } from '@/services/auth/AuthService';
import { AuthRepository } from '@/repositories/AuthRepository';
import { useAuthStore } from '@/store/authStore';

// Dependency injection - create service with repository
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

export const useAuth = () => {
  const router = useRouter();
  const { user, setUser, clearUser, isLoading, setLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Initialize auth state on hook mount
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      const result = await authService.getCurrentUser();
      
      if (result.success && result.data) {
        setUser(result.data);
      } else {
        clearUser();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearUser();
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  /**
   * Sign in user
   */
  const signIn = async (credentials: LoginFormData): Promise<ApiResponse<User>> => {
    try {
      setLoading(true);
      const result = await authService.signIn(credentials);
      
      if (result.success && result.data) {
        setUser(result.data);
        
        // Navigate based on user role
        const redirectPath = getRedirectPathForRole(result.data.role);
        router.push(redirectPath);
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: 'Sign in failed',
        data: null as any
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out user
   */
  const signOut = async () => {
    try {
      setLoading(true);
      if (user) {
        await authService.signOut(user.id);
      }
      clearUser();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error);
      clearUser();
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if user can perform action
   */
  const canPerformAction = (action: string): boolean => {
    if (!user) return false;
    return authService.canPerformAction(user, action);
  };

  /**
   * Check if user is verified counter
   */
  const isVerifiedCounter = (): boolean => {
    if (!user) return false;
    return authService.isVerifiedCounter(user);
  };

  /**
   * Get redirect path based on user role
   */
  const getRedirectPathForRole = (role: string): string => {
    const rolePaths = {
      admin: '/admin/dashboard',
      ic_manager: '/manager/dashboard',
      warehouse_manager: '/manager/dashboard',
      warehouse_supervisor: '/manager/dashboard',
      lead: '/manager/dashboard',
      operator: '/operator/dashboard',
      viewer: '/viewer/dashboard'
    };
    
    return rolePaths[role as keyof typeof rolePaths] || '/operator/dashboard';
  };

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    signIn,
    signOut,
    canPerformAction,
    isVerifiedCounter,
    refresh: initializeAuth
  };
};
