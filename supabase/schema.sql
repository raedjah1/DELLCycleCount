-- ============================================================================
-- WAREHOUSE CYCLE COUNT - DATABASE SCHEMA
-- ============================================================================
-- Location: /supabase/schema.sql
-- Purpose: Complete database schema for warehouse cycle count module
-- 
-- Run this in Supabase SQL Editor to create all tables

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE warehouse_type AS ENUM ('Rawgoods', 'Production', 'Finishedgoods');
CREATE TYPE product_type AS ENUM ('Laptop', 'Server', 'Switches', 'Desktop', 'AIO');
CREATE TYPE abc_class AS ENUM ('A', 'B', 'C');
CREATE TYPE user_role AS ENUM (
  'Admin',
  'IC_Owner',
  'IC_Manager',
  'Warehouse_Manager',
  'Warehouse_Supervisor',
  'Lead',
  'Operator',
  'Viewer'
);
CREATE TYPE shift_type AS ENUM ('Day', 'Night', 'Swing');
CREATE TYPE line_status AS ENUM ('Unstarted', 'In Progress', 'Completed', 'Needs Recount');
CREATE TYPE count_type AS ENUM ('Count 1', 'Count 2', 'Count 3');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE transaction_type AS ENUM ('Move', 'Receipt', 'Putaway', 'Pick', 'Issue', 'Scrap', 'Adjustment');

-- ============================================================================
-- USERS & AUTHENTICATION (extends Supabase auth.users)
-- ============================================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'Operator',
  shift shift_type NOT NULL DEFAULT 'Day',
  zones TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_verified_counter BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MASTER DATA
-- ============================================================================

-- Locations (matches source Location table exactly)
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id BIGINT, -- ProgramID from source
  warehouse TEXT, -- Warehouse (can be empty in source)
  location_no TEXT, -- LocationNo (may start with dot, missing warehouse)
  building TEXT NOT NULL, -- Building (maps to Business)
  bay TEXT NOT NULL, -- Bay (maps to Aisle)
  row TEXT NOT NULL, -- Row (maps to Bay number)
  tier TEXT NOT NULL, -- Tier (maps to PositionLevel)
  bin TEXT, -- Bin (full location code: ARB.AF.01.01B)
  location_group TEXT, -- LocationGroup (maps to Zone)
  volume DECIMAL(10, 2) DEFAULT 0,
  height DECIMAL(10, 2) DEFAULT 0,
  width DECIMAL(10, 2) DEFAULT 0,
  length DECIMAL(10, 2) DEFAULT 0,
  -- Canonical location code (derived/validated)
  location_code TEXT NOT NULL UNIQUE, -- Full canonical: Warehouse.Business.Aisle.Bay.PositionLevel
  -- Additional cycle count fields
  is_risk_location BOOLEAN DEFAULT false,
  risk_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_location_format CHECK (
    location_code ~ '^[^.]+\\.[^.]+\\.[^.]+\\.[^.]+\\.[^.]+$'
  )
);

-- Items/Products (matches source Part table exactly)
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id BIGINT, -- Original ID from source system
  name TEXT NOT NULL,
  part_no TEXT NOT NULL UNIQUE, -- PartNo
  description TEXT NOT NULL,
  manufacture_part_no TEXT, -- ManufacturePartNo
  model_no TEXT, -- ModelNo
  serial_flag TEXT NOT NULL DEFAULT 'N', -- SerialFlag: 'Y' or 'N'
  primary_commodity TEXT, -- PrimaryCommodity (can be 'NA')
  secondary_commodity TEXT, -- SecondaryCommodity (can be 'NA')
  part_type TEXT NOT NULL, -- PartType: 'Part', 'Component', etc.
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- Status: 'ACTIVE', etc.
  username TEXT, -- Username (email of creator)
  create_date TIMESTAMPTZ, -- CreateDate
  last_activity_date TIMESTAMPTZ, -- LastActivityDate
  -- Additional fields for cycle count module
  warehouse_type warehouse_type, -- For cycle count logic (can be set manually or derived)
  abc_class abc_class, -- For SLA calculations (can be set manually)
  standard_cost DECIMAL(10, 2), -- For high-impact calculations (can be set manually)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Zones
CREATE TABLE public.zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  warehouse TEXT NOT NULL,
  journal_size_default INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- REVIEW CYCLES & PLANS
-- ============================================================================

CREATE TABLE public.review_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle_date DATE NOT NULL UNIQUE,
  status TEXT DEFAULT 'open', -- 'open', 'closed'
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.count_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_cycle_id UUID REFERENCES public.review_cycles(id),
  location_id UUID REFERENCES public.locations(id),
  item_id UUID REFERENCES public.items(id),
  expected_qty INTEGER NOT NULL,
  expected_qty_at_count INTEGER NOT NULL, -- Snapshot for historical reporting
  standard_cost_at_count DECIMAL(10, 2), -- Snapshot for historical reporting
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(review_cycle_id, location_id)
);

-- ============================================================================
-- JOURNALS & LINES
-- ============================================================================

CREATE TABLE public.journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journal_number TEXT NOT NULL UNIQUE,
  zone TEXT NOT NULL,
  warehouse TEXT NOT NULL,
  assigned_to UUID REFERENCES public.users(id),
  total_lines INTEGER NOT NULL,
  completed_lines INTEGER DEFAULT 0,
  status TEXT DEFAULT 'assigned', -- 'assigned', 'in_progress', 'completed'
  assigned_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.journal_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journal_id UUID REFERENCES public.journals(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.count_plans(id),
  location_id UUID REFERENCES public.locations(id),
  item_id UUID REFERENCES public.items(id),
  sequence_number INTEGER NOT NULL,
  status line_status DEFAULT 'Unstarted',
  expected_qty INTEGER NOT NULL,
  line_created_timestamp TIMESTAMPTZ DEFAULT NOW(),
  line_submit_timestamp TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,
  claimed_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(journal_id, sequence_number)
);

-- ============================================================================
-- COUNTS & SUBMISSIONS
-- ============================================================================

CREATE TABLE public.count_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journal_line_id UUID REFERENCES public.journal_lines(id),
  count_type count_type NOT NULL,
  count_value INTEGER NOT NULL,
  submitted_by UUID REFERENCES public.users(id),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  photo_url TEXT, -- For Finished Goods mismatches
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.serial_captures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  count_submission_id UUID REFERENCES public.count_submissions(id) ON DELETE CASCADE,
  serial_number TEXT NOT NULL,
  captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TRANSACTIONS (Current Cycle Only - Purged After Close)
-- ============================================================================

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  txn_id TEXT NOT NULL UNIQUE,
  txn_time TIMESTAMPTZ NOT NULL,
  txn_type transaction_type NOT NULL,
  part_number TEXT NOT NULL,
  qty INTEGER NOT NULL,
  from_location TEXT,
  to_location TEXT,
  ref_doc TEXT,
  review_cycle_id UUID REFERENCES public.review_cycles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ONHAND SNAPSHOTS (Current Cycle Only - Purged After Close)
-- ============================================================================

CREATE TABLE public.onhand_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  as_of_timestamp TIMESTAMPTZ NOT NULL,
  location_code TEXT NOT NULL,
  part_number TEXT NOT NULL,
  expected_qty INTEGER NOT NULL,
  review_cycle_id UUID REFERENCES public.review_cycles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- VARIANCE REVIEW & RECONCILIATION
-- ============================================================================

CREATE TABLE public.variance_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journal_line_id UUID REFERENCES public.journal_lines(id),
  expected_qty INTEGER NOT NULL,
  count_1_value INTEGER,
  count_2_value INTEGER,
  count_3_value INTEGER,
  net_movement_during_window INTEGER DEFAULT 0,
  reconciled_expected_qty INTEGER,
  unexplained_delta_qty INTEGER,
  explained_by_txn BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved'
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- APPROVALS
-- ============================================================================

CREATE TABLE public.approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variance_review_id UUID REFERENCES public.variance_reviews(id),
  journal_line_id UUID REFERENCES public.journal_lines(id),
  requested_by UUID REFERENCES public.users(id),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  is_high_impact BOOLEAN DEFAULT false,
  ic_manager_approval approval_status,
  ic_manager_approved_by UUID REFERENCES public.users(id),
  ic_manager_approved_at TIMESTAMPTZ,
  warehouse_manager_approval approval_status,
  warehouse_manager_approved_by UUID REFERENCES public.users(id),
  warehouse_manager_approved_at TIMESTAMPTZ,
  adjustment_qty INTEGER,
  comments TEXT,
  status approval_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- DISPATCH POOL
-- ============================================================================

CREATE TABLE public.dispatch_pool (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journal_line_id UUID REFERENCES public.journal_lines(id),
  count_type count_type NOT NULL,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  time_in_pool TIMESTAMPTZ DEFAULT NOW(),
  assigned_to UUID REFERENCES public.users(id),
  assigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- DATA QUALITY ISSUES
-- ============================================================================

CREATE TABLE public.data_quality_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_type TEXT NOT NULL, -- 'Invalid Location', 'Unknown SKU', 'Missing Cost', etc.
  source TEXT NOT NULL, -- 'OnHand Import', 'Transaction Import', 'Location Import', etc.
  record_data JSONB, -- Store the problematic record
  error_message TEXT,
  status TEXT DEFAULT 'open', -- 'open', 'resolved', 'ignored'
  resolved_by UUID REFERENCES public.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUDIT LOG
-- ============================================================================

CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  entity_type TEXT, -- 'user', 'location', 'item', 'journal', 'approval', etc.
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- VERIFIED COUNTER CERTIFICATIONS
-- ============================================================================

CREATE TABLE public.verified_counter_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) UNIQUE,
  requested_by UUID REFERENCES public.users(id),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  ic_manager_approval approval_status,
  ic_manager_approved_by UUID REFERENCES public.users(id),
  ic_manager_approved_at TIMESTAMPTZ,
  warehouse_manager_approval approval_status,
  warehouse_manager_approved_by UUID REFERENCES public.users(id),
  warehouse_manager_approved_at TIMESTAMPTZ,
  certified BOOLEAN DEFAULT false,
  certified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_locations_location_group ON public.locations(location_group);
CREATE INDEX idx_locations_warehouse ON public.locations(warehouse);
CREATE INDEX idx_journals_assigned_to ON public.journals(assigned_to);
CREATE INDEX idx_journals_status ON public.journals(status);
CREATE INDEX idx_journal_lines_journal_id ON public.journal_lines(journal_id);
CREATE INDEX idx_journal_lines_status ON public.journal_lines(status);
CREATE INDEX idx_count_submissions_line_id ON public.count_submissions(journal_line_id);
CREATE INDEX idx_transactions_cycle_id ON public.transactions(review_cycle_id);
CREATE INDEX idx_transactions_time ON public.transactions(txn_time);
CREATE INDEX idx_onhand_cycle_id ON public.onhand_snapshots(review_cycle_id);
CREATE INDEX idx_variance_reviews_status ON public.variance_reviews(status);
CREATE INDEX idx_approvals_status ON public.approvals(status);
CREATE INDEX idx_dispatch_pool_assigned ON public.dispatch_pool(assigned_to);
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.count_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;

-- Users can see their own data (simple, no recursion)
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- For now, allow authenticated users to read users table (we'll refine this later)
-- This avoids recursion while still providing basic security
CREATE POLICY "Authenticated users can read users" ON public.users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Operators can see their assigned journals
CREATE POLICY "Operators see assigned journals" ON public.journals
  FOR SELECT USING (assigned_to = auth.uid());

-- For testing: Allow authenticated users to read journals (we'll add role-based policies later)
CREATE POLICY "Authenticated users can read journals" ON public.journals
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journals_updated_at BEFORE UPDATE ON public.journals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_lines_updated_at BEFORE UPDATE ON public.journal_lines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
