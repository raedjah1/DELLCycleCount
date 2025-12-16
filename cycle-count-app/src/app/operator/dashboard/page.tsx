// ============================================================================
// OPERATOR DASHBOARD - Refactored with modular widgets
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { JournalService, Journal } from '@/lib/services/journalService';
import { StatusSelector } from '@/components/widgets/operator/StatusSelector/StatusSelector';
import { StatsGrid } from '@/components/widgets/operator/StatsGrid/StatsGrid';
import { JournalCard } from '@/components/widgets/operator/JournalCard/JournalCard';
import { CompactJournalList } from '@/components/widgets/operator/CompactJournalList/CompactJournalList';
import { EmptyState } from '@/components/widgets/operator/EmptyState/EmptyState';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';

export default function OperatorDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loadingJournals, setLoadingJournals] = useState(true);
  const [operatorStatus, setOperatorStatus] = useState<'Available' | 'On Break' | 'On Lunch'>('Available');

  // Load assigned journals
  useEffect(() => {
    if (user?.id) {
      loadJournals();
    }
  }, [user?.id]);

  const loadJournals = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingJournals(true);
      const data = await JournalService.getAssignedJournals(user.id);
      setJournals(data);
    } catch (error) {
      console.error('Failed to load journals:', error);
    } finally {
      setLoadingJournals(false);
    }
  };

  const handleOpenJournal = (journalId: string) => {
    router.push(`/operator/journals/${journalId}`);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Calculate stats
  const activeJournals = journals.filter(j => j.status !== 'completed');
  const completedJournals = journals.filter(j => j.status === 'completed');
  const totalLocationsCompleted = journals.reduce((sum, j) => sum + j.completed_lines, 0);
  const avgProgress = journals.length > 0 
    ? Math.round(journals.reduce((sum, j) => sum + (j.completed_lines / j.total_lines) * 100, 0) / journals.length)
    : 0;

  // Stats for StatsGrid
  const stats = [
    {
      label: 'Active Journals',
      value: activeJournals.length,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-blue-100'
    },
    {
      label: 'Completed',
      value: completedJournals.length,
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-100'
    },
    {
      label: 'Locations Done',
      value: totalLocationsCompleted,
      icon: (
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-orange-100'
    },
    {
      label: 'Avg Progress',
      value: `${avgProgress}%`,
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'bg-purple-100'
    }
  ];

  if (isLoading || loadingJournals) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner message="Loading your assignments..." className="min-h-screen" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Your Assignments</h1>
              <p className="text-gray-600 mt-1 text-sm">
                {activeJournals.length} active journal{activeJournals.length !== 1 ? 's' : ''}
              </p>
      </div>

            <div className="flex-shrink-0">
              <StatusSelector 
                status={operatorStatus}
                onStatusChange={setOperatorStatus}
          />
        </div>
      </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Quick Stats */}
        <StatsGrid stats={stats} className="mb-6" />

        {/* Active Journals */}
        {activeJournals.length > 0 ? (
          <div className="mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Active Journals</h2>
            <div className="space-y-4">
              {activeJournals.map((journal) => (
                <JournalCard
                  key={journal.id}
                  journal={journal}
                  onOpenJournal={handleOpenJournal}
                />
            ))}
          </div>
        </div>
        ) : (
          <EmptyState
            title="No Assignments Yet"
            description="You don't have any journals assigned to you right now."
            actionLabel="Refresh"
            onAction={handleRefresh}
            className="mb-8"
          />
        )}

        {/* Completed Journals */}
        <CompactJournalList
          journals={completedJournals}
          title="Recently Completed"
          maxItems={3}
        />
      </div>
    </div>
  );
}
