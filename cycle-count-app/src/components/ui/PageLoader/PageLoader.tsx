// ============================================================================
// PAGE LOADER - Professional smooth loading animation for page transitions
// ============================================================================

'use client';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center space-y-4">
        {/* Smooth animated spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
          {/* Animated ring */}
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          {/* Inner pulsing dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading text */}
        <p className="text-sm font-medium text-gray-700 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}

