// ============================================================================
// OPERATOR LAYOUT - Shared layout for operator routes
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar, Sidebar } from '@/components/layouts';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';

interface OperatorLayoutProps {
  children: React.ReactNode;
}

export default function OperatorLayout({ children }: OperatorLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  // Redirect if not authenticated or not operator
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'Operator')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Show loading state or redirect
  if (isLoading || !user || user.role !== 'Operator') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userRole="operator"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          userEmail={user.email}
          userRole="operator"
          currentPath={pathname}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}