// ============================================================================
// CLASS NAME UTILITY - Pure Function
// ============================================================================
// Utility for combining class names, separated from components

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
