// ============================================================================
// AUTHENTICATION SCHEMAS - Validation Layer
// ============================================================================
// Zod schemas for authentication forms, separated from components

import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  remember_device: z.boolean().optional()
});

export const userRegistrationSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  role: z.enum([
    'admin',
    'ic_owner', 
    'ic_manager',
    'warehouse_manager',
    'warehouse_supervisor',
    'lead',
    'operator',
    'viewer'
  ]),
  shift_type: z.enum(['A', 'B', 'C']),
  zone_access: z.array(z.string()).optional()
});

export const passwordResetSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
});

export const changePasswordSchema = z.object({
  current_password: z
    .string()
    .min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(6, 'New password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters'),
  confirm_password: z
    .string()
    .min(1, 'Please confirm your new password')
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

// Export types derived from schemas
export type LoginSchema = z.infer<typeof loginSchema>;
export type UserRegistrationSchema = z.infer<typeof userRegistrationSchema>;
export type PasswordResetSchema = z.infer<typeof passwordResetSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
