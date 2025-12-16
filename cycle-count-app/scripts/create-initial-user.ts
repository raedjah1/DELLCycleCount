// ============================================================================
// CREATE INITIAL USER SCRIPT
// ============================================================================
// Run this script to automatically create the initial admin user
// Usage: npx tsx scripts/create-initial-user.ts

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌');
  console.error('\nPlease set these in your .env.local file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createInitialUser() {
  console.log('🚀 Creating initial admin user...\n');

  const email = 'raed.jah@reconext.com';
  const password = 'password123';
  const name = 'Raed Jah';

  try {
    // Step 1: Check if user already exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUsers) {
      console.log('⚠️  User already exists:', email);
      console.log('   User ID:', existingUsers.id);
      return;
    }

    // Step 2: Create auth user
    console.log('📝 Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name
      }
    });

    if (authError) {
      // Check if user already exists in auth
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        console.log('⚠️  Auth user already exists, fetching user...');
        
        // Get existing auth user
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const existingAuthUser = users?.find(u => u.email === email);
        
        if (!existingAuthUser) {
          throw new Error('User exists but could not be found');
        }

        // Create profile for existing auth user
        console.log('📝 Creating user profile for existing auth user...');
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert({
            id: existingAuthUser.id,
            email,
            name,
            role: 'Admin',
            shift: 'Day',
            zones: [],
            is_active: true,
            is_verified_counter: true
          })
          .select()
          .single();

        if (profileError) {
          throw new Error(`Failed to create profile: ${profileError.message}`);
        }

        console.log('✅ User profile created successfully!');
        console.log('   Email:', profileData.email);
        console.log('   Name:', profileData.name);
        console.log('   Role:', profileData.role);
        return;
      }
      
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Failed to create auth user: No user returned');
    }

    console.log('✅ Auth user created:', authData.user.id);

    // Step 3: Create user profile
    console.log('📝 Creating user profile...');
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role: 'Admin',
        shift: 'Day',
        zones: [],
        is_active: true,
        is_verified_counter: true
      })
      .select()
      .single();

    if (profileError) {
      // Try to clean up auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }

    console.log('\n✅ User created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Email:', profileData.email);
    console.log('   Password: password123');
    console.log('   Name:', profileData.name);
    console.log('   Role:', profileData.role);
    console.log('   User ID:', profileData.id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🎉 You can now log in with:');
    console.log('   Email: raed.jah@reconext.com');
    console.log('   Password: password123');

  } catch (error: any) {
    console.error('\n❌ Error creating user:', error.message);
    process.exit(1);
  }
}

createInitialUser();

