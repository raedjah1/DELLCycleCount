// ============================================================================
// ADMIN LAYOUT - Professional Warehouse System Administration
// ============================================================================
// Modern admin layout with professional navbar and sidebar

'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar, Sidebar } from '@/components/layouts';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // Mock user data - in production, this would come from auth context
  const mockUserEmail = 'raed.jah@reconext.com';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userRole="admin"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          userEmail={mockUserEmail}
          userRole="admin"
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