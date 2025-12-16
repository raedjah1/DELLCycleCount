// ============================================================================
// API ROUTE - Create User
// ============================================================================
// Location: /app/api/users/create/route.ts
// Purpose: Server-side API route for creating users (requires service role)

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated and is Admin
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile to check role
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userProfile || userProfile.role !== 'Admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, name, role, shift, zones, is_active, is_verified_counter, password } = body;

    // Validate required fields
    if (!email || !name || !role || !shift || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate environment variables
    // Note: Server-side env vars (without NEXT_PUBLIC_) are available in API routes
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Debug logging
    console.log('🔍 Environment check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!serviceRoleKey,
      urlLength: supabaseUrl?.length || 0,
      keyLength: serviceRoleKey?.length || 0,
      allSupabaseKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
    });

    if (!supabaseUrl) {
      console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL');
      return NextResponse.json(
        { error: 'Server configuration error: Missing NEXT_PUBLIC_SUPABASE_URL' },
        { status: 500 }
      );
    }

    if (!serviceRoleKey) {
      console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
      console.error('   Available env vars with SUPABASE:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
      console.error('   Make sure SUPABASE_SERVICE_ROLE_KEY is in .env.local (not .env)');
      console.error('   Location should be: cycle-count-app/.env.local');
      console.error('   Format: SUPABASE_SERVICE_ROLE_KEY=your_key_here (no quotes, no spaces)');
      return NextResponse.json(
        { error: 'Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY. Check server console for details.' },
        { status: 500 }
      );
    }

    // Create admin client with service role key (server-side only)
    const adminSupabase = createAdminClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Step 1: Create auth user
    const { data: authData, error: createError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto-confirm for admin-created users
    });

    if (createError || !authData?.user) {
      return NextResponse.json(
        { error: `Failed to create auth user: ${createError?.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    // Step 2: Create user profile
    const { data: profileData, error: profileError } = await adminSupabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role,
        shift,
        zones: zones || [],
        is_active: is_active ?? true,
        is_verified_counter: is_verified_counter ?? false
      })
      .select()
      .single();

    if (profileError) {
      // Try to clean up auth user if profile creation fails
      await adminSupabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: `Failed to create user profile: ${profileError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: profileData }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

