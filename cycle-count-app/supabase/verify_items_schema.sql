-- ============================================================================
-- VERIFY ITEMS TABLE SCHEMA FOR IMPORT
-- ============================================================================
-- This query verifies that the items table has the required columns for import:
-- ID (source_id), PartNo (part_no), Description (description), SerialFlag (serial_flag)

-- Check if all required columns exist
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'items'
  AND column_name IN ('source_id', 'part_no', 'description', 'serial_flag')
ORDER BY column_name;

-- Expected output should show:
-- source_id | bigint | YES | NULL
-- part_no | text | NO | NULL
-- description | text | NO | NULL
-- serial_flag | text | NO | 'N'::text

-- If any columns are missing, you may need to add them:
-- ALTER TABLE public.items ADD COLUMN IF NOT EXISTS source_id BIGINT;
-- ALTER TABLE public.items ADD COLUMN IF NOT EXISTS part_no TEXT NOT NULL;
-- ALTER TABLE public.items ADD COLUMN IF NOT EXISTS description TEXT NOT NULL;
-- ALTER TABLE public.items ADD COLUMN IF NOT EXISTS serial_flag TEXT NOT NULL DEFAULT 'N';

