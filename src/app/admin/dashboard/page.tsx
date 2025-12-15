// ============================================================================
// ADMIN DASHBOARD - Professional System Overview and Management
// ============================================================================
// Modern, widget-based admin console with professional design

'use client';

import { useState, useEffect } from 'react';
import { 
  SystemMetricsWidget, 
  QuickActionsWidget, 
  SystemStatusWidget 
} from '@/components/widgets/admin';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Mock data - In production, this would come from APIs
  const systemMetrics = {
    totalLocations: 1250,
    totalItems: 3450,
    totalUsers: 45,
    dataQualityIssues: 3,
    locationsChange: 2.5,
    itemsChange: 8.1,
    usersChange: 0
  };

  const alertCounts = {
    dataQualityIssues: 3,
    failedImports: 0,
    systemAlerts: 1
  };


  const recentActivity = [
    {
      id: '1',
      type: 'import' as const,
      message: 'OnHand data imported successfully',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      details: '12,543 records processed'
    },
    {
      id: '2',
      type: 'user' as const,
      message: 'New user registered: john.doe@example.com',
      timestamp: new Date(Date.now() - 900000).toISOString()
    },
    {
      id: '3',
      type: 'system' as const,
      message: 'Daily backup completed successfully',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      details: 'Database backup size: 2.4 GB'
    },
    {
      id: '4',
      type: 'import' as const,
      message: 'Transaction data imported',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      details: '8,721 transactions processed'
    }
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Content - Now starts higher */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* System Metrics Widget */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
            <SystemMetricsWidget metrics={systemMetrics} />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Quick Actions - Takes up 2 columns */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
                <QuickActionsWidget alertCounts={alertCounts} />
              </div>
            </div>

            {/* System Status - Takes up 1 column */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
                <SystemStatusWidget 
                  recentActivity={recentActivity}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DASHBOARD COMPONENTS
// ============================================================================

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Metrics Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl h-32"></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="xl:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-50 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
