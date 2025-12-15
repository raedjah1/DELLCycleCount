// ============================================================================
// LOGIN WIDGET - Complete Authentication Module
// ============================================================================
// Self-contained widget that handles complete login functionality

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@/components/atoms';
import { LoginFormData } from '@/types';
import { loginSchema } from '@/schemas/auth';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn } from '@/lib/utils/cn';

interface LoginWidgetProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export const LoginWidget: React.FC<LoginWidgetProps> = ({
  onSuccess,
  onError,
  className
}) => {
  const { signIn, isLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const result = await signIn(data);
      
      if (result.success) {
        onSuccess?.();
      } else {
        onError?.(result.error || 'Login failed');
      }
    } catch (error) {
      onError?.('An unexpected error occurred');
    }
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Widget Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Warehouse Cycle Count
          </h1>
          <p className="text-gray-600 mt-2">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            error={errors.email?.message}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register('password')}
            error={errors.password?.message}
            required
          />

          <div className="flex items-center">
            <input
              id="remember-device"
              type="checkbox"
              {...register('remember_device')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-device" className="ml-2 text-sm text-gray-700">
              Remember this device
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isLoading || isSubmitting}
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Widget Footer */}
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};
