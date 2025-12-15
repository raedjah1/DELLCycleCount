# 🚀 Vercel Deployment Guide

## Step 1: Commit to Git

```bash
git commit -m "Initial commit - Warehouse Cycle Count Module"
```

## Step 2: Push to GitHub

1. **Create a new repository on GitHub**
   - Go to github.com
   - Click "New repository"
   - Name it: `warehouse-cycle-count` (or whatever you want)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Connect and push**
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login (use GitHub account for easy connection)

2. **Import Project**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add these two:
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://alqypixvhnzmmsxsbmab.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscXlwaXh2aG56bW1zeHNibWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4Mjc2NzIsImV4cCI6MjA4MTQwMzY3Mn0.u3UTGcss4ya9VFe0lLsMuMXB1U6TuxUKXqkLeFsS3Lk
     ```
   - Make sure to select "Production", "Preview", and "Development"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Your app will be live! 🎉

## Step 4: Your Live URL

Vercel will give you a URL like:
- `your-app-name.vercel.app`

You can also add a custom domain later.

## 🔄 Auto-Deployment

Every time you push to GitHub:
- Vercel automatically rebuilds and deploys
- Preview deployments for pull requests
- Zero downtime updates

## ✅ Verify Deployment

1. Visit your Vercel URL
2. Go to `/test-connection` to verify Supabase connection
3. Check all your screens work

## 🎯 Next Steps

Once deployed:
- Share the URL with stakeholders
- Test on different devices
- Continue building features
- Every push = instant update!

