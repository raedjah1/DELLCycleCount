// ============================================================================
// LOGIN FORM COMPONENT - Pure & Modular
// ============================================================================
// Single responsibility: Handle login form UI and basic interactions

'use client';

import { useState } from 'react';
import { EmailField } from './EmailField';
import { PasswordField } from './PasswordField';
import { SubmitButton } from './SubmitButton';
import { SecurityNotice } from './SecurityNotice';

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberDevice: false
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('🎉 MODULAR LOGIN SUCCESS!\n\nAll components working together perfectly!');
    
    setIsLoading(false);
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Component */}
        <EmailField 
          value={formData.email}
          onChange={(value) => updateFormData('email', value)}
          disabled={isLoading}
        />

        {/* Password Component */}
        <PasswordField 
          value={formData.password}
          onChange={(value) => updateFormData('password', value)}
          disabled={isLoading}
        />

        {/* Remember Device */}
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

        {/* Submit Button Component */}
        <SubmitButton isLoading={isLoading} />
      </form>

      {/* Security Notice Component */}
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
