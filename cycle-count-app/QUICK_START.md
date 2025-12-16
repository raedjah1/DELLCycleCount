# Quick Start - Create Initial User

## 🚀 Automatic User Creation

I've created a script to automatically add the user `raed.jah@reconext.com` with password `password123`.

### Option 1: Run the Script (Recommended)

Make sure you have your `.env.local` file set up with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Then run:
```bash
npm run create-user
```

This will:
- ✅ Create the auth user in Supabase
- ✅ Create the user profile in `public.users` table
- ✅ Set role to Admin
- ✅ Set as active and verified counter

### Option 2: Manual Creation via Supabase Dashboard

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **Add User**
3. Enter:
   - Email: `raed.jah@reconext.com`
   - Password: `password123`
   - Auto Confirm: **Yes**
4. Click **Create User**
5. Copy the User UUID
6. Go to **SQL Editor** and run:

```sql
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
  'PASTE_USER_UUID_HERE',
  'raed.jah@reconext.com',
  'Raed Jah',
  'Admin',
  'Day',
  ARRAY[]::TEXT[],
  true,
  true
);
```

### Login Credentials

After creation, you can log in with:
- **Email:** `raed.jah@reconext.com`
- **Password:** `password123`

