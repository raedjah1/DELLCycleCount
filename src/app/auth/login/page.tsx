// ============================================================================
// LOGIN PAGE - PERFECT ATOMIC DESIGN ARCHITECTURE
// ============================================================================
// This page orchestrates components from proper atomic design folders
// 🎯 ATOMS: /components/atoms/
// 🔗 MOLECULES: /components/molecules/
// 🏗️ ORGANISMS: /components/organisms/

import { LoginHeader } from '@/components/molecules/LoginHeader';
import { LoginForm } from '@/components/organisms/LoginForm';
import { LoginBranding } from '@/components/organisms/LoginBranding';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern Component */}
      <BackgroundPattern />
      
      {/* Main Login Layout */}
      <div className="flex min-h-screen">
        {/* Left Side - Branding Organism */}
        <div className="hidden lg:flex lg:w-1/2">
          <LoginBranding />
        </div>

        {/* Right Side - Login Form Area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Login Header Molecule */}
            <LoginHeader />
            {/* Login Form Organism */}
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <MobileHeader />
    </div>
  );
}

// ============================================================================
// LOCAL PAGE COMPONENTS - Page-specific utilities
// ============================================================================

function BackgroundPattern() {
  return (
    <div 
      className="absolute inset-0 opacity-30 -z-10" 
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }} 
    />
  );
}

function MobileHeader() {
  return (
    <div className="lg:hidden absolute top-6 left-6 right-6 z-20">
      <div className="flex items-center justify-center">
        <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-blue-600 font-bold text-lg">D</span>
        </div>
      </div>
    </div>
  );
}
