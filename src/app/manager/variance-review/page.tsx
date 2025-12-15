// ============================================================================
// RAW GOODS VARIANCE REVIEW - Review count discrepancies and transaction reconciliation
// ============================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VarianceReviewPage() {
  const router = useRouter();
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  // Mock data
  const [variances] = useState([
    {
      id: '1',
      partNumber: 'PART-001',
      locationCode: 'Reimage.ARB.AB.01.01A',
      expectedQty: 10,
      count1: 8,
      count2: 9,
      deltaExpectedCount1: -2,
      deltaExpectedCount2: -1,
      deltaCount1Count2: 1,
      status: 'Pending Review'
    },
    {
      id: '2',
      partNumber: 'PART-002',
      locationCode: 'Reimage.ARB.AB.01.02A',
      expectedQty: 5,
      count1: 5,
      count2: 5,
      deltaExpectedCount1: 0,
      deltaExpectedCount2: 0,
      deltaCount1Count2: 0,
      status: 'Explained by Transactions'
    }
  ]);

  const selectedVariance = variances.find(v => v.id === selectedRow);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/manager/dashboard')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Variance Review</h1>
          <p className="text-gray-600 mt-2">Review count discrepancies and transaction reconciliation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Variance Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part / Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count 1</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count 2</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delta</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {variances.map((variance) => (
                      <tr
                        key={variance.id}
                        onClick={() => setSelectedRow(variance.id)}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedRow === variance.id ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{variance.partNumber}</div>
                          <div className="text-sm text-gray-500">{variance.locationCode}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variance.expectedQty}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variance.count1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variance.count2}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            variance.deltaExpectedCount2 === 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {variance.deltaExpectedCount2 > 0 ? '+' : ''}{variance.deltaExpectedCount2}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            variance.status === 'Explained by Transactions'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {variance.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-800">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Transaction Reconciliation Panel */}
          <div>
            {selectedVariance ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Reconciliation</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Expected Qty</span>
                    <p className="font-medium text-gray-900">{selectedVariance.expectedQty}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Net Movement</span>
                    <p className="font-medium text-gray-900">+2</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Reconciled Expected</span>
                    <p className="font-medium text-gray-900">12</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Unexplained Delta</span>
                    <p className="font-medium text-red-600">-3</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Send to Verified Counter
                    </button>
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                      Approve Adjustment
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-gray-500 text-center">Select a variance to view reconciliation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
