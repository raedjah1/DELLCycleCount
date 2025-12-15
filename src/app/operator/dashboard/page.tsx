// ============================================================================
// OPERATOR DASHBOARD - Home screen for operators
// ============================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActiveJournalCard } from '@/components/widgets/operator/ActiveJournalCard';
import { AvailableJournalsPool } from '@/components/widgets/operator/AvailableJournalsPool';
import { OperatorStatusWidget } from '@/components/widgets/operator/OperatorStatusWidget';

export default function OperatorDashboardPage() {
  const router = useRouter();
  
  // Mock data - will be replaced with real data from API
  const [activeJournal] = useState({
    id: 'JRN-2024-001',
    zone: 'ZONE-A1',
    totalLines: 30,
    completedLines: 12,
    warehouse: 'Reimage',
    assignedDate: '2024-12-15T08:00:00Z'
  });

  const [availableJournals] = useState([
    {
      id: 'JRN-2024-002',
      zone: 'ZONE-A2',
      totalLines: 30,
      warehouse: 'Reimage',
      createdDate: '2024-12-15T08:00:00Z'
    },
    {
      id: 'JRN-2024-003',
      zone: 'ZONE-B1',
      totalLines: 30,
      warehouse: 'Reimage',
      createdDate: '2024-12-15T08:00:00Z'
    }
  ]);

  const handleContinueJournal = () => {
    router.push(`/operator/journals/${activeJournal.id}`);
  };

  const handleClaimJournal = (journalId: string) => {
    // TODO: Claim journal logic
    console.log('Claim journal:', journalId);
    router.push(`/operator/journals/${journalId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Operator Dashboard</h1>
          <p className="text-gray-600 mt-2">View your assigned work and start counting</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeJournal && (
              <ActiveJournalCard
                journal={activeJournal}
                onContinue={handleContinueJournal}
              />
            )}

            {(!activeJournal || availableJournals.length > 0) && (
              <AvailableJournalsPool
                journals={availableJournals}
                onClaim={handleClaimJournal}
              />
            )}

            {!activeJournal && availableJournals.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No work assigned</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Check back later or contact your supervisor for assignments.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Status */}
          <div>
            <OperatorStatusWidget
              status="Present/Available"
              todayCounts={12}
              accuracyRate={98}
            />
          </div>
        </div>
      </div>
    </div>
  );
}