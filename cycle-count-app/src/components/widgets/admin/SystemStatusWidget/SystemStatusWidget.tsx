// ============================================================================
// SYSTEM STATUS WIDGET - Admin Dashboard Activity Monitor
// ============================================================================
// Location: /components/widgets/admin/SystemStatusWidget/
// Purpose: Display recent activities and import status

'use client';

import { useState, useEffect } from 'react';

interface SystemStatusWidgetProps {
  recentActivity?: ActivityItem[];
  importStatus?: ImportStatus[];
}

interface ActivityItem {
  id: string;
  type: 'import' | 'user' | 'system' | 'error';
  message: string;
  timestamp: string;
  details?: string;
}

interface ImportStatus {
  id: string;
  type: 'onhand' | 'transactions';
  filename: string;
  status: 'processing' | 'completed' | 'failed' | 'pending';
  recordsProcessed: number;
  totalRecords: number;
  startedAt: string;
  completedAt?: string;
}

export function SystemStatusWidget({ 
  recentActivity = [],
  importStatus = []
}: SystemStatusWidgetProps) {

  // Mock recent activity if none provided
  const defaultActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'import',
      message: 'OnHand data imported successfully',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      details: '12,543 records processed'
    },
    {
      id: '2',
      type: 'user',
      message: 'New user registered: john.doe@example.com',
      timestamp: new Date(Date.now() - 900000).toISOString()
    },
    {
      id: '3',
      type: 'system',
      message: 'System backup completed',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  const activity = recentActivity.length > 0 ? recentActivity : defaultActivity;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Import Status Section */}
      {importStatus.length > 0 && (
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Active Imports</h2>
          <div className="space-y-3 sm:space-y-4">
            {importStatus.map((item) => (
              <ImportCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Recent Activity</h2>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 divide-y divide-gray-100">
          {activity.slice(0, 5).map((item) => (
            <ActivityCard key={item.id} {...item} />
          ))}
          
          {/* View All Button */}
          <div className="p-3 sm:p-4 text-center">
            <button className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ============================================================================
// IMPORT CARD COMPONENT
// ============================================================================

function ImportCard({ type, filename, status, recordsProcessed, totalRecords, startedAt }: ImportStatus) {
  const progress = totalRecords > 0 ? (recordsProcessed / totalRecords) * 100 : 0;
  
  const statusConfig = {
    processing: { color: 'blue', bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
    completed: { color: 'green', bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
    failed: { color: 'red', bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
    pending: { color: 'gray', bg: 'bg-gray-100', text: 'text-gray-800', label: 'Pending' }
  };

  const config = statusConfig[status];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{filename}</h4>
          <p className="text-xs sm:text-sm text-gray-500 capitalize">{type} Import</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium ${config.bg} ${config.text} rounded-full flex-shrink-0 ml-2`}>
          {config.label}
        </span>
      </div>

      {status === 'processing' && (
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{recordsProcessed.toLocaleString()} / {totalRecords.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-blue-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500">
        Started: {new Date(startedAt).toLocaleString()}
      </div>
    </div>
  );
}

// ============================================================================
// ACTIVITY CARD COMPONENT
// ============================================================================

function ActivityCard({ type, message, timestamp, details }: ActivityItem) {
  const typeConfig = {
    import: { icon: '📥', color: 'text-blue-600' },
    user: { icon: '👤', color: 'text-purple-600' },
    system: { icon: '⚙️', color: 'text-green-600' },
    error: { icon: '❌', color: 'text-red-600' }
  };

  const config = typeConfig[type];
  const timeAgo = getTimeAgo(timestamp);

  return (
    <div className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-2 sm:space-x-3">
        <div className="flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-xs sm:text-sm">{config.icon}</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-900">{message}</p>
          {details && (
            <p className="text-xs text-gray-500 mt-1">{details}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}
