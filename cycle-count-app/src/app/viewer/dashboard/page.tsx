// ============================================================================
// VIEWER DASHBOARD - Read-Only Reports and Metrics
// ============================================================================
// Dashboard with key metrics and report links for read-only access

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ViewerDashboard() {
  const [metricsData, setMetricsData] = useState({
    slaCompliance: {
      overall: 92.5,
      byWarehouse: {
        rawgoods: 94.2,
        production: 89.1,
        finishedgoods: 95.8
      }
    },
    varianceRate: 8.3,
    recountRate: 12.1,
    operatorProductivity: {
      average: 23.4,
      top: 31.2,
      countsPerHour: 15.8
    },
    verifiedCountOutcomes: {
      total: 47,
      resolved: 42,
      pending: 5
    },
    riskLocations: {
      total: 23,
      compliance: 87.2
    }
  });

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Warehouse cycle count analytics and performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span>Live Data</span>
            <span className="ml-4 text-xs">Last Updated: 2 min ago</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="SLA Compliance"
          value={`${metricsData.slaCompliance.overall}%`}
          change="+2.3%"
          changeType="positive"
          color="green"
          href="/viewer/sla-compliance"
        />
        <MetricCard 
          title="Variance Rate"
          value={`${metricsData.varianceRate}%`}
          change="-1.2%"
          changeType="positive"
          color="blue"
          href="/viewer/variance-analysis"
        />
        <MetricCard 
          title="Recount Rate"
          value={`${metricsData.recountRate}%`}
          change="+0.8%"
          changeType="negative"
          color="yellow"
          href="/viewer/recount-rates"
        />
        <MetricCard 
          title="Operator Productivity"
          value={`${metricsData.operatorProductivity.average} counts/day`}
          change="+5.2%"
          changeType="positive"
          color="purple"
          href="/viewer/operator-performance"
        />
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Compliance */}
        <ReportCard 
          title="SLA Compliance Report"
          description="Compliance rates by warehouse, product type, and zone"
          data={[
            { label: 'Raw Goods', value: metricsData.slaCompliance.byWarehouse.rawgoods, target: 95 },
            { label: 'Production', value: metricsData.slaCompliance.byWarehouse.production, target: 90 },
            { label: 'Finished Goods', value: metricsData.slaCompliance.byWarehouse.finishedgoods, target: 98 }
          ]}
          href="/viewer/sla-compliance"
        />

        {/* Variance Analysis */}
        <ReportCard 
          title="Variance Analysis"
          description="Count discrepancies and transaction reconciliation"
          data={[
            { label: 'Explained by Transactions', value: 73.2, isPercentage: true },
            { label: 'Unexplained Variance', value: 26.8, isPercentage: true },
            { label: 'Avg Time to Close', value: 2.4, unit: 'hours' }
          ]}
          href="/viewer/variance-analysis"
        />
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operator Performance */}
        <ReportCard 
          title="Operator Performance"
          description="Productivity metrics and accuracy rates by shift"
          data={[
            { label: 'Top Performer', value: metricsData.operatorProductivity.top, unit: 'counts/day' },
            { label: 'Team Average', value: metricsData.operatorProductivity.average, unit: 'counts/day' },
            { label: 'Counts per Hour', value: metricsData.operatorProductivity.countsPerHour, unit: 'avg' }
          ]}
          href="/viewer/operator-performance"
        />

        {/* Risk Location Analysis */}
        <ReportCard 
          title="Risk Location Analysis"
          description="Performance trends for flagged risk locations"
          data={[
            { label: 'Total Risk Locations', value: metricsData.riskLocations.total, unit: 'locations' },
            { label: 'Risk Location Compliance', value: metricsData.riskLocations.compliance, isPercentage: true },
            { label: 'Variance vs Non-Risk', value: 2.3, unit: 'x higher' }
          ]}
          href="/viewer/risk-analysis"
        />
      </div>

      {/* Verified Count Outcomes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Verified Count Outcomes</h2>
          <Link href="/viewer/verified-counts" className="text-sm text-blue-600 hover:text-blue-800">
            View Detailed Report →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{metricsData.verifiedCountOutcomes.total}</p>
            <p className="text-sm text-gray-600 mt-1">Total Count 3 Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{metricsData.verifiedCountOutcomes.resolved}</p>
            <p className="text-sm text-gray-600 mt-1">Resolved Cases</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{metricsData.verifiedCountOutcomes.pending}</p>
            <p className="text-sm text-gray-600 mt-1">Pending Review</p>
          </div>
        </div>
        
        <div className="mt-4 bg-gray-100 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(metricsData.verifiedCountOutcomes.resolved / metricsData.verifiedCountOutcomes.total) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {Math.round((metricsData.verifiedCountOutcomes.resolved / metricsData.verifiedCountOutcomes.total) * 100)}% Resolution Rate
        </p>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ExportButton 
            title="Full Dashboard Export"
            description="Complete metrics summary"
            format="Excel"
            icon="📊"
          />
          <ExportButton 
            title="SLA Compliance Report"
            description="Detailed compliance analysis"
            format="PDF"
            icon="📈"
          />
          <ExportButton 
            title="Performance Summary"
            description="Team and operator metrics"
            format="CSV"
            icon="👥"
          />
        </div>
      </div>

      {/* Data Disclaimer */}
      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg">
        <div className="flex items-start">
          <div className="ml-3">
            <p className="text-sm text-gray-700">
              <strong>Data Note:</strong> All metrics are updated in real-time based on current cycle count operations. 
              Historical data is retained according to company policy. Contact your administrator for data questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VIEWER DASHBOARD COMPONENTS
// ============================================================================

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color: 'green' | 'blue' | 'yellow' | 'purple';
  href?: string;
}

function MetricCard({ title, value, change, changeType, color, href }: MetricCardProps) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600'
  };

  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const content = (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${colorClasses[color]} transition-shadow hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeColors[changeType || 'neutral']}`}>
              {change} vs last period
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  return content;
}

interface ReportCardProps {
  title: string;
  description: string;
  data: Array<{
    label: string;
    value: number;
    target?: number;
    isPercentage?: boolean;
    unit?: string;
  }>;
  href: string;
}

function ReportCard({ title, description, data, href }: ReportCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="font-semibold text-gray-900">
              {item.value}{item.isPercentage ? '%' : ''}{item.unit && ` ${item.unit}`}
              {item.target && (
                <span className="text-xs text-gray-500 ml-1">
                  (target: {item.target}%)
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link 
          href={href}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View Full Report →
        </Link>
      </div>
    </div>
  );
}

interface ExportButtonProps {
  title: string;
  description: string;
  format: string;
  icon: string;
}

function ExportButton({ title, description, format, icon }: ExportButtonProps) {
  return (
    <button className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group text-left">
      <span className="text-2xl mr-3">{icon}</span>
      <div className="flex-1">
        <p className="font-medium text-gray-900 group-hover:text-gray-700">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 ml-2">
        {format}
      </span>
    </button>
  );
}
