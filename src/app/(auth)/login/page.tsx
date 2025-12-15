// ============================================================================
// LOGIN PAGE - Perfect UI/UX Authentication Screen
// ============================================================================
// Masterful login screen with modern design principles and perfect UX

import { LoginScreen } from '@/components/widgets/auth/LoginScreen';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | DELL Warehouse Cycle Count',
  description: 'Secure access to DELL Warehouse Cycle Count Management System',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Side - Branding & Information */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-lg" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center px-12 py-20 text-white">
            {/* Company Branding */}
            <div className="mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                {/* Placeholder for DELL logo */}
                <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold leading-tight mb-4">
                Warehouse Cycle Count
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed">
                Advanced inventory management system with real-time accuracy tracking, 
                automated workflows, and comprehensive variance analysis.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-blue-100">Live production counting</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-blue-100">Transaction-aware reconciliation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-blue-100">Role-based workflow automation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-blue-100">Mobile-optimized interface</span>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="mt-16 pt-8 border-t border-white/20">
              <p className="text-blue-200 text-sm">
                Secure access with enterprise-grade authentication
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            <LoginScreen />
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden absolute top-6 left-6 right-6 z-20">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
            {/* Placeholder for DELL logo */}
            <span className="text-blue-600 font-bold text-lg">D</span>
          </div>
        </div>
      </div>
    </div>
  );
}
