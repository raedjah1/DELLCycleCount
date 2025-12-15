// ============================================================================
// VIEWER LAYOUT - Read-Only Warehouse Reports Interface
// ============================================================================
// Layout for viewer screens - read-only access to reports and metrics

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ViewerLayoutProps {
  children: React.ReactNode;
}

export default function ViewerLayout({ children }: ViewerLayoutProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/viewer/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      )
    },
    {
      category: 'Reports',
      items: [
        {
          name: 'SLA Compliance',
          href: '/viewer/sla-compliance',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        },
        {
          name: 'Variance Analysis',
          href: '/viewer/variance-analysis',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )
        },
        {
          name: 'Operator Performance',
          href: '/viewer/operator-performance',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          )
        },
        {
          name: 'Risk Location Analysis',
          href: '/viewer/risk-analysis',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )
        }
      ]
    },
    {
      category: 'Analytics',
      items: [
        {
          name: 'Verified Count Outcomes',
          href: '/viewer/verified-counts',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          )
        },
        {
          name: 'Recount Rates',
          href: '/viewer/recount-rates',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )
        }
      ]
    }
  ];

  const isActivePath = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">📊</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Viewer Console</h1>
              <p className="text-xs text-gray-500">Read-Only Reports</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {navigation.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.category ? (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {section.category}
                    </div>
                    {section.items?.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActivePath(item.href)
                            ? 'bg-gray-100 text-gray-700 border-r-2 border-gray-700'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <span className={`mr-3 ${isActivePath(item.href) ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                          {item.icon}
                        </span>
                        {item.name}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    href={section.href!}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActivePath(section.href!)
                        ? 'bg-gray-100 text-gray-700 border-r-2 border-gray-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className={`mr-3 ${isActivePath(section.href!) ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                      {section.icon}
                    </span>
                    {section.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Read-Only Notice */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <div>
              <p className="text-xs font-medium">Read-Only Access</p>
              <p className="text-xs text-gray-500">View reports only</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <span className="text-gray-600 font-medium text-sm">V</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Viewer User</p>
              <p className="text-xs text-gray-500">Reports Access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {pathname.includes('/sla-compliance') && 'SLA Compliance Report'}
              {pathname.includes('/variance-analysis') && 'Variance Analysis'}
              {pathname.includes('/operator-performance') && 'Operator Performance'}
              {pathname.includes('/risk-analysis') && 'Risk Location Analysis'}
              {pathname.includes('/verified-counts') && 'Verified Count Outcomes'}
              {pathname.includes('/recount-rates') && 'Recount Rate Analysis'}
              {pathname === '/viewer/dashboard' && 'Reports Dashboard'}
            </h2>
            
            <div className="flex items-center space-x-4">
              {/* Export Button */}
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>

              {/* Refresh Button */}
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}