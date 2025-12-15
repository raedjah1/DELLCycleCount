// ============================================================================
// SERIAL CAPTURE SECTION - Widget for capturing serial numbers
// ============================================================================

'use client';

interface SerialCaptureSectionProps {
  partNumber: string;
  expectedSerialCount: number;
  capturedSerials: string[];
  onAddSerial: (serial: string) => void;
  onRemoveSerial: (serial: string) => void;
  onOpenSerialCapture: () => void;
}

export function SerialCaptureSection({
  partNumber,
  expectedSerialCount,
  capturedSerials,
  onAddSerial,
  onRemoveSerial,
  onOpenSerialCapture
}: SerialCaptureSectionProps) {
  const isComplete = capturedSerials.length === expectedSerialCount;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Serial Numbers Required</h4>
          <p className="text-xs text-gray-600 mt-1">
            Part: {partNumber} • Expected: {expectedSerialCount} serials
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          isComplete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {capturedSerials.length} / {expectedSerialCount}
        </span>
      </div>

      {capturedSerials.length > 0 && (
        <div className="mb-3 space-y-2">
          {capturedSerials.map((serial, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-200"
            >
              <span className="text-sm font-mono text-gray-900">{serial}</span>
              <button
                onClick={() => onRemoveSerial(serial)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onOpenSerialCapture}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        {capturedSerials.length === 0 ? 'Capture Serials' : 'Add More Serials'}
      </button>
    </div>
  );
}
