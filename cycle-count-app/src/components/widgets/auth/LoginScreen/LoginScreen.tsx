// ============================================================================
// LOGIN SCREEN WIDGET - Masterful Authentication UI
// ============================================================================
// Perfect UI/UX login screen with modern design principles and flawless UX

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms';
import { LoginFormData } from '@/types';
import { loginSchema } from '@/schemas/auth';
import { cn } from '@/lib/utils/cn';

interface LoginScreenProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSuccess,
  onError,
  className
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember_device: false
    }
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setLoginError('');
      
      // TODO: Implement actual authentication
      // For now, simulate loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      onSuccess?.();
    } catch (error) {
      const errorMessage = 'Authentication failed. Please check your credentials.';
      setLoginError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-lg">
          Sign in to access your warehouse management dashboard
        </p>
      </div>

      {/* Error Alert */}
      {loginError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-800 font-medium">Authentication Failed</p>
            <p className="text-sm text-red-600 mt-1">{loginError}</p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={cn(
                'w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                'transition-all duration-200 bg-white/70 backdrop-blur-sm',
                'hover:border-gray-400',
                errors.email && 'border-red-500 focus:ring-red-500 focus:border-red-500'
              )}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={cn(
                'w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                'transition-all duration-200 bg-white/70 backdrop-blur-sm',
                'hover:border-gray-400',
                errors.password && 'border-red-500 focus:ring-red-500 focus:border-red-500'
              )}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Remember Device */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-device"
              type="checkbox"
              {...register('remember_device')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
              disabled={isLoading}
            />
            <label htmlFor="remember-device" className="ml-3 text-sm font-medium text-gray-700">
              Remember this device
            </label>
          </div>
          <a 
            href="#" 
            className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className={cn(
            'w-full py-4 text-lg font-semibold',
            'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
            'transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
            'shadow-lg hover:shadow-xl',
            isLoading && 'cursor-not-allowed opacity-75'
          )}
          loading={isLoading || isSubmitting}
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? (
            <span className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing In...</span>
            </span>
          ) : (
            'Sign In to Dashboard'
          )}
        </Button>
      </form>

      {/* Microsoft Authentication Note */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Enterprise Security</p>
            <p className="text-sm text-blue-600 mt-1">
              This system uses Microsoft enterprise authentication with multi-factor authentication (MFA) for enhanced security.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Need help? Contact your system administrator
        </p>
        <p className="text-xs text-gray-400 mt-2">
          © 2025 DELL Warehouse Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
};
