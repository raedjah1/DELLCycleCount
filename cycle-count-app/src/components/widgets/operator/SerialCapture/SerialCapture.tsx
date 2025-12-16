// ============================================================================
// SERIAL CAPTURE WIDGET - Serial number input and management
// ============================================================================

'use client';

import { useState } from 'react';

interface SerialCaptureProps {
  serialNumbers: string[];
  onAddSerial: (serial: string) => void;
  onRemoveSerial: (index: number) => void;
  expectedCount: number;
  className?: string;
}

export function SerialCapture({ 
  serialNumbers, 
  onAddSerial, 
  onRemoveSerial, 
  expectedCount,
  className = '' 
}: SerialCaptureProps) {
  const [serialInput, setSerialInput] = useState('');

  const handleAddSerial = () => {
    if (serialInput.trim() && !serialNumbers.includes(serialInput.trim())) {
      onAddSerial(serialInput.trim());
      setSerialInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSerial();
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Serial Numbers ({serialNumbers.length} / {expectedCount})
      </label>
      
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={serialInput}
          onChange={(e) => setSerialInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          placeholder="Scan or enter serial number"
        />
        <button
          onClick={handleAddSerial}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>
      
      {serialNumbers.length > 0 && (
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {serialNumbers.map((serial, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm font-mono">{serial}</span>
              <button
                onClick={() => onRemoveSerial(index)}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
