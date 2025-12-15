// ============================================================================
// SIDEBAR COMPONENT - Professional Side Navigation
// ============================================================================
// Location: /components/layouts/Sidebar/
// Purpose: Role-based sidebar navigation with modern design

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { designSystem, getColorPalette } from '@/lib/design/designSystem';

interface SidebarProps {
  userRole: 'admin' | 'manager' | 'lead' | 'operator' | 'viewer';
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  children?: NavigationItem[];
}

export function Sidebar({ userRole, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const pathname = usePathname();
  const roleColors = getColorPalette(userRole);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Get navigation items based on role
  const getNavigationItems = (): NavigationItem[] => {
    switch (userRole) {
      case 'admin':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/admin/dashboard',
            icon: <DashboardIcon />
          },
          {
            id: 'data-management',
            label: 'Data Management',
            href: '#',
            icon: <DataIcon />,
            children: [
              {
                id: 'onhand-import',
                label: 'OnHand Import',
                href: '/admin/imports/onhand',
                icon: <UploadIcon />
              },
              {
                id: 'transaction-import',
                label: 'Transaction Import',
                href: '/admin/imports/transactions',
                icon: <TransactionIcon />
              },
              {
                id: 'data-quality',
                label: 'Data Quality',
                href: '/admin/data-quality',
                icon: <QualityIcon />,
                badge: 3
              }
            ]
          },
          {
            id: 'master-data',
            label: 'Master Data',
            href: '#',
            icon: <DatabaseIcon />,
            children: [
              {
                id: 'locations',
                label: 'Locations',
                href: '/admin/locations',
                icon: <LocationIcon />
              },
              {
                id: 'items',
                label: 'Items',
                href: '/admin/items',
                icon: <ItemIcon />
              },
              {
                id: 'users',
                label: 'Users',
                href: '/admin/users',
                icon: <UserIcon />
              }
            ]
          },
          {
            id: 'system',
            label: 'System',
            href: '#',
            icon: <SystemIcon />,
            children: [
              {
                id: 'configuration',
                label: 'Configuration',
                href: '/admin/config',
                icon: <ConfigIcon />
              },
              {
                id: 'audit-log',
                label: 'Audit Log',
                href: '/admin/audit',
                icon: <AuditIcon />
              }
            ]
          }
        ];

      case 'manager':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/manager/dashboard',
            icon: <DashboardIcon />
          },
          {
            id: 'cycle-counts',
            label: 'Cycle Counts',
            href: '#',
            icon: <CountIcon />,
            children: [
              {
                id: 'plans',
                label: 'Count Plans',
                href: '/manager/plans',
                icon: <PlanIcon />
              },
              {
                id: 'journals',
                label: 'Journals',
                href: '/manager/journals',
                icon: <JournalIcon />
              },
              {
                id: 'variances',
                label: 'Variance Review',
                href: '/manager/variances',
                icon: <VarianceIcon />,
                badge: 12
              }
            ]
          },
          {
            id: 'reporting',
            label: 'Reporting',
            href: '#',
            icon: <ReportIcon />,
            children: [
              {
                id: 'analytics',
                label: 'Analytics',
                href: '/manager/analytics',
                icon: <AnalyticsIcon />
              },
              {
                id: 'performance',
                label: 'Performance',
                href: '/manager/performance',
                icon: <PerformanceIcon />
              }
            ]
          }
        ];

      case 'lead':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/lead/dashboard',
            icon: <DashboardIcon />
          },
          {
            id: 'team-management',
            label: 'Team Management',
            href: '#',
            icon: <TeamIcon />,
            children: [
              {
                id: 'dispatch',
                label: 'Dispatch Pool',
                href: '/lead/dispatch',
                icon: <DispatchIcon />
              },
              {
                id: 'assignments',
                label: 'Assignments',
                href: '/lead/assignments',
                icon: <AssignmentIcon />
              },
              {
                id: 'team-status',
                label: 'Team Status',
                href: '/lead/team',
                icon: <StatusIcon />
              }
            ]
          },
          {
            id: 'monitoring',
            label: 'Monitoring',
            href: '/lead/monitoring',
            icon: <MonitorIcon />
          }
        ];

      case 'operator':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/operator/dashboard',
            icon: <DashboardIcon />
          },
          {
            id: 'my-work',
            label: 'My Work',
            href: '#',
            icon: <WorkIcon />,
            children: [
              {
                id: 'journals',
                label: 'My Journals',
                href: '/operator/journals',
                icon: <JournalIcon />,
                badge: 3
              },
              {
                id: 'tasks',
                label: 'Count Tasks',
                href: '/operator/tasks',
                icon: <TaskIcon />
              }
            ]
          },
          {
            id: 'history',
            label: 'History',
            href: '/operator/history',
            icon: <HistoryIcon />
          }
        ];

      case 'viewer':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/viewer/dashboard',
            icon: <DashboardIcon />
          },
          {
            id: 'reports',
            label: 'Reports',
            href: '/viewer/reports',
            icon: <ReportIcon />
          },
          {
            id: 'analytics',
            label: 'Analytics',
            href: '/viewer/analytics',
            icon: <AnalyticsIcon />
          },
          {
            id: 'export',
            label: 'Export Data',
            href: '/viewer/export',
            icon: <ExportIcon />
          }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {userRole} Console
              </h2>
              <p className="text-sm text-gray-500">Navigation</p>
            </div>
          )}
          
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg 
                className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-2 px-3">
          {navigationItems.map((item) => (
            <NavigationItemComponent
              key={item.id}
              item={item}
              pathname={pathname}
              isCollapsed={isCollapsed}
              isExpanded={expandedSections.includes(item.id)}
              onToggle={() => toggleSection(item.id)}
              roleColors={roleColors}
            />
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
            style={{ backgroundColor: roleColors.primary }}
          >
            {userRole.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 capitalize">
                {userRole} Mode
              </div>
              <div className="text-xs text-gray-500">
                Active Session
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// NAVIGATION ITEM COMPONENT
// ============================================================================

interface NavigationItemComponentProps {
  item: NavigationItem;
  pathname: string;
  isCollapsed: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  roleColors: any;
  level?: number;
}

function NavigationItemComponent({
  item,
  pathname,
  isCollapsed,
  isExpanded = false,
  onToggle,
  roleColors,
  level = 0
}: NavigationItemComponentProps) {
  const isActive = pathname === item.href;
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isActive 
              ? 'text-white' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
          }`}
          style={isActive ? { backgroundColor: roleColors.primary } : {}}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          {!isCollapsed && (
            <>
              <span className="ml-3 flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {item.badge}
                </span>
              )}
              <svg 
                className={`ml-2 w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>

        {/* Children */}
        {!isCollapsed && isExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children?.map((child) => (
              <NavigationItemComponent
                key={child.id}
                item={child}
                pathname={pathname}
                isCollapsed={false}
                roleColors={roleColors}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive 
          ? 'text-white' 
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
      }`}
      style={isActive ? { backgroundColor: roleColors.primary } : {}}
      title={isCollapsed ? item.label : undefined}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      {!isCollapsed && (
        <>
          <span className="ml-3 flex-1">{item.label}</span>
          {item.badge && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

// ============================================================================
// ICON COMPONENTS
// ============================================================================

const iconClass = "w-5 h-5";

function DashboardIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4M16 5v4" />
    </svg>
  );
}

function DataIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

function TransactionIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function QualityIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ItemIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ConfigIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
    </svg>
  );
}

function AuditIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

// Additional icons for other roles...
function CountIcon() { return <DataIcon />; }
function PlanIcon() { return <ConfigIcon />; }
function JournalIcon() { return <AuditIcon />; }
function VarianceIcon() { return <QualityIcon />; }
function ReportIcon() { return <TransactionIcon />; }
function AnalyticsIcon() { return <DataIcon />; }
function PerformanceIcon() { return <SystemIcon />; }
function TeamIcon() { return <UserIcon />; }
function DispatchIcon() { return <UploadIcon />; }
function AssignmentIcon() { return <ConfigIcon />; }
function StatusIcon() { return <SystemIcon />; }
function MonitorIcon() { return <DataIcon />; }
function WorkIcon() { return <ConfigIcon />; }
function TaskIcon() { return <ItemIcon />; }
function HistoryIcon() { return <AuditIcon />; }
function ExportIcon() { return <UploadIcon />; }
