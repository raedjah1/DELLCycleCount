-- ============================================================================
-- FIX LOCATION CODE CONSTRAINT (CORRECTED VERSION)
-- ============================================================================
-- Run this in Supabase SQL Editor to update the location_code constraint
-- This version uses a simpler, more reliable pattern

-- Step 1: Drop the old constraint
ALTER TABLE public.locations 
DROP CONSTRAINT IF EXISTS valid_location_format;

-- Step 2: Add the new constraint that allows 4 or 5 segments
-- Using a simpler pattern that's easier for PostgreSQL to parse
ALTER TABLE public.locations 
ADD CONSTRAINT valid_location_format CHECK (
  -- Allow 4 segments: Business.Aisle.Bay.PositionLevel
  -- OR 5 segments: Warehouse.Business.Aisle.Bay.PositionLevel
  -- Pattern: at least 4 segments, at most 5 segments, all non-empty
  location_code ~ '^[^.]+\.[^.]+\.[^.]+\.[^.]+(\.[^.]+)?$'
);

-- Verify the constraint was updated
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.locations'::regclass
  AND conname = 'valid_location_format';

-- Test the pattern with sample codes
SELECT 
  'ARB.AF.01.01B' AS test_code_4_segments,
  'ARB.AF.01.01B' ~ '^[^.]+\.[^.]+\.[^.]+\.[^.]+(\.[^.]+)?$' AS should_be_true;

SELECT 
  'Warehouse1.ARB.AF.01.01B' AS test_code_5_segments,
  'Warehouse1.ARB.AF.01.01B' ~ '^[^.]+\.[^.]+\.[^.]+\.[^.]+(\.[^.]+)?$' AS should_be_true;

