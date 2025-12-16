-- ============================================================================
-- FIX TRANSACTIONS TABLE - Ensure correct schema
-- ============================================================================
-- Run this in Supabase SQL Editor to ensure the table has the correct columns

-- Drop the table if it exists with wrong schema (CAREFUL - this deletes all data!)
-- DROP TABLE IF EXISTS public.transactions CASCADE;

-- Create the table with correct schema
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_no TEXT NOT NULL,
  serial_no TEXT NOT NULL,
  qty INTEGER NOT NULL,
  source TEXT NOT NULL,
  part_transaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(part_no, serial_no, source, part_transaction_type, created_at) -- Prevent exact duplicates
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_transactions_part_no ON public.transactions(part_no);
CREATE INDEX IF NOT EXISTS idx_transactions_serial_no ON public.transactions(serial_no);
CREATE INDEX IF NOT EXISTS idx_transactions_source ON public.transactions(source);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(part_transaction_type);

-- Verify the table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'transactions'
ORDER BY ordinal_position;

