// ============================================================================
// PHOTO CAPTURE SECTION - Widget for capturing location photos (Finished Goods)
// ============================================================================

'use client';

interface PhotoCaptureSectionProps {
  photoUrl?: string;
  onCapture: () => void;
  onRetake: () => void;
  required: boolean;
}

export function PhotoCaptureSection({
  photoUrl,
  onCapture,
  onRetake,
  required
}: PhotoCaptureSectionProps) {
  if (!required) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Location Photo Required
        </h4>
        <p className="text-xs text-gray-600 mt-1">
          Capture a photo of the location label as evidence
        </p>
      </div>

      {photoUrl ? (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden border-2 border-gray-300">
            <img src={photoUrl} alt="Location label" className="w-full h-48 object-cover" />
          </div>
          <button
            onClick={onRetake}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Retake Photo
          </button>
        </div>
      ) : (
        <button
          onClick={onCapture}
          className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Capture Photo
        </button>
      )}
    </div>
  );
}
