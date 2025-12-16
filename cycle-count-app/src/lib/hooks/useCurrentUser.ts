// ============================================================================
// USE CURRENT USER HOOK - Get authenticated user from Supabase
// ============================================================================
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserService, User } from '@/lib/services/userService';

interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true);
        const supabase = createClient();

        // Get current auth user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser) {
          setError('Not authenticated');
          setUser(null);
          return;
        }

        // Get user profile from public.users table
        const userProfile = await UserService.getUserById(authUser.id);

        if (!userProfile) {
          setError('User profile not found');
          setUser(null);
          return;
        }

        setUser({
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
          isActive: userProfile.is_active
        });
        setError(null);
      } catch (err: any) {
        console.error('Error loading current user:', err);
        setError(err.message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();

    // Listen for auth state changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading, error };
}

