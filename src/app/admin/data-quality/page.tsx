// ============================================================================
// DATA QUALITY ISSUES - Admin Data Quality Management
// ============================================================================
// Admin screen for reviewing and resolving data quality problems from imports

'use client';

import { useState } from 'react';

export default function DataQualityPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'locations' | 'items' | 'onhand' | 'transactions'>('all');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  // Mock data quality issues
  const [issues, setIssues] = useState<DataQualityIssue[]>([
    {
      id: '1',
      type: 'Invalid Location Format',
      source: 'Location Import',
      severity: 'error',
      description: 'Location code does not match canonical format',
      details: 'Expected: Warehouse.Business.Aisle.Bay.PositionLevel',
      recordData: 'Invalid-Location-123',
      createdAt: '2024-12-15T10:30:00Z',
      status: 'pending',
      count: 1
    },
    {
      id: '2',
      type: 'Unknown SKU',
      source: 'OnHand Import',
      severity: 'warning',
      description: 'Part number not found in item master',
      details: 'SKU: LAPTOP-XYZ-999 not found in system',
      recordData: 'Row 45: LAPTOP-XYZ-999, Qty: 5, Location: Reimage.ARB.AB.01.01A',
      createdAt: '2024-12-15T09:15:00Z',
      status: 'pending',
      count: 3
    },
    {
      id: '3',
      type: 'Missing Standard Cost',
      source: 'Item Import',
      severity: 'warning',
      description: 'Item has no standard cost defined',
      details: 'Standard cost is required for variance approval calculations',
      recordData: 'PART-NEW-001: Dell Monitor 24"',
      createdAt: '2024-12-15T08:45:00Z',
      status: 'resolved',
      count: 1,
      resolvedBy: 'Raed Jah',
      resolvedAt: '2024-12-15T11:00:00Z'
    },
    {
      id: '4',
      type: 'Duplicate Transaction ID',
      source: 'Transaction Import',
      severity: 'error',
      description: 'Transaction ID already exists in current batch',
      details: 'TxnId: TXN-2024-001 appears multiple times',
      recordData: 'Rows 12, 67, 89 contain duplicate TxnId',
      createdAt: '2024-12-14T16:20:00Z',
      status: 'pending',
      count: 3
    },
    {
      id: '5',
      type: 'Invalid ABC Class',
      source: 'Item Import',
      severity: 'warning',
      description: 'ABC class must be A, B, or C',
      details: 'Found values: X, D, Z',
      recordData: 'Multiple items with invalid ABC classifications',
      createdAt: '2024-12-14T14:10:00Z',
      status: 'ignored',
      count: 7,
      resolvedBy: 'John Smith',
      resolvedAt: '2024-12-14T15:30:00Z'
    }
  ]);

  const filteredIssues = issues.filter(issue => {
    if (selectedFilter === 'all') return true;
    switch (selectedFilter) {
      case 'locations': return issue.source === 'Location Import';
      case 'items': return issue.source === 'Item Import';
      case 'onhand': return issue.source === 'OnHand Import';
      case 'transactions': return issue.source === 'Transaction Import';
      default: return true;
    }
  });

  const pendingCount = issues.filter(i => i.status === 'pending').length;
  const errorCount = issues.filter(i => i.severity === 'error' && i.status === 'pending').length;
  const warningCount = issues.filter(i => i.severity === 'warning' && i.status === 'pending').length;

  const handleSelectIssue = (issueId: string) => {
    setSelectedIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleSelectAll = () => {
    const pendingIssues = filteredIssues.filter(i => i.status === 'pending').map(i => i.id);
    setSelectedIssues(prev => 
      prev.length === pendingIssues.length ? [] : pendingIssues
    );
  };

  const handleBulkResolve = () => {
    // TODO: Implement bulk resolve
    console.log('Bulk resolve:', selectedIssues);
    setSelectedIssues([]);
  };

  const handleBulkIgnore = () => {
    // TODO: Implement bulk ignore
    console.log('Bulk ignore:', selectedIssues);
    setSelectedIssues([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Pending Issues</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Critical Errors</p>
                <p className="text-2xl font-semibold text-gray-900">{errorCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Warnings</p>
                <p className="text-2xl font-semibold text-gray-900">{warningCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total Issues</p>
                <p className="text-2xl font-semibold text-gray-900">{issues.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filter by source:</span>
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All Issues' },
                  { key: 'locations', label: 'Locations' },
                  { key: 'items', label: 'Items' },
                  { key: 'onhand', label: 'OnHand' },
                  { key: 'transactions', label: 'Transactions' }
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key as any)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedFilter === filter.key
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedIssues.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedIssues.length} selected
                </span>
                <button
                  onClick={handleBulkResolve}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  Resolve Selected
                </button>
                <button
                  onClick={handleBulkIgnore}
                  className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Ignore Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Data Quality Issues ({filteredIssues.length})
              </h3>
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {selectedIssues.length === filteredIssues.filter(i => i.status === 'pending').length 
                  ? 'Deselect All' : 'Select All Pending'}
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredIssues.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Issues Found</h3>
                <p className="text-gray-500">All data quality issues have been resolved.</p>
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <DataQualityIssueRow
                  key={issue.id}
                  issue={issue}
                  isSelected={selectedIssues.includes(issue.id)}
                  onSelect={() => handleSelectIssue(issue.id)}
                  onResolve={(id) => {
                    // TODO: Implement resolve
                    console.log('Resolve issue:', id);
                  }}
                  onIgnore={(id) => {
                    // TODO: Implement ignore
                    console.log('Ignore issue:', id);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DATA QUALITY ISSUE ROW COMPONENT
// ============================================================================

interface DataQualityIssueRowProps {
  issue: DataQualityIssue;
  isSelected: boolean;
  onSelect: () => void;
  onResolve: (id: string) => void;
  onIgnore: (id: string) => void;
}

function DataQualityIssueRow({ issue, isSelected, onSelect, onResolve, onIgnore }: DataQualityIssueRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`px-6 py-4 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'} transition-colors`}>
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        {issue.status === 'pending' && (
          <div className="flex items-center h-5 pt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        )}

        {/* Issue Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Severity Badge */}
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                issue.severity === 'error' 
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {issue.severity === 'error' ? 'Error' : 'Warning'}
              </span>

              {/* Status Badge */}
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                issue.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
              </span>

              {/* Count Badge */}
              {issue.count > 1 && (
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                  {issue.count} instances
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {issue.status === 'pending' && (
                <>
                  <button
                    onClick={() => onResolve(issue.id)}
                    className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => onIgnore(issue.id)}
                    className="text-xs px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Ignore
                  </button>
                </>
              )}
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                {isExpanded ? 'Less' : 'Details'}
              </button>
            </div>
          </div>

          {/* Issue Summary */}
          <div className="mt-2">
            <h4 className="text-sm font-semibold text-gray-900">{issue.type}</h4>
            <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <span>Source: {issue.source}</span>
              <span className="mx-2">•</span>
              <span>{formatDateTime(issue.createdAt)}</span>
              {issue.resolvedBy && (
                <>
                  <span className="mx-2">•</span>
                  <span>Resolved by {issue.resolvedBy} on {formatDateTime(issue.resolvedAt!)}</span>
                </>
              )}
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-3">
                <div>
                  <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Details</h5>
                  <p className="text-sm text-gray-600 mt-1">{issue.details}</p>
                </div>
                
                <div>
                  <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Affected Data</h5>
                  <div className="text-sm text-gray-600 mt-1 font-mono bg-white p-2 rounded border">
                    {issue.recordData}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TYPES AND UTILITIES
// ============================================================================

interface DataQualityIssue {
  id: string;
  type: string;
  source: string;
  severity: 'error' | 'warning';
  description: string;
  details: string;
  recordData: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'ignored';
  count: number;
  resolvedBy?: string;
  resolvedAt?: string;
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
