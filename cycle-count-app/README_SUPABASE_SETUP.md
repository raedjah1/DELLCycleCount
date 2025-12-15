# Supabase Setup Guide

## Step 1: Create Environment Variables

Create a `.env.local` file in the root of `cycle-count-app`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://alqypixvhnzmmsxsbmab.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscXlwaXh2aG56bW1zeHNibWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4Mjc2NzIsImV4cCI6MjA4MTQwMzY3Mn0.u3UTGcss4ya9VFe0lLsMuMXB1U6TuxUKXqkLeFsS3Lk
```

## Step 2: Run Database Schema

1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Open the file: `supabase/schema.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click "Run" to execute

This will create:
- All tables (users, locations, items, journals, counts, etc.)
- All indexes for performance
- Row Level Security (RLS) policies
- Triggers for updated_at timestamps

## Step 3: Verify Setup

After running the schema, check:
- Tables tab should show all tables created
- No errors in SQL Editor
- RLS is enabled on sensitive tables

## Step 4: Test Connection

The app is now ready to connect to Supabase! The middleware will handle authentication automatically.

## Next Steps

- Set up authentication (Supabase Auth)
- Create your first user
- Import master data (locations, items)
- Start using the app!

