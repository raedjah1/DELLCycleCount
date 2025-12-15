// ============================================================================
// LOGIN FORM ORGANISM - Complete Form System
// ============================================================================
// Location: /components/organisms/LoginForm/
// Purpose: Complex login form combining multiple molecules and atoms

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmailField } from '@/components/molecules/EmailField';
import { PasswordField } from '@/components/molecules/PasswordField';
import { SecurityNotice } from '@/components/molecules/SecurityNotice';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { AuthService } from '@/lib/auth/authService';

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string; rememberDevice: boolean }) => void;
  onError?: (error: string) => void;
}

export function LoginForm({ onSubmit, onError }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberDevice: false
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors: {[key: string]: string} = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Attempt authentication with AuthService
      const result = await AuthService.signIn(formData.email, formData.password);
      
      if (result.success && result.user) {
        console.log('✅ Authentication successful:', result.user);
        
        // Call parent onSubmit if provided
        if (onSubmit) {
          onSubmit(formData);
        }
        
        // Redirect to role-appropriate dashboard
        const dashboardRoute = AuthService.getDashboardRoute(result.user);
        router.push(dashboardRoute);
      } else {
        setErrors({ form: result.error || 'Authentication failed' });
        onError?.(result.error || 'Authentication failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Authentication failed. Please try again.';
      setErrors({ form: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Error */}
      {errors.form && (
        <SecurityNotice 
          type="error"
          title="Authentication Failed"
          message={errors.form}
        />
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field Molecule */}
        <EmailField 
          value={formData.email}
          onChange={(value) => updateFormData('email', value)}
          disabled={isLoading}
          error={errors.email}
        />

        {/* Password Field Molecule */}
        <PasswordField 
          value={formData.password}
          onChange={(value) => updateFormData('password', value)}
          disabled={isLoading}
          error={errors.password}
        />

        {/* Remember Device Checkbox */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-device"
              type="checkbox"
              checked={formData.rememberDevice}
              onChange={(e) => updateFormData('rememberDevice', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
              disabled={isLoading}
            />
            <label htmlFor="remember-device" className="ml-3 text-sm font-medium text-gray-700">
              Remember this device
            </label>
          </div>
          <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
            Forgot password?
          </a>
        </div>

        {/* Submit Button Atom */}
        <SubmitButton 
          isLoading={isLoading}
          text="Sign In"
          loadingText="Signing In..."
        />
      </form>

      {/* Security Notice Molecule */}
      <SecurityNotice />

      {/* Footer */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Need help? Contact your system administrator
        </p>
        <p className="text-xs text-gray-400 mt-2">
          © 2025 DELL Warehouse Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
