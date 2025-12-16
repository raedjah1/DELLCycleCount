// ============================================================================
// COUNT INPUT WIDGET - Main quantity input with variance display
// ============================================================================

'use client';

interface CountInputProps {
  value: string;
  onChange: (value: string) => void;
  expectedQty: number;
  label?: string;
  className?: string;
}

export function CountInput({ 
  value, 
  onChange, 
  expectedQty, 
  label = 'Actual Quantity',
  className = '' 
}: CountInputProps) {
  const variance = (parseInt(value) || 0) - expectedQty;
  const hasVariance = Math.abs(variance) > 0;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-16 text-3xl font-bold text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        placeholder="0"
        autoFocus
      />
      
      {value && (
        <div className={`mt-2 text-center ${hasVariance ? 'text-red-600' : 'text-green-600'}`}>
          <span className="text-sm font-medium">
            Variance: {variance > 0 ? '+' : ''}{variance}
            {hasVariance ? ` (${variance > 0 ? 'Over' : 'Under'})` : ' (Match)'}
          </span>
        </div>
      )}
    </div>
  );
}