// ============================================================================
// TYPE DEFINITIONS - Warehouse Cycle Count Module
// ============================================================================

// ============================================================================
// CORE SYSTEM TYPES
// ============================================================================

export type Role = 
  | 'admin'
  | 'ic_owner'
  | 'ic_manager' 
  | 'warehouse_manager'
  | 'warehouse_supervisor'
  | 'lead'
  | 'operator'
  | 'viewer';

export type WarehouseType = 'rawgoods' | 'production' | 'finishedgoods';

export type ProductType = 'laptop' | 'server' | 'switches' | 'desktop' | 'aio';

export type ABCClass = 'A' | 'B' | 'C';

export type CountType = 'count_1' | 'count_2' | 'count_3';

export type LineStatus = 'unstarted' | 'in_progress' | 'completed' | 'needs_recount';

export type JournalStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export type AvailabilityStatus = 'present_available' | 'on_break' | 'on_lunch' | 'not_available';

export type ShiftType = 'A' | 'B' | 'C';

export type TxnType = 'move_in' | 'move_out' | 'receipt' | 'putaway' | 'pick' | 'issue' | 'scrap' | 'adjustment';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'pending_dual';

// ============================================================================
// DATABASE ENTITIES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  is_verified_counter: boolean;
  shift_type: ShiftType;
  availability_status: AvailabilityStatus;
  zone_access?: string[];
  created_at: string;
  updated_at: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
  remember_device?: boolean;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  type?: 'text' | 'number' | 'email' | 'password';
}
