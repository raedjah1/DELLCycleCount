-- ============================================================================
-- CHECK TRANSACTIONS TABLE - Verify table exists and has correct columns
-- ============================================================================
-- Run this first to see what columns the table currently has

-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'transactions'
) AS table_exists;

-- Show current table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'transactions'
ORDER BY ordinal_position;

-- Show current row count
SELECT COUNT(*) as total_records FROM public.transactions;

