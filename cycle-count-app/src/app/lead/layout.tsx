// ============================================================================
// LEAD LAYOUT - Warehouse Lead Interface
// ============================================================================
// Layout for lead screens - work assignment and dispatch management

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LeadLayoutProps {
  children: React.ReactNode;
}

export default function LeadLayout({ children }: LeadLayoutProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/lead/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      )
    },
    {
      category: 'Work Management',
      items: [
        {
          name: 'Dispatch Pool',
          href: '/lead/dispatch-pool',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )
        },
        {
          name: 'Journal Assignment',
          href: '/lead/assignments',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-6 8l2 2 4-4" />
            </svg>
          )
        }
      ]
    },
    {
      category: 'Team Oversight',
      items: [
        {
          name: 'Operator Status',
          href: '/lead/operators',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          )
        },
        {
          name: 'Performance Tracking',
          href: '/lead/performance',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">LD</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Lead Console</h1>
              <p className="text-xs text-gray-500">Work Assignment</p>
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
                            ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-700'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <span className={`mr-3 ${isActivePath(item.href) ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
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
                        ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className={`mr-3 ${isActivePath(section.href!) ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                      {section.icon}
                    </span>
                    {section.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <span className="text-gray-600 font-medium text-sm">MD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Mike Davis</p>
              <p className="text-xs text-gray-500">Team Lead • Shift B</p>
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
              {pathname.includes('/dispatch-pool') && 'Dispatch Pool Management'}
              {pathname.includes('/assignments') && 'Journal Assignments'}
              {pathname.includes('/operators') && 'Operator Status'}
              {pathname.includes('/performance') && 'Performance Tracking'}
              {pathname === '/lead/dashboard' && 'Lead Dashboard'}
            </h2>
            
            <div className="flex items-center space-x-4">
              {/* Alerts Badge */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 17H6l5 5v-5z" />
                </svg>
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">5</span>
              </button>

              {/* Emergency Contact */}
              <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
