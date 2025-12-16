// ============================================================================
// SUPERVISOR PERFORMANCE - Team performance metrics
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { SupervisorService, TeamPerformance } from '@/lib/services/supervisorService';
import { TeamPerformanceCard } from '@/components/widgets/supervisor';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';

export default function SupervisorPerformancePage() {
  const [performance, setPerformance] = useState<TeamPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformance();
    const interval = setInterval(loadPerformance, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadPerformance = async () => {
    try {
      setLoading(true);
      const data = await SupervisorService.getTeamPerformance();
      setPerformance(data);
    } catch (error) {
      console.error('Failed to load performance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading team performance..." className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Team Performance</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performance.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No performance data available</p>
            </div>
          ) : (
            performance.map((perf) => (
              <TeamPerformanceCard key={perf.operator_id} performance={perf} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
