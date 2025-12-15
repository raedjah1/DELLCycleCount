// ============================================================================
// OPERATOR DASHBOARD - Warehouse Operator Work Interface
// ============================================================================
// View assigned work and start counting - operator-first guided experience

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function OperatorDashboard() {
  const [operatorData, setOperatorData] = useState({
    hasActiveJournal: true,
    activeJournal: {
      id: 'J-2024-1215-001',
      zone: 'AB-Rawgoods',
      totalLines: 25,
      completedLines: 12,
      warehouse: 'Rawgoods',
      assignedAt: '2024-12-15T08:00:00'
    },
    todayStats: {
      countsCompleted: 12,
      accuracyRate: 94.5,
      averageTimePerCount: '2.3 min'
    },
    availableJournals: [
      {
        id: 'J-2024-1215-002',
        zone: 'CD-Production',
        totalLines: 18,
        warehouse: 'Production',
        priority: 'high'
      }
    ]
  });

  const progressPercent = (operatorData.activeJournal.completedLines / operatorData.activeJournal.totalLines) * 100;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Header - Mobile Optimized */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Good Morning, John!</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Ready to continue your counting work
          </p>
        </div>
      </div>

      {/* Active Journal Card - Primary Action */}
      {operatorData.hasActiveJournal ? (
        <ActiveJournalCard journal={operatorData.activeJournal} progressPercent={progressPercent} />
      ) : (
        <NoActiveJournalCard availableJournals={operatorData.availableJournals} />
      )}

      {/* Today's Performance - Motivational */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PerformanceMetric 
            title="Counts Completed"
            value={operatorData.todayStats.countsCompleted}
            icon="✅"
            color="green"
          />
          <PerformanceMetric 
            title="Accuracy Rate"
            value={`${operatorData.todayStats.accuracyRate}%`}
            icon="🎯"
            color="blue"
          />
          <PerformanceMetric 
            title="Avg Time/Count"
            value={operatorData.todayStats.averageTimePerCount}
            icon="⏱️"
            color="purple"
          />
        </div>
      </div>

      {/* Quick Actions - Large Touch Targets */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickActionButton 
            href="/operator/scanner-test"
            title="Test Scanner"
            description="Verify barcode scanner is working"
            icon="📱"
          />
          <QuickActionButton 
            href="/operator/help"
            title="Get Help"
            description="Contact support or view guides"
            icon="🆘"
          />
        </div>
      </div>

      {/* Available Work Pool - If No Active Journal */}
      {operatorData.availableJournals.length > 0 && !operatorData.hasActiveJournal && (
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Work</h2>
          <div className="space-y-3">
            {operatorData.availableJournals.map((journal) => (
              <AvailableJournalCard key={journal.id} journal={journal} />
            ))}
          </div>
        </div>
      )}

      {/* Safety Reminder - Important for warehouse */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
        <div className="flex items-start">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Safety Reminder</h3>
            <p className="text-sm text-blue-700 mt-1">
              Always follow proper lifting techniques and wear safety equipment when counting physical inventory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// OPERATOR DASHBOARD COMPONENTS
// ============================================================================

interface ActiveJournalCardProps {
  journal: {
    id: string;
    zone: string;
    totalLines: number;
    completedLines: number;
    warehouse: string;
    assignedAt: string;
  };
  progressPercent: number;
}

function ActiveJournalCard({ journal, progressPercent }: ActiveJournalCardProps) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-400 rounded-lg p-4 md:p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Active Journal</h2>
          <p className="text-gray-600 text-sm">{journal.id}</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          In Progress
        </span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Zone</p>
            <p className="font-semibold text-gray-900">{journal.zone}</p>
          </div>
          <div>
            <p className="text-gray-600">Warehouse</p>
            <p className="font-semibold text-gray-900">{journal.warehouse}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-900 font-semibold">{journal.completedLines} of {journal.totalLines} lines</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{Math.round(progressPercent)}% complete</p>
        </div>

        {/* Primary Action Button */}
        <Link 
          href={`/operator/journal/${journal.id}`}
          className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors text-lg"
        >
          Continue Counting →
        </Link>
      </div>
    </div>
  );
}

function NoActiveJournalCard({ availableJournals }: { availableJournals: any[] }) {
  return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">No Active Journal</h2>
      <p className="text-gray-600 mb-4">
        {availableJournals.length > 0 
          ? "Select a journal from available work below to start counting" 
          : "No work assigned. Contact your lead for assignment."
        }
      </p>
    </div>
  );
}

interface PerformanceMetricProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'green' | 'blue' | 'purple';
}

function PerformanceMetric({ title, value, icon, color }: PerformanceMetricProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="text-center">
      <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-2 ${colorClasses[color]}`}>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

interface QuickActionButtonProps {
  href: string;
  title: string;
  description: string;
  icon: string;
}

function QuickActionButton({ href, title, description, icon }: QuickActionButtonProps) {
  return (
    <Link
      href={href}
      className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
    >
      <span className="text-2xl mr-3">{icon}</span>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

function AvailableJournalCard({ journal }: { journal: any }) {
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800', 
    low: 'bg-green-100 text-green-800'
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <p className="font-medium text-gray-900">{journal.id}</p>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[journal.priority]}`}>
            {journal.priority} priority
          </span>
        </div>
        <p className="text-sm text-gray-600">{journal.zone} • {journal.totalLines} lines</p>
      </div>
      <Link
        href={`/operator/journal/${journal.id}`}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Claim
      </Link>
    </div>
  );
}
