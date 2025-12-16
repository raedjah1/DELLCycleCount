// ============================================================================
// LEAD DASHBOARD - Composed with modular widgets
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { LeadService, OperatorStatus, UnassignedJournal, TeamProgress } from '@/lib/services/leadService';
import { OperatorStatusGrid } from '@/components/widgets/lead/OperatorStatusGrid/OperatorStatusGrid';
import { DispatchPoolGrid } from '@/components/widgets/lead/DispatchPoolGrid/DispatchPoolGrid';
import { TeamProgressCard } from '@/components/widgets/lead/TeamProgressCard/TeamProgressCard';
import { AssignmentModal } from '@/components/widgets/lead/AssignmentModal/AssignmentModal';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';

export default function LeadDashboardPage() {
  const { user } = useCurrentUser();
  const [operators, setOperators] = useState<OperatorStatus[]>([]);
  const [unassignedJournals, setUnassignedJournals] = useState<UnassignedJournal[]>([]);
  const [teamProgress, setTeamProgress] = useState<TeamProgress | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Assignment modal state
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedJournalId, setSelectedJournalId] = useState<string>('');
  const [selectedJournalNumber, setSelectedJournalNumber] = useState<string>('');

  // Filters
  const [operatorFilter, setOperatorFilter] = useState<'all' | 'available' | 'working' | 'on_break'>('all');
  const [dispatchFilter, setDispatchFilter] = useState<'all' | 'urgent' | 'critical'>('all');

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ops, journals, progress] = await Promise.all([
        LeadService.getOperatorStatuses(),
        LeadService.getUnassignedJournals(),
        LeadService.getTeamProgress()
      ]);
      
      setOperators(ops);
      setUnassignedJournals(journals);
      setTeamProgress(progress);
    } catch (error) {
      console.error('Failed to load lead dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignWork = (operatorId: string) => {
    // Open assignment modal with operator pre-selected
    setSelectedJournalId('');
    setSelectedJournalNumber('');
    setAssignmentModalOpen(true);
  };

  const handleAssignJournal = (journalId: string) => {
    const journal = unassignedJournals.find(j => j.id === journalId);
    setSelectedJournalId(journalId);
    setSelectedJournalNumber(journal?.journal_number || '');
    setAssignmentModalOpen(true);
  };

  const handleAssignmentComplete = () => {
    loadData(); // Refresh data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner message="Loading team status..." className="min-h-screen" />
      </div>
    );
  }

  const urgentCount = unassignedJournals.filter(j => j.priority === 'urgent' || j.priority === 'critical').length;
  const availableCount = operators.filter(op => op.status === 'Available').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lead Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {availableCount} operators available • {urgentCount} urgent items in dispatch pool
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Team Progress */}
        {teamProgress && (
          <TeamProgressCard progress={teamProgress} />
        )}

        {/* Dispatch Pool */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Dispatch Pool ({unassignedJournals.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setDispatchFilter('all')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  dispatchFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDispatchFilter('urgent')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  dispatchFilter === 'urgent'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Urgent
              </button>
              <button
                onClick={() => setDispatchFilter('critical')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  dispatchFilter === 'critical'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Critical
              </button>
            </div>
          </div>
          <DispatchPoolGrid
            journals={unassignedJournals}
            onAssign={handleAssignJournal}
            filter={dispatchFilter}
          />
        </div>

        {/* Operator Status */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Operator Status ({operators.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setOperatorFilter('all')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  operatorFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setOperatorFilter('available')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  operatorFilter === 'available'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setOperatorFilter('working')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  operatorFilter === 'working'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Working
              </button>
            </div>
          </div>
          <OperatorStatusGrid
            operators={operators}
            onAssignWork={handleAssignWork}
            filter={operatorFilter}
          />
        </div>
      </div>

      {/* Assignment Modal */}
      {assignmentModalOpen && (
        <AssignmentModal
          journalId={selectedJournalId}
          journalNumber={selectedJournalNumber}
          operators={operators}
          onClose={() => {
            setAssignmentModalOpen(false);
            setSelectedJournalId('');
            setSelectedJournalNumber('');
          }}
          onAssigned={handleAssignmentComplete}
        />
      )}
    </div>
  );
}