'use client';

// Global Error Page
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-600 mb-4">An error occurred while loading this page.</p>
        <button 
          onClick={reset}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors mr-4"
        >
          Try Again
        </button>
        <a 
          href="/" 
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
