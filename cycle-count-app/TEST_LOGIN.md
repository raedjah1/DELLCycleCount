# Testing Login Authentication

## 🔍 Debugging Steps

If passwords are being accepted incorrectly, follow these steps:

### 1. Check Browser Console
Open your browser's Developer Tools (F12) and check the Console tab when you try to log in. You should see:
- `Supabase Auth Response:` with authentication details
- Any error messages

### 2. Verify Environment Variables
Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important:** These must start with `NEXT_PUBLIC_` to be available in the browser!

### 3. Test with Wrong Password
Try logging in with:
- Email: `raed.jah@reconext.com`
- Password: `wrongpassword123`

**Expected Result:** You should see an error message like "Invalid email or password"

### 4. Test with Correct Password
Try logging in with:
- Email: `raed.jah@reconext.com`
- Password: `password123`

**Expected Result:** You should be redirected to `/admin/dashboard`

### 5. Check Supabase Dashboard
1. Go to Supabase Dashboard → Authentication → Users
2. Find `raed.jah@reconext.com`
3. Click on the user
4. Verify the password is set correctly
5. Try resetting the password if needed

### 6. Check Network Tab
In browser DevTools → Network tab:
- Look for requests to `supabase.co` or your Supabase URL
- Check if requests are being made
- Check response status codes (should be 200 for success, 400 for auth errors)

## 🐛 Common Issues

### Issue: "Configuration error: Supabase credentials not found"
**Solution:** Add environment variables to `.env.local` and restart your dev server

### Issue: Wrong password still works
**Possible Causes:**
1. Environment variables not loaded (restart dev server)
2. Supabase client not connecting (check Network tab)
3. Cached authentication (clear browser cache/cookies)

### Issue: No error messages showing
**Solution:** Check browser console for detailed error logs

## ✅ What Should Happen

When you enter a **wrong password**:
1. Supabase should return an error
2. Error message should display: "Invalid email or password"
3. You should NOT be redirected
4. Console should show: `Supabase Auth Error: ...`

When you enter the **correct password**:
1. Supabase should return a user object
2. User profile should be fetched from `public.users` table
3. You should be redirected to your role's dashboard
4. Console should show: `Supabase Auth Response: { hasUser: true, ... }`

