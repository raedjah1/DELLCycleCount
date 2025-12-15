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

export interface Location {
  id: string;
  location_code: string;
  warehouse: string;
  business: string;
  aisle: string;
  bay: string;
  position_level: string;
  zone_id: string;
  is_risk_location: boolean;
  risk_reason?: string;
  risk_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Zone {
  id: string;
  zone_code: string;
  name: string;
  description?: string;
  warehouse: string;
  default_journal_size: number;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  part_number: string;
  description: string;
  product_type: ProductType;
  warehouse_type: WarehouseType;
  abc_class: ABCClass;
  standard_cost: number;
  rawgoods_serial_required: boolean;
  is_high_impact: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnHandSnapshot {
  id: string;
  as_of_timestamp: string;
  location_code: string;
  part_number: string;
  expected_qty: number;
  review_cycle_id: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  txn_id: string;
  txn_time: string;
  txn_type: TxnType;
  part_number: string;
  qty: number;
  from_location?: string;
  to_location?: string;
  ref_doc?: string;
  review_cycle_id: string;
  created_at: string;
}

export interface ReviewCycle {
  id: string;
  cycle_date: string;
  is_weekday: boolean;
  cutoff_time: string;
  status: 'active' | 'closed';
  onhand_imported_at?: string;
  transactions_imported_at?: string;
  created_at: string;
  closed_at?: string;
}

export interface CountPlan {
  id: string;
  review_cycle_id: string;
  location_id: string;
  item_id: string;
  expected_qty: number;
  sla_frequency_days: number;
  is_risk_override: boolean;
  created_at: string;
}

export interface Journal {
  id: string;
  count_plan_id: string;
  zone_id: string;
  assigned_user_id?: string;
  status: JournalStatus;
  total_lines: number;
  completed_lines: number;
  created_at: string;
  assigned_at?: string;
  started_at?: string;
  completed_at?: string;
}

export interface JournalLine {
  id: string;
  journal_id: string;
  location_id: string;
  item_id: string;
  sequence_number: number;
  expected_qty_at_count: number;
  standard_cost_at_count: number;
  status: LineStatus;
  line_created_timestamp: string;
  line_submit_timestamp?: string;
  claimed_by_user_id?: string;
  claimed_at?: string;
  claim_timeout_at?: string;
}

export interface CountSubmission {
  id: string;
  journal_line_id: string;
  count_type: CountType;
  submitted_by_user_id: string;
  counted_qty: number;
  serial_numbers?: string[];
  evidence_photo_path?: string;
  net_movement_during_window: number;
  reconciled_expected_qty: number;
  unexplained_delta_qty: number;
  is_explained_by_txn: boolean;
  submitted_at: string;
  created_at: string;
}

export interface VarianceReview {
  id: string;
  journal_line_id: string;
  count_1_submission_id: string;
  count_2_submission_id?: string;
  count_3_submission_id?: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'sent_to_verified';
  reviewed_by_user_id?: string;
  reviewed_at?: string;
  comments?: string;
  created_at: string;
}

export interface Approval {
  id: string;
  variance_review_id: string;
  approval_type: 'single' | 'dual_ic_manager' | 'dual_warehouse_manager';
  status: ApprovalStatus;
  approved_by_user_id?: string;
  approved_at?: string;
  comments?: string;
  requires_dual: boolean;
  dual_approver_user_id?: string;
  dual_approved_at?: string;
  dual_comments?: string;
  created_at: string;
}

export interface DispatchPool {
  id: string;
  journal_line_id: string;
  count_type: CountType;
  priority: number;
  reason: string;
  created_at: string;
  assigned_at?: string;
  assigned_by_user_id?: string;
}

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: 'create' | 'update' | 'delete';
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  user_id: string;
  created_at: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
  remember_device?: boolean;
}

export interface CountFormData {
  counted_qty: number;
  serial_numbers?: string[];
  notes?: string;
}

export interface VarianceReviewFormData {
  action: 'approve' | 'reject' | 'send_to_verified';
  comments: string;
}

export interface ApprovalFormData {
  decision: 'approve' | 'reject';
  comments: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface SystemConfig {
  variance_threshold_percent: number;
  count_disagreement_threshold: number;
  high_impact_cost_threshold: number;
  default_journal_size: number;
  claim_timeout_minutes: number;
  inactivity_timeout_minutes: number;
}

export interface ShiftDefinition {
  shift_type: ShiftType;
  start_time: string;
  end_time: string;
  break_start: string;
  break_end: string;
  lunch_start: string;
  lunch_end: string;
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

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  roles: Role[];
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}
