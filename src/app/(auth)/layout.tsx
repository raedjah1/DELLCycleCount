// ============================================================================
// AUTHENTICATION LAYOUT - Auth Routes Container
// ============================================================================
// Layout wrapper for all authentication-related pages

import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | DELL Warehouse Cycle Count',
  description: 'Secure access to DELL Warehouse Cycle Count Management System',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Global Background Pattern */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          maskImage: 'linear-gradient(0deg, white, rgba(255, 255, 255, 0.6))'
        }}
      />
      
      {/* Authentication Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
