// ============================================================================
// SUPERVISOR LAYOUT - Warehouse Supervisor interface
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layouts/Sidebar/Sidebar';
import { Navbar } from '@/components/layouts/Navbar/Navbar';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';

interface SupervisorLayoutProps {
  children: React.ReactNode;
}

export default function SupervisorLayout({ children }: SupervisorLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  // Redirect if not authenticated or not a supervisor role
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'Warehouse_Supervisor')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Show loading state or redirect
  if (isLoading || !user || user.role !== 'Warehouse_Supervisor') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userRole="supervisor"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          userEmail={user.email}
          userRole="supervisor"
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
