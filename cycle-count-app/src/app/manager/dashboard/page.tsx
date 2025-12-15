// ============================================================================
// MANAGER DASHBOARD - Cycle Count Operations Overview
// ============================================================================
// Overview of cycle count operations and pending actions for managers

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ManagerDashboard() {
  const [dashboardData, setDashboardData] = useState({
    pendingApprovals: 8,
    varianceReviewQueue: 12,
    totalCountsToday: 145,
    completedCounts: 98,
    inProgressCounts: 47,
    varianceRate: 12.5,
    recountRate: 8.2,
    dispatchPoolItems: 3
  });

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Cycle count operations and pending actions overview
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-gray-600">Live Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CriticalActionCard 
          title="Pending Approvals"
          count={dashboardData.pendingApprovals}
          description="Items requiring manager approval"
          href="/manager/approvals"
          urgency="high"
          icon="⏰"
        />
        <CriticalActionCard 
          title="Variance Review Queue"
          count={dashboardData.varianceReviewQueue}
          description="Count discrepancies to review"
          href="/manager/variance-review"
          urgency="medium"
          icon="📊"
        />
      </div>

      {/* Today's Metrics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Counts"
            value={dashboardData.totalCountsToday}
            change="+15%"
            changeType="positive"
          />
          <MetricCard 
            title="Completed"
            value={dashboardData.completedCounts}
            change="+8%"
            changeType="positive"
          />
          <MetricCard 
            title="In Progress"
            value={dashboardData.inProgressCounts}
            change="-5%"
            changeType="negative"
          />
          <MetricCard 
            title="Variance Rate"
            value={`${dashboardData.varianceRate}%`}
            change="-2.1%"
            changeType="positive"
          />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActionsCard 
          title="Count Management"
          actions={[
            {
              name: "Review Variances",
              description: "Review Raw Goods count discrepancies",
              href: "/manager/variance-review",
              icon: "🔍",
              badge: dashboardData.varianceReviewQueue
            },
            {
              name: "Approval Queue",
              description: "Approve or reject adjustments",
              href: "/manager/approvals",
              icon: "✅",
              badge: dashboardData.pendingApprovals
            },
            {
              name: "Dispatch Pool",
              description: "Assign unassigned recount tasks",
              href: "/manager/dispatch-pool",
              icon: "📋",
              badge: dashboardData.dispatchPoolItems
            }
          ]}
        />

        <QuickActionsCard 
          title="Team Management"
          actions={[
            {
              name: "Verified Counters",
              description: "Manage counter certifications",
              href: "/manager/verified-counters",
              icon: "🏆",
            },
            {
              name: "Performance Reports",
              description: "View team productivity metrics",
              href: "/manager/reports",
              icon: "📈",
            },
            {
              name: "Operator Status",
              description: "Monitor operator availability",
              href: "/manager/operator-status",
              icon: "👥",
            }
          ]}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Link href="/manager/activity" className="text-sm text-blue-600 hover:text-blue-800">
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          <ActivityItem 
            timestamp="2 min ago"
            action="Approved adjustment"
            description="Finishedgoods variance in Reimage.ARB.AB.01.01A"
            status="approved"
          />
          <ActivityItem 
            timestamp="8 min ago"
            action="Sent to Verified Counter"
            description="High-value variance requires Count 3"
            status="pending"
          />
          <ActivityItem 
            timestamp="15 min ago"
            action="Reviewed variance"
            description="Explained by transaction reconciliation"
            status="resolved"
          />
        </div>
      </div>

      {/* System Alerts */}
      {dashboardData.dispatchPoolItems > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Attention:</strong> {dashboardData.dispatchPoolItems} recount tasks are waiting in the dispatch pool due to no available operators.
                <Link href="/manager/dispatch-pool" className="font-medium underline ml-2">
                  Assign Tasks →
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DASHBOARD COMPONENTS
// ============================================================================

interface CriticalActionCardProps {
  title: string;
  count: number;
  description: string;
  href: string;
  urgency: 'high' | 'medium' | 'low';
  icon: string;
}

function CriticalActionCard({ title, count, description, href, urgency, icon }: CriticalActionCardProps) {
  const urgencyColors = {
    high: 'bg-red-50 border-red-200 text-red-600',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    low: 'bg-green-50 border-green-200 text-green-600'
  };

  return (
    <Link 
      href={href}
      className={`block bg-white rounded-lg shadow-sm p-6 border-l-4 hover:shadow-md transition-shadow ${urgencyColors[urgency]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold text-gray-900">{count}</span>
        <span className="text-sm text-gray-600">{description}</span>
      </div>
    </Link>
  );
}

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

function MetricCard({ title, value, change, changeType }: MetricCardProps) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {change && (
        <p className={`text-xs mt-1 ${changeColors[changeType || 'neutral']}`}>
          {change} vs yesterday
        </p>
      )}
    </div>
  );
}

interface QuickActionsCardProps {
  title: string;
  actions: Array<{
    name: string;
    description: string;
    href: string;
    icon: string;
    badge?: number;
  }>;
}

function QuickActionsCard({ title, actions }: QuickActionsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
          >
            <div className="flex items-center">
              <span className="text-xl mr-3">{action.icon}</span>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-indigo-900">{action.name}</p>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </div>
            {action.badge && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                {action.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

interface ActivityItemProps {
  timestamp: string;
  action: string;
  description: string;
  status: 'approved' | 'pending' | 'resolved' | 'rejected';
}

function ActivityItem({ timestamp, action, description, status }: ActivityItemProps) {
  const statusColors = {
    approved: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800'
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <p className="font-medium text-gray-900">{action}</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <p className="text-xs text-gray-500">{timestamp}</p>
    </div>
  );
}
