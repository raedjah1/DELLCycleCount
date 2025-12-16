-- ============================================================================
-- DEBUG LOCATION CONSTRAINT
-- ============================================================================
-- Run this to check what the current constraint is and test some location codes

-- Check current constraint
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.locations'::regclass
  AND conname = 'valid_location_format';

-- Test some location code patterns
SELECT 
  'ARB.AF.01.01B' AS location_code,
  'ARB.AF.01.01B' ~ '^([^.]+\\.[^.]+\\.[^.]+\\.[^.]+\\.[^.]+|[^.]+\\.[^.]+\\.[^.]+\\.[^.]+)$' AS matches_4_segments,
  'ARB.AF.01.01B' ~ '^[^.]+\\.[^.]+\\.[^.]+\\.[^.]+\\.[^.]+$' AS matches_5_segments;

SELECT 
  'Warehouse1.ARB.AF.01.01B' AS location_code,
  'Warehouse1.ARB.AF.01.01B' ~ '^([^.]+\\.[^.]+\\.[^.]+\\.[^.]+\\.[^.]+|[^.]+\\.[^.]+\\.[^.]+\\.[^.]+)$' AS matches_pattern;

-- Check for any existing location codes that might be invalid
SELECT location_code, 
       (string_to_array(location_code, '.')::text[])[1] AS segment1,
       array_length(string_to_array(location_code, '.'), 1) AS segment_count
FROM public.locations 
ORDER BY created_at DESC 
LIMIT 10;

