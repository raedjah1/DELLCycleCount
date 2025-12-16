// ============================================================================
// TRANSACTION RECONCILIATION WIDGET - Show transactions that explain variance
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { Variance, Transaction, ManagerService } from '@/lib/services/managerService';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';

interface TransactionReconciliationProps {
  variance: Variance | null;
  className?: string;
}

export function TransactionReconciliation({ 
  variance, 
  className = '' 
}: TransactionReconciliationProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [reconciledExpected, setReconciledExpected] = useState<number | null>(null);

  useEffect(() => {
    if (variance) {
      loadTransactions();
    } else {
      setTransactions([]);
      setReconciledExpected(null);
    }
  }, [variance]);

  const loadTransactions = async () => {
    if (!variance) return;

    try {
      setLoading(true);
      const endDate = new Date().toISOString();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Last 7 days

      const txs = await ManagerService.getTransactionsForVariance(
        variance.location_code,
        variance.part_number,
        startDate.toISOString(),
        endDate
      );

      setTransactions(txs);

      // Calculate reconciled expected
      const netMovement = txs.reduce((sum, tx) => {
        const movement = ['Receipt', 'Putaway'].includes(tx.transaction_type) ? tx.quantity :
                         ['Pick', 'Issue', 'Scrap'].includes(tx.transaction_type) ? -tx.quantity : 0;
        return sum + movement;
      }, 0);

      setReconciledExpected(variance.expected_qty + netMovement);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!variance) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
        <p className="text-gray-500 text-center">Select a variance to view transaction reconciliation</p>
      </div>
    );
  }

  const unexplainedDelta = reconciledExpected !== null 
    ? variance.final_count - reconciledExpected 
    : variance.variance_qty;

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Reconciliation</h3>

      {loading ? (
        <LoadingSpinner message="Loading transactions..." size="sm" />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Expected Qty</span>
              <p className="font-medium text-gray-900">{variance.expected_qty}</p>
            </div>
            <div>
              <span className="text-gray-600">Net Movement</span>
              <p className="font-medium text-gray-900">
                {reconciledExpected !== null 
                  ? (reconciledExpected - variance.expected_qty > 0 ? '+' : '')
                  : ''}
                {reconciledExpected !== null ? reconciledExpected - variance.expected_qty : 'N/A'}
              </p>
            </div>
            {reconciledExpected !== null && (
              <>
                <div>
                  <span className="text-gray-600">Reconciled Expected</span>
                  <p className="font-medium text-gray-900">{reconciledExpected}</p>
                </div>
                <div>
                  <span className="text-gray-600">Unexplained Delta</span>
                  <p className={`font-medium ${unexplainedDelta === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {unexplainedDelta > 0 ? '+' : ''}{unexplainedDelta}
                  </p>
                </div>
              </>
            )}
          </div>

          {transactions.length > 0 ? (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Transactions</h4>
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="px-3 py-2 text-gray-900">
                          {new Date(tx.transaction_date).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 text-gray-900">{tx.transaction_type}</td>
                        <td className="px-3 py-2 text-right text-gray-900">
                          {tx.quantity > 0 ? '+' : ''}{tx.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No transactions found in the last 7 days
            </p>
          )}

          {unexplainedDelta === 0 && reconciledExpected !== null && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Variance explained by transactions
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
