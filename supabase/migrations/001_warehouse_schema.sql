-- ============================================================================
-- WAREHOUSE CYCLE COUNT MODULE - CORE DATABASE SCHEMA
-- ============================================================================
-- Based on requirements document specifications

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- MASTER DATA TABLES
-- ============================================================================

-- Warehouses
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Rawgoods', 'Production', 'Finishedgoods')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zones
CREATE TABLE zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    warehouse_id UUID REFERENCES warehouses(id),
    journal_size_default INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(code, warehouse_id)
);

-- Locations with canonical parsing
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_code VARCHAR(100) NOT NULL UNIQUE,
    warehouse VARCHAR(50) NOT NULL,
    business VARCHAR(50) NOT NULL,
    aisle VARCHAR(50) NOT NULL,
    bay_text VARCHAR(10) NOT NULL,
    bay_num INTEGER NOT NULL,
    position_level VARCHAR(10) NOT NULL,
    position_num INTEGER NOT NULL,
    level_letter CHAR(1) NOT NULL,
    zone_id UUID REFERENCES zones(id),
    is_risk_location BOOLEAN DEFAULT false,
    risk_reason VARCHAR(100),
    risk_notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items/Products
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_number VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    product_type VARCHAR(50), -- Laptop, Server, Switches, Desktop, AIO
    abc_class CHAR(1) CHECK (abc_class IN ('A', 'B', 'C')),
    standard_cost DECIMAL(15,2),
    warehouse_type VARCHAR(20) CHECK (warehouse_type IN ('Rawgoods', 'Production', 'Finishedgoods')),
    rawgoods_serial_required BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- USER MANAGEMENT
-- ============================================================================

-- Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
('Admin', 'System administration and configuration'),
('IC_Manager', 'Inventory Control Manager'),
('Warehouse_Manager', 'Warehouse Manager'),
('Warehouse_Supervisor', 'Warehouse Supervisor'),
('Lead', 'Warehouse Lead'),
('Operator', 'Warehouse Operator'),
('Viewer', 'Read-only access');

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role_id UUID REFERENCES roles(id),
    shift VARCHAR(10) CHECK (shift IN ('A', 'B', 'C')),
    is_verified_counter BOOLEAN DEFAULT false,
    presence_status VARCHAR(20) DEFAULT 'Not_Available' 
        CHECK (presence_status IN ('Present_Available', 'On_Break', 'On_Lunch', 'Not_Available')),
    last_activity TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CYCLE COUNT OPERATIONS
-- ============================================================================

-- Review Cycles
CREATE TABLE review_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Closed')),
    closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OnHand Snapshots (purged after cycle close)
CREATE TABLE onhand_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_cycle_id UUID REFERENCES review_cycles(id),
    as_of_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    location_code VARCHAR(100) NOT NULL,
    part_number VARCHAR(100) NOT NULL,
    expected_qty DECIMAL(15,3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (review_cycle_id, location_code, part_number),
    FOREIGN KEY (location_code) REFERENCES locations(location_code),
    FOREIGN KEY (part_number) REFERENCES items(part_number)
);

-- Transactions (purged after cycle close)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_cycle_id UUID REFERENCES review_cycles(id),
    txn_id VARCHAR(100) NOT NULL,
    txn_time TIMESTAMP WITH TIME ZONE NOT NULL,
    txn_type VARCHAR(50) NOT NULL,
    part_number VARCHAR(100) NOT NULL,
    qty DECIMAL(15,3) NOT NULL,
    from_location VARCHAR(100),
    to_location VARCHAR(100),
    ref_doc VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_cycle_id, txn_id),
    FOREIGN KEY (part_number) REFERENCES items(part_number)
);

-- Count Plans (what needs to be counted)
CREATE TABLE count_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_cycle_id UUID REFERENCES review_cycles(id),
    location_code VARCHAR(100) NOT NULL,
    part_number VARCHAR(100) NOT NULL,
    expected_qty DECIMAL(15,3) NOT NULL,
    expected_qty_at_count DECIMAL(15,3), -- Snapshot for retention
    standard_cost_at_count DECIMAL(15,2), -- Snapshot for retention
    sla_due_date DATE,
    priority INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'Planned' 
        CHECK (status IN ('Planned', 'Assigned', 'In_Progress', 'Completed', 'Approved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (location_code) REFERENCES locations(location_code),
    FOREIGN KEY (part_number) REFERENCES items(part_number)
);

-- Journals (work packets)
CREATE TABLE journals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_cycle_id UUID REFERENCES review_cycles(id),
    zone_id UUID REFERENCES zones(id),
    assigned_user_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'Created' 
        CHECK (status IN ('Created', 'Assigned', 'In_Progress', 'Completed')),
    total_lines INTEGER DEFAULT 0,
    completed_lines INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Journal Lines (individual count tasks)
CREATE TABLE journal_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal_id UUID REFERENCES journals(id),
    count_plan_id UUID REFERENCES count_plans(id),
    sequence_number INTEGER NOT NULL,
    location_code VARCHAR(100) NOT NULL,
    part_number VARCHAR(100) NOT NULL,
    expected_qty DECIMAL(15,3) NOT NULL,
    status VARCHAR(20) DEFAULT 'Unstarted' 
        CHECK (status IN ('Unstarted', 'In_Progress', 'Completed', 'Needs_Recount')),
    started_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(journal_id, sequence_number)
);

-- Count Submissions
CREATE TABLE count_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal_line_id UUID REFERENCES journal_lines(id),
    count_number INTEGER NOT NULL CHECK (count_number IN (1, 2, 3)), -- Count 1, 2, or 3 (Verified)
    submitted_by_user_id UUID REFERENCES users(id),
    actual_qty DECIMAL(15,3) NOT NULL,
    variance_qty DECIMAL(15,3), -- actual - expected
    variance_percent DECIMAL(5,2), -- (variance / expected) * 100
    within_tolerance BOOLEAN,
    is_verified_count BOOLEAN DEFAULT false, -- Count 3
    evidence_photo_path TEXT, -- For Finishedgoods mismatches
    notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Serial Captures
CREATE TABLE serial_captures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    count_submission_id UUID REFERENCES count_submissions(id),
    serial_number VARCHAR(100) NOT NULL,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- APPROVALS AND AUDIT
-- ============================================================================

-- Approval Queue
CREATE TABLE approval_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    count_submission_id UUID REFERENCES count_submissions(id),
    approval_type VARCHAR(20) NOT NULL CHECK (approval_type IN ('Single', 'Dual_Pending', 'Dual_Complete')),
    is_high_impact BOOLEAN DEFAULT false,
    requires_dual_approval BOOLEAN DEFAULT false,
    ic_manager_approval_id UUID REFERENCES users(id),
    ic_manager_approved_at TIMESTAMP WITH TIME ZONE,
    warehouse_manager_approval_id UUID REFERENCES users(id),
    warehouse_manager_approved_at TIMESTAMP WITH TIME ZONE,
    final_decision VARCHAR(20) CHECK (final_decision IN ('Approved', 'Rejected', 'Pending')),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Data Quality Issues
CREATE TABLE data_quality_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_type VARCHAR(50) NOT NULL, -- 'Invalid_Location', 'Unknown_SKU', 'Missing_Cost'
    source_table VARCHAR(50), -- 'onhand_snapshots', 'transactions'
    source_data JSONB, -- Original problematic record
    error_message TEXT,
    status VARCHAR(20) DEFAULT 'Open' CHECK (status IN ('Open', 'Resolved', 'Ignored')),
    resolved_by_user_id UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL, -- 'count_submission', 'approval', 'user'
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'approved', 'assigned'
    user_id UUID REFERENCES users(id),
    old_values JSONB,
    new_values JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CONFIGURATION
-- ============================================================================

-- System Configuration
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    description TEXT,
    updated_by_user_id UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configuration
INSERT INTO system_config (config_key, config_value, description) VALUES 
('variance_tolerance_percent', '5.0', 'Variance tolerance percentage for automatic recount'),
('high_impact_cost_threshold', '1000.00', 'Cost threshold for high-impact items requiring dual approval'),
('journal_size_default', '30', 'Default number of lines per journal'),
('claim_timeout_minutes', '30', 'Minutes before unclaimed line times out');

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Location parsing indexes
CREATE INDEX idx_locations_warehouse ON locations(warehouse);
CREATE INDEX idx_locations_zone ON locations(zone_id);
CREATE INDEX idx_locations_risk ON locations(is_risk_location) WHERE is_risk_location = true;

-- OnHand and Transaction indexes
CREATE INDEX idx_onhand_cycle_location ON onhand_snapshots(review_cycle_id, location_code);
CREATE INDEX idx_transactions_cycle_part ON transactions(review_cycle_id, part_number);
CREATE INDEX idx_transactions_time ON transactions(txn_time);

-- Journal and counting indexes
CREATE INDEX idx_journals_assigned_user ON journals(assigned_user_id);
CREATE INDEX idx_journal_lines_journal ON journal_lines(journal_id, sequence_number);
CREATE INDEX idx_count_submissions_line ON count_submissions(journal_line_id);

-- Approval queue indexes
CREATE INDEX idx_approval_queue_pending ON approval_queue(final_decision) WHERE final_decision = 'Pending';

-- Audit log indexes
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- ============================================================================

-- Enable RLS on key tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE count_submissions ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (will be expanded with actual auth)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Operators can view assigned journals" ON journals FOR SELECT USING (assigned_user_id::text = auth.uid()::text);

COMMENT ON TABLE locations IS 'Canonical location master with 5-segment parsing: Warehouse.Business.Aisle.Bay.PositionLevel';
COMMENT ON TABLE count_submissions IS 'Count 1, Count 2, and Count 3 (Verified) submissions with variance calculations';
COMMENT ON TABLE approval_queue IS 'Finishedgoods mismatches and high-impact adjustments requiring approval';
COMMENT ON TABLE audit_log IS 'Comprehensive audit trail for all key actions';
