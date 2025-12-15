// ============================================================================
// AUTHENTICATION VALIDATIONS - Business Rule Validation
// ============================================================================
// Pure validation functions separated from forms and UI

import { LoginFormData } from '@/types';
import { VALIDATION_RULES } from '@/lib/constants';

export interface ValidationResult {
  success: boolean;
  errors: string[];
}

/**
 * Validate login credentials format
 */
export function validateLoginCredentials(credentials: LoginFormData): ValidationResult {
  const errors: string[] = [];

  // Email validation
  if (!credentials.email) {
    errors.push('Email is required');
  } else if (!isValidEmail(credentials.email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  if (!credentials.password) {
    errors.push('Password is required');
  } else if (credentials.password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters`);
  }

  return {
    success: errors.length === 0,
    errors
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): ValidationResult {
  const errors: string[] = [];

  if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters`);
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    success: errors.length === 0,
    errors
  };
}

/**
 * Validate user role permissions
 */
export function canUserAccessRoute(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole) || requiredRoles.includes('*');
}
