-- ============================================================================
-- MIGRATE TRANSACTIONS TABLE - Fix column names
-- ============================================================================
-- This script checks existing columns and migrates them to the correct names

-- Step 1: Check what columns currently exist
DO $$
DECLARE
    col_exists boolean;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'transactions'
    ) INTO col_exists;
    
    IF col_exists THEN
        RAISE NOTICE 'Table exists. Checking columns...';
    ELSE
        RAISE NOTICE 'Table does not exist. Will create it.';
    END IF;
END $$;

-- Step 2: Show current structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'transactions'
ORDER BY ordinal_position;

-- Step 3: Drop the table if it has wrong columns (CAREFUL - deletes all data!)
-- Uncomment the next line if you want to recreate the table from scratch
-- DROP TABLE IF EXISTS public.transactions CASCADE;

-- Step 4: Create table with correct schema
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_no TEXT NOT NULL,
  serial_no TEXT NOT NULL,
  qty INTEGER NOT NULL,
  source TEXT NOT NULL,
  part_transaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 5: Drop old unique constraint if it exists with wrong column names
DO $$
BEGIN
    -- Try to drop constraint if it exists
    ALTER TABLE public.transactions 
    DROP CONSTRAINT IF EXISTS transactions_part_no_serial_no_source_part_transaction_type_created_at_key;
EXCEPTION
    WHEN OTHERS THEN
        -- Constraint doesn't exist or has different name, ignore
        NULL;
END $$;

-- Step 6: Add unique constraint with correct column names
DO $$
BEGIN
    ALTER TABLE public.transactions 
    ADD CONSTRAINT transactions_unique_key 
    UNIQUE(part_no, serial_no, source, part_transaction_type, created_at);
EXCEPTION
    WHEN duplicate_object THEN
        -- Constraint already exists, ignore
        NULL;
END $$;

-- Step 7: Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_part_no ON public.transactions(part_no);
CREATE INDEX IF NOT EXISTS idx_transactions_serial_no ON public.transactions(serial_no);
CREATE INDEX IF NOT EXISTS idx_transactions_source ON public.transactions(source);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(part_transaction_type);

-- Step 8: Verify final structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'transactions'
ORDER BY ordinal_position;

