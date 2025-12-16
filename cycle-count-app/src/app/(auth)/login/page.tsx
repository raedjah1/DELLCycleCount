// ============================================================================
// LOGIN PAGE - Supabase Authentication
// ============================================================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { UserService } from '@/lib/services/userService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate environment variables are set
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError('Configuration error: Supabase credentials not found. Please check your environment variables.');
        setIsLoading(false);
        console.error('Missing Supabase environment variables');
        return;
      }

      const supabase = createClient();

      // Sign in with Supabase Auth - EXACT SAME CODE AS TEST-AUTH PAGE
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      // Log the FULL response for debugging (same as test-auth)
      console.log('📋 Full Response:', { data: authData, error: authError });

      // CRITICAL: If there's an auth error, we MUST stop here (same logic as test-auth)
      if (authError) {
        console.error('❌ Supabase Auth Error:', authError);
        setError(authError.message || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      // CRITICAL: If no user is returned, authentication failed (same logic as test-auth)
      if (!authData?.user) {
        console.error('❌ No user returned from Supabase Auth');
        setError('Authentication failed. Please try again.');
        setIsLoading(false);
        return;
      }

      console.log('✅ Supabase authentication successful!');

      // Get user profile from public.users table
      const user = await UserService.getUserById(authData.user.id);

      if (!user) {
        setError('User profile not found. Please contact your administrator.');
        setIsLoading(false);
        return;
      }

      if (!user.is_active) {
        setError('Your account has been deactivated. Please contact your administrator.');
        setIsLoading(false);
        return;
      }

      // Redirect based on role
      const dashboardRoutes: Record<string, string> = {
        'Admin': '/admin/dashboard',
        'IC_Manager': '/manager/dashboard',
        'Warehouse_Manager': '/manager/dashboard',
        'Warehouse_Supervisor': '/supervisor/dashboard',
        'Lead': '/lead/dashboard',
        'Operator': '/operator/dashboard',
        'Viewer': '/viewer/dashboard'
      };

      const dashboardRoute = dashboardRoutes[user.role] || '/admin/dashboard';
      router.push(dashboardRoute);
      router.refresh();
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(err.message || 'An error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/logo-Reconext-small.png"
              alt="Reconext Logo"
              width={200}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Cycle Count System
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          © 2025 Reconext Warehouse Management System
        </div>
      </div>
    </div>
  );
}
