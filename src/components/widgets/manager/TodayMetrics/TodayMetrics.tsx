// ============================================================================
// TODAY METRICS - Widget showing today's cycle count metrics
// ============================================================================

'use client';

interface TodayMetricsProps {
  totalCounts: number;
  completed: number;
  inProgress: number;
  varianceRate: number;
  recountRate: number;
}

export function TodayMetrics({
  totalCounts,
  completed,
  inProgress,
  varianceRate,
  recountRate
}: TodayMetricsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Metrics</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <span className="text-sm text-gray-600">Total Counts</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalCounts}</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Completed</span>
          <p className="text-2xl font-bold text-green-600 mt-1">{completed}</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">In Progress</span>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{inProgress}</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Variance Rate</span>
          <p className="text-2xl font-bold text-orange-600 mt-1">{varianceRate}%</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Recount Rate</span>
          <p className="text-2xl font-bold text-red-600 mt-1">{recountRate}%</p>
        </div>
      </div>
    </div>
  );
}
