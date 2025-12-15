-- ============================================================================
-- FIX RLS POLICIES - Remove Recursive Policies
-- ============================================================================
-- Run this in Supabase SQL Editor to fix the infinite recursion error

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can read users" ON public.users;
DROP POLICY IF EXISTS "Operators see assigned journals" ON public.journals;
DROP POLICY IF EXISTS "Authenticated users can read journals" ON public.journals;
DROP POLICY IF EXISTS "Managers see all journals" ON public.journals;
DROP POLICY IF EXISTS "Admins have full access" ON public.users;

-- For testing: Temporarily disable RLS on users table
-- This allows connection testing without authentication
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with simple, non-recursive policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Simple policy: Allow all authenticated users to read users table
-- We'll refine this with role-based policies after auth is set up
CREATE POLICY "Allow authenticated read users" ON public.users
  FOR SELECT 
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- For now, also allow anon access for testing (remove this in production)
-- This allows the connection test to work
CREATE POLICY "Allow anon read users for testing" ON public.users
  FOR SELECT 
  USING (true);

-- Simple journal policies (non-recursive)
ALTER TABLE public.journals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read journals" ON public.journals
  FOR SELECT 
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- For testing: Allow anon access
CREATE POLICY "Allow anon read journals for testing" ON public.journals
  FOR SELECT 
  USING (true);

-- Disable RLS on master data tables for now (we'll enable later with proper policies)
ALTER TABLE public.locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones DISABLE ROW LEVEL SECURITY;

