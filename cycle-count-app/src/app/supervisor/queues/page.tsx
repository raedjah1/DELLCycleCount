// ============================================================================
// SUPERVISOR QUEUES - Monitor dispatch pool and active work
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { SupervisorService } from '@/lib/services/supervisorService';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';
import { JournalCard } from '@/components/widgets/operator/JournalCard/JournalCard';

export default function SupervisorQueuesPage() {
  const [queues, setQueues] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueues();
    const interval = setInterval(loadQueues, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadQueues = async () => {
    try {
      setLoading(true);
      const data = await SupervisorService.getActiveQueues();
      setQueues(data);
    } catch (error) {
      console.error('Failed to load queues:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading queues..." className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Work Queues</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dispatch Pool */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dispatch Pool</h2>
            {queues?.dispatch_pool?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No unassigned tasks</p>
            ) : (
              <div className="space-y-3">
                {queues?.dispatch_pool?.map((task: any) => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">Task #{task.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">Priority: {task.priority}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Journals */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Journals</h2>
            {queues?.active_journals?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active journals</p>
            ) : (
              <div className="space-y-3">
                {queues?.active_journals?.map((journal: any) => (
                  <JournalCard 
                    key={journal.id} 
                    journal={journal}
                    onOpenJournal={() => window.location.href = `/manager/journals/${journal.id}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
