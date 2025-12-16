// ============================================================================
// TEAM PROGRESS CARD WIDGET - Team-wide metrics display
// ============================================================================

'use client';

import { TeamProgress } from '@/lib/services/leadService';

interface TeamProgressCardProps {
  progress: TeamProgress;
  className?: string;
}

export function TeamProgressCard({ progress, className = '' }: TeamProgressCardProps) {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Progress</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <span className="text-sm text-gray-600">Operators</span>
          <p className="text-2xl font-bold text-gray-900">{progress.totalOperators}</p>
          <p className="text-xs text-gray-500">
            {progress.availableOperators} available, {progress.workingOperators} working
          </p>
        </div>
        
        <div>
          <span className="text-sm text-gray-600">Journals</span>
          <p className="text-2xl font-bold text-gray-900">{progress.totalJournals}</p>
          <p className="text-xs text-gray-500">
            {progress.completedJournals} done, {progress.inProgressJournals} in progress
          </p>
        </div>
        
        <div>
          <span className="text-sm text-gray-600">Unassigned</span>
          <p className={`text-2xl font-bold ${progress.unassignedJournals > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {progress.unassignedJournals}
          </p>
          <p className="text-xs text-gray-500">In dispatch pool</p>
        </div>
        
        <div>
          <span className="text-sm text-gray-600">Completion</span>
          <p className="text-2xl font-bold text-gray-900">{progress.completionRate}%</p>
          <p className="text-xs text-gray-500">
            {progress.completedLocations} / {progress.totalLocations} locations
          </p>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{progress.completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress.completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
