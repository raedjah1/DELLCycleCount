// ============================================================================
// OPERATOR COUNT TASKS - View individual count tasks
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { JournalService, Journal, JournalLine } from '@/lib/services/journalService';
import { LoadingSpinner, EmptyState } from '@/components/widgets/operator';
import { ItemInfoCard } from '@/components/widgets/operator/ItemInfoCard/ItemInfoCard';

interface CountTask {
  id: string;
  journal_id: string;
  journal_number: string;
  line_id: string;
  sequence_number: number;
  location_code: string;
  part_number: string;
  expected_qty: number;
  status: string;
  item: {
    part_no: string;
    name: string;
    description: string;
    warehouse_type: string;
  };
  location: {
    location_code: string;
  };
}

export default function OperatorTasksPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [tasks, setTasks] = useState<CountTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unstarted' | 'in_progress' | 'completed'>('unstarted');

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const journals = await JournalService.getAssignedJournals(user?.id || '');
      
      // Get all journal lines from all journals
      const allTasks: CountTask[] = [];
      
      for (const journal of journals) {
        const journalWithLines = await JournalService.getJournalWithLines(journal.id);
        
        journalWithLines.lines.forEach((line: JournalLine) => {
          allTasks.push({
            id: line.id,
            journal_id: journal.id,
            journal_number: journal.journal_number,
            line_id: line.id,
            sequence_number: line.sequence_number,
            location_code: line.location.location_code,
            part_number: line.item.part_no,
            expected_qty: line.expected_qty,
            status: line.status,
            item: {
              part_no: line.item.part_no,
              name: line.item.name || '',
              description: line.item.description || '',
              warehouse_type: line.item.warehouse_type || ''
            },
            location: {
              location_code: line.location.location_code
            }
          });
        });
      }
      
      setTasks(allTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'unstarted') return task.status === 'Unstarted';
    if (filter === 'in_progress') return task.status === 'In Progress';
    if (filter === 'completed') return task.status === 'Completed';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Unstarted': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Needs Recount': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading count tasks..." className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Count Tasks</h1>
          <p className="text-gray-600 mt-1 text-sm">View and complete individual count tasks</p>
        </div>

        {/* Filters */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <button
              onClick={() => setFilter('unstarted')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === 'unstarted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Unstarted ({tasks.filter(t => t.status === 'Unstarted').length})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === 'in_progress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              In Progress ({tasks.filter(t => t.status === 'In Progress').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Completed ({tasks.filter(t => t.status === 'Completed').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All ({tasks.length})
            </button>
          </div>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/operator/journals/${task.journal_id}/count/${task.line_id}`)}
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{task.part_number}</h3>
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded flex-shrink-0 ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{task.location_code}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Journal: {task.journal_number} • #{task.sequence_number}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Expected</span>
                    <p className="font-medium text-gray-900">{task.expected_qty}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Type</span>
                    <p className="font-medium text-gray-900">{task.item.warehouse_type || 'N/A'}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/operator/journals/${task.journal_id}/count/${task.line_id}`);
                  }}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {task.status === 'Unstarted' ? 'Start' : task.status === 'In Progress' ? 'Continue' : 'View'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Tasks Found"
            description="You don't have any count tasks matching the current filter."
            className="bg-white rounded-xl border border-gray-200"
          />
        )}
      </div>
    </div>
  );
}
