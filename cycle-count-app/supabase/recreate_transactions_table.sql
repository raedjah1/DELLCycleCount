-- ============================================================================
-- RECREATE TRANSACTIONS TABLE - Quick fix (deletes all data!)
-- ============================================================================
-- Use this if you don't have important data and want a clean start
-- 
-- NOTE: The existing table has different columns (txn_id, txn_time, part_number, etc.)
-- This script will drop it and create the new schema needed for the import

-- Drop existing table (WARNING: This deletes all data!)
-- The old table has: txn_id, txn_time, txn_type, part_number, from_location, to_location, ref_doc
-- The new table needs: part_no, serial_no, qty, source, part_transaction_type
DROP TABLE IF EXISTS public.transactions CASCADE;

-- Create table with correct schema
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_no TEXT NOT NULL,
  serial_no TEXT NOT NULL,
  qty INTEGER NOT NULL,
  source TEXT NOT NULL,
  part_transaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(part_no, serial_no, source, part_transaction_type, created_at)
);

-- Create indexes
CREATE INDEX idx_transactions_part_no ON public.transactions(part_no);
CREATE INDEX idx_transactions_serial_no ON public.transactions(serial_no);
CREATE INDEX idx_transactions_source ON public.transactions(source);
CREATE INDEX idx_transactions_type ON public.transactions(part_transaction_type);

-- Verify
SELECT 
    column_name, 
    data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'transactions'
ORDER BY ordinal_position;

