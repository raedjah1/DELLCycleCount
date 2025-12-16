// ============================================================================
// TOP PROGRESS BAR - Subtle loading indicator at top of page
// ============================================================================

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function TopProgressBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-blue-50">
      <div className="h-full bg-blue-600 animate-pulse" style={{ width: '30%' }}></div>
    </div>
  );
}

