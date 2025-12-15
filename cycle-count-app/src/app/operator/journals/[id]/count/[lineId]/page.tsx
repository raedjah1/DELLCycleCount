// ============================================================================
// COUNT SCREEN - Primary counting interface for operators
// ============================================================================

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CountInput } from '@/components/widgets/operator/CountInput';
import { SerialCaptureSection } from '@/components/widgets/operator/SerialCaptureSection';
import { PhotoCaptureSection } from '@/components/widgets/operator/PhotoCaptureSection';

export default function CountScreenPage() {
  const params = useParams();
  const router = useRouter();
  const journalId = params.id as string;
  const lineId = params.lineId as string;

  // Mock data - will be replaced with real data from API
  const [lineData] = useState({
    id: lineId,
    locationCode: 'Reimage.ARB.AB.01.01A',
    partNumber: 'PART-001',
    description: 'Laptop Component',
    expectedQty: 10,
    warehouseType: 'Rawgoods' as const,
    serialRequired: true,
    expectedSerialCount: 10
  });

  const [countValue, setCountValue] = useState<number | ''>('');
  const [capturedSerials, setCapturedSerials] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const isFinishedGoods = lineData.warehouseType === 'Finishedgoods';
  const photoRequired = isFinishedGoods && countValue !== '' && countValue !== lineData.expectedQty;

  const canSubmit = () => {
    if (countValue === '') return false;
    if (lineData.serialRequired && capturedSerials.length !== lineData.expectedSerialCount) return false;
    if (photoRequired && !photoUrl) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;

    setIsSubmitting(true);
    setError('');

    try {
      // TODO: Submit count to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to journal
      router.push(`/operator/journals/${journalId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit count');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenSerialCapture = () => {
    // TODO: Open serial capture modal/screen
    console.log('Open serial capture');
  };

  const handleCapturePhoto = () => {
    // TODO: Open camera/photo capture
    // For now, simulate with a placeholder
    setPhotoUrl('/placeholder-photo.jpg');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/operator/journals/${journalId}`)}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Journal
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{lineData.locationCode}</h1>
        </div>

        {/* Part Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Part Number</span>
              <p className="font-medium text-gray-900">{lineData.partNumber}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Description</span>
              <p className="font-medium text-gray-900">{lineData.description}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Warehouse Type</span>
              <p className="font-medium text-gray-900">{lineData.warehouseType}</p>
            </div>
          </div>
        </div>

        {/* Count Input */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <CountInput
            value={countValue}
            onChange={setCountValue}
            expectedQty={lineData.expectedQty}
            error={error}
          />
        </div>

        {/* Serial Capture (if required) */}
        {lineData.serialRequired && (
          <div className="mb-6">
            <SerialCaptureSection
              partNumber={lineData.partNumber}
              expectedSerialCount={lineData.expectedSerialCount}
              capturedSerials={capturedSerials}
              onAddSerial={(serial) => setCapturedSerials([...capturedSerials, serial])}
              onRemoveSerial={(serial) => setCapturedSerials(capturedSerials.filter(s => s !== serial))}
              onOpenSerialCapture={handleOpenSerialCapture}
            />
          </div>
        )}

        {/* Photo Capture (if required) */}
        <div className="mb-6">
          <PhotoCaptureSection
            photoUrl={photoUrl}
            onCapture={handleCapturePhoto}
            onRetake={() => setPhotoUrl(undefined)}
            required={photoRequired}
          />
        </div>

        {/* Submit Button */}
        <div className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit() || isSubmitting}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Count'
            )}
          </button>

          <button
            onClick={() => router.push(`/operator/journals/${journalId}`)}
            className="w-full px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
