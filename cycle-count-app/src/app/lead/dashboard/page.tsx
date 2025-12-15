// ============================================================================
// LEAD DASHBOARD - Work Assignment and Dispatch Overview
// ============================================================================
// Overview of work assignment and dispatch pool for warehouse leads

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LeadDashboard() {
  const [dashboardData, setDashboardData] = useState({
    dispatchPoolAlerts: 5,
    activeOperators: 12,
    operatorsOnBreak: 3,
    operatorsOnLunch: 2,
    pendingAssignments: 7,
    completedJournalsToday: 23,
    averageCompletionTime: '45 min',
    topPerformer: {
      name: 'Sarah Johnson',
      countsCompleted: 18,
      accuracyRate: 98.2
    }
  });

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Work assignment and team management overview
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Shift B</p>
            <p className="font-semibold text-gray-900">6:00 AM - 2:00 PM</p>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {dashboardData.dispatchPoolAlerts > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>🚨 Urgent:</strong> {dashboardData.dispatchPoolAlerts} recount tasks waiting in dispatch pool - no available operators.
                <Link href="/lead/dispatch-pool" className="font-medium underline ml-2">
                  Assign Now →
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Team Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusCard 
          title="Active Operators"
          value={dashboardData.activeOperators}
          status="available"
          href="/lead/operators"
        />
        <StatusCard 
          title="On Break"
          value={dashboardData.operatorsOnBreak}
          status="break"
        />
        <StatusCard 
          title="On Lunch"
          value={dashboardData.operatorsOnLunch}
          status="lunch"
        />
        <StatusCard 
          title="Pending Assignments"
          value={dashboardData.pendingAssignments}
          status="pending"
          href="/lead/assignments"
        />
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dispatch Pool Management */}
        <ActionCard 
          title="Dispatch Pool"
          description="Manage unassigned recount tasks"
          urgency={dashboardData.dispatchPoolAlerts > 0 ? "critical" : "normal"}
          actions={[
            {
              name: "View Dispatch Pool",
              description: `${dashboardData.dispatchPoolAlerts} tasks waiting`,
              href: "/lead/dispatch-pool",
              icon: "🚨",
              urgent: dashboardData.dispatchPoolAlerts > 0
            },
            {
              name: "Auto-Assign Tasks",
              description: "Let system assign to available operators",
              href: "/lead/dispatch-pool?action=auto-assign",
              icon: "⚡"
            }
          ]}
        />

        {/* Work Assignment */}
        <ActionCard 
          title="Work Assignment"
          description="Assign and manage operator journals"
          actions={[
            {
              name: "Journal Assignment",
              description: `${dashboardData.pendingAssignments} journals to assign`,
              href: "/lead/assignments",
              icon: "📋"
            },
            {
              name: "Operator Status",
              description: "Monitor team availability",
              href: "/lead/operators",
              icon: "👥"
            }
          ]}
        />
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Today's Performance</h2>
          <Link href="/lead/performance" className="text-sm text-orange-600 hover:text-orange-800">
            Detailed Report →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PerformanceMetric 
            title="Journals Completed"
            value={dashboardData.completedJournalsToday}
            change="+12%"
            changeType="positive"
          />
          <PerformanceMetric 
            title="Avg Completion Time"
            value={dashboardData.averageCompletionTime}
            change="-8 min"
            changeType="positive"
          />
          <PerformanceMetric 
            title="Team Efficiency"
            value="94.2%"
            change="+2.1%"
            changeType="positive"
          />
        </div>
      </div>

      {/* Top Performer Highlight */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🏆 Top Performer Today</h3>
            <p className="text-lg font-bold text-orange-700">{dashboardData.topPerformer.name}</p>
            <p className="text-sm text-gray-600">
              {dashboardData.topPerformer.countsCompleted} counts completed • {dashboardData.topPerformer.accuracyRate}% accuracy
            </p>
          </div>
          <div className="text-right">
            <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors">
              Recognize Achievement
            </button>
          </div>
        </div>
      </div>

      {/* Operator Status Quick View */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Operator Status</h2>
          <Link href="/lead/operators" className="text-sm text-orange-600 hover:text-orange-800">
            Manage All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <OperatorCard 
            name="John Smith"
            status="Available"
            currentWork="J-2024-1215-001 (12/25 lines)"
            zone="AB-Rawgoods"
          />
          <OperatorCard 
            name="Emily Davis"
            status="Available"
            currentWork="J-2024-1215-003 (8/18 lines)"
            zone="CD-Production"
          />
          <OperatorCard 
            name="Mike Wilson"
            status="On Break"
            currentWork="Break until 10:15 AM"
            zone="EF-Finishedgoods"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <QuickActionButton 
            href="/lead/dispatch-pool"
            text={`Dispatch Pool (${dashboardData.dispatchPoolAlerts})`}
            icon="🚨"
            urgent={dashboardData.dispatchPoolAlerts > 0}
          />
          <QuickActionButton 
            href="/lead/assignments"
            text="Assign Work"
            icon="📋"
          />
          <QuickActionButton 
            href="/lead/operators"
            text="Team Status"
            icon="👥"
          />
          <QuickActionButton 
            href="/lead/emergency"
            text="Emergency Contact"
            icon="📞"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LEAD DASHBOARD COMPONENTS
// ============================================================================

interface StatusCardProps {
  title: string;
  value: number;
  status: 'available' | 'break' | 'lunch' | 'pending';
  href?: string;
}

function StatusCard({ title, value, status, href }: StatusCardProps) {
  const statusColors = {
    available: 'bg-green-50 border-green-200 text-green-600',
    break: 'bg-yellow-50 border-yellow-200 text-yellow-600', 
    lunch: 'bg-red-50 border-red-200 text-red-600',
    pending: 'bg-blue-50 border-blue-200 text-blue-600'
  };

  const content = (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${statusColors[status]} transition-shadow hover:shadow-md`}>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  return content;
}

interface ActionCardProps {
  title: string;
  description: string;
  urgency?: 'critical' | 'normal';
  actions: Array<{
    name: string;
    description: string;
    href: string;
    icon: string;
    urgent?: boolean;
  }>;
}

function ActionCard({ title, description, urgency = 'normal', actions }: ActionCardProps) {
  const cardStyle = urgency === 'critical' 
    ? 'bg-red-50 border-l-4 border-red-400'
    : 'bg-white border border-gray-200';

  return (
    <div className={`rounded-lg shadow-sm p-6 ${cardStyle}`}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`flex items-center p-3 rounded-lg border transition-colors group ${
              action.urgent 
                ? 'border-red-300 bg-red-50 hover:bg-red-100'
                : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            <span className="text-xl mr-3">{action.icon}</span>
            <div>
              <p className={`font-medium group-hover:text-orange-900 ${action.urgent ? 'text-red-900' : 'text-gray-900'}`}>
                {action.name}
              </p>
              <p className={`text-sm ${action.urgent ? 'text-red-600' : 'text-gray-500'}`}>
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

interface PerformanceMetricProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

function PerformanceMetric({ title, value, change, changeType }: PerformanceMetricProps) {
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

interface OperatorCardProps {
  name: string;
  status: string;
  currentWork: string;
  zone: string;
}

function OperatorCard({ name, status, currentWork, zone }: OperatorCardProps) {
  const statusColors = {
    'Available': 'bg-green-100 text-green-800',
    'On Break': 'bg-yellow-100 text-yellow-800',
    'On Lunch': 'bg-red-100 text-red-800'
  } as const;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-gray-900">{name}</p>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-1">{currentWork}</p>
      <p className="text-xs text-gray-500">Zone: {zone}</p>
    </div>
  );
}

interface QuickActionButtonProps {
  href: string;
  text: string;
  icon: string;
  urgent?: boolean;
}

function QuickActionButton({ href, text, icon, urgent = false }: QuickActionButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors group ${
        urgent 
          ? 'bg-red-100 hover:bg-red-200 text-red-700'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      }`}
    >
      <span className="mr-2 text-lg">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </Link>
  );
}
