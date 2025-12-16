-- ============================================================================
-- CREATE INITIAL USER PROFILE - Raed Jah
-- ============================================================================
-- IMPORTANT: You MUST create the auth user FIRST before running this script!
--
-- STEP 1: Create Auth User (Choose one method):
--
--   METHOD A - Supabase Dashboard (Easiest):
--   1. Go to Supabase Dashboard → Authentication → Users
--   2. Click "Add User" or "Invite User"
--   3. Email: raed.jah@reconext.com
--   4. Password: password123
--   5. Auto Confirm: Yes (toggle ON)
--   6. Click "Create User"
--   7. Copy the User UUID that appears
--
--   METHOD B - Use the npm script (Recommended - does everything automatically):
--   Run: npm run create-user
--   (This creates both auth user AND profile automatically)
--
-- STEP 2: After auth user exists, run this SQL to create the profile:
-- ============================================================================

DO $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Try to find existing auth user
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = 'raed.jah@reconext.com'
  LIMIT 1;

  -- If user doesn't exist in auth.users, provide clear instructions
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 
      '❌ Auth user does not exist yet!
      
      Please create the auth user first using ONE of these methods:
      
      OPTION 1 (Easiest - Recommended):
      Run: npm run create-user
      (This creates both auth user AND profile automatically)
      
      OPTION 2 (Manual):
      1. Go to Supabase Dashboard → Authentication → Users
      2. Click "Add User"
      3. Email: raed.jah@reconext.com
      4. Password: password123
      5. Auto Confirm: Yes
      6. Click "Create User"
      7. Then run this SQL script again';
  END IF;

  -- Check if profile already exists
  IF EXISTS (SELECT 1 FROM public.users WHERE id = user_uuid) THEN
    RAISE NOTICE '✅ User profile already exists for raed.jah@reconext.com';
    RAISE NOTICE '   User ID: %', user_uuid;
  ELSE
    -- Insert user profile
    INSERT INTO public.users (
      id,
      email,
      name,
      role,
      shift,
      zones,
      is_active,
      is_verified_counter
    ) VALUES (
      user_uuid,
      'raed.jah@reconext.com',
      'Raed Jah',
      'Admin',
      'Day',
      ARRAY[]::TEXT[],
      true,
      true
    );
    
    RAISE NOTICE '✅ User profile created successfully!';
    RAISE NOTICE '   Email: raed.jah@reconext.com';
    RAISE NOTICE '   Role: Admin';
    RAISE NOTICE '   User ID: %', user_uuid;
  END IF;
END $$;

