// ============================================================================
// ITEM INFO CARD WIDGET - Display item details and expected quantity
// ============================================================================

'use client';

import { JournalLine } from '@/lib/services/journalService';

interface ItemInfoCardProps {
  line: JournalLine;
  className?: string;
}

export function ItemInfoCard({ line, className = '' }: ItemInfoCardProps) {
  const requiresSerialNumbers = line.item.serial_flag === 'Y';

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-blue-600 mb-2">{line.expected_qty}</div>
        <p className="text-gray-600">Expected Quantity</p>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Part Number:</span>
          <span className="font-medium">{line.item.part_no}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Description:</span>
          <span className="font-medium text-right flex-1 ml-2">{line.item.description}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Serial Required:</span>
          <span className="font-medium">{requiresSerialNumbers ? 'Yes' : 'No'}</span>
        </div>
        {line.item.warehouse_type && (
          <div className="flex justify-between">
            <span className="text-gray-600">Warehouse Type:</span>
            <span className="font-medium">{line.item.warehouse_type}</span>
          </div>
        )}
      </div>
    </div>
  );
}
