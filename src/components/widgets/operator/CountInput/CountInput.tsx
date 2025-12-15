// ============================================================================
// COUNT INPUT - Widget for entering count value
// ============================================================================

'use client';

interface CountInputProps {
  value: number | '';
  onChange: (value: number | '') => void;
  expectedQty: number;
  error?: string;
}

export function CountInput({ value, onChange, expectedQty, error }: CountInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Count Quantity
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === '' ? '' : parseInt(val, 10));
          }}
          min="0"
          className={`w-full px-4 py-4 text-2xl font-semibold text-center border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-900 ${
            error
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="0"
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      <p className="mt-2 text-sm text-gray-500 text-center">
        Expected: <span className="font-medium">{expectedQty}</span>
      </p>
    </div>
  );
}
