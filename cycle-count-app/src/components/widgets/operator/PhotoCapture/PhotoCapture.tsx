// ============================================================================
// PHOTO CAPTURE WIDGET - Camera interface for variance evidence
// ============================================================================

'use client';

import { useRef } from 'react';

interface PhotoCaptureProps {
  photoFile: File | null;
  photoPreview: string | null;
  onPhotoChange: (file: File | null, preview: string | null) => void;
  required?: boolean;
  className?: string;
}

export function PhotoCapture({ 
  photoFile, 
  photoPreview, 
  onPhotoChange, 
  required = false,
  className = '' 
}: PhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onPhotoChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Photo Evidence {required && '(Required for Finished Goods Mismatch)'}
      </label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      
      <button
        onClick={handleClick}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
      >
        {photoPreview ? (
          <div className="space-y-2">
            <img src={photoPreview} alt="Evidence" className="w-full h-32 object-cover rounded" />
            <p className="text-sm text-blue-600">Tap to change photo</p>
          </div>
        ) : (
          <div className="text-center">
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-gray-600">Take Photo</p>
          </div>
        )}
      </button>
    </div>
  );
}
