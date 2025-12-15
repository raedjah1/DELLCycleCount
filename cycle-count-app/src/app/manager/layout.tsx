// ============================================================================
// MANAGER LAYOUT - Shared layout for manager routes
// ============================================================================

import { Navbar } from '@/components/layouts/Navbar';
import { Sidebar } from '@/components/layouts/Sidebar';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}