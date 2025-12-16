-- ============================================================================
-- UPDATE LOCATION CODE CONSTRAINT
-- ============================================================================
-- Run this in Supabase SQL Editor to update the location_code constraint
-- to allow both 4 segments (Business.Aisle.Bay.PositionLevel) and 
-- 5 segments (Warehouse.Business.Aisle.Bay.PositionLevel)

-- Step 1: Drop the old constraint
ALTER TABLE public.locations 
DROP CONSTRAINT IF EXISTS valid_location_format;

-- Step 2: Add the new constraint that allows 4 or 5 segments
ALTER TABLE public.locations 
ADD CONSTRAINT valid_location_format CHECK (
  -- Allow 4 segments (Business.Aisle.Bay.PositionLevel) or 5 segments (Warehouse.Business.Aisle.Bay.PositionLevel)
  location_code ~ '^([^.]+\\.[^.]+\\.[^.]+\\.[^.]+\\.[^.]+|[^.]+\\.[^.]+\\.[^.]+\\.[^.]+)$'
);

-- Verify the constraint was updated
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.locations'::regclass
  AND conname = 'valid_location_format';

