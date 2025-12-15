# Warehouse Cycle Count Module

Professional warehouse cycle count management system built with Next.js 14, TypeScript, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account
- Vercel account (for deployment)

### Local Development

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. **Run development server**
```bash
npm run dev
```

4. **Open browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Your app will be live!**
   - Vercel will provide a URL like: `your-app.vercel.app`
   - Every git push auto-deploys

## 🗄️ Database Setup

1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase/schema.sql` to create all tables
3. Run `supabase/fix-rls-policies.sql` to fix RLS policies

## 📁 Project Structure

```
cycle-count-app/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin screens
│   ├── operator/           # Operator screens
│   ├── lead/              # Lead screens
│   ├── manager/            # Manager screens
│   └── auth/               # Authentication
├── components/             # React components
│   ├── widgets/           # Modular widgets
│   ├── forms/             # Form components
│   └── layouts/           # Layout components
├── lib/                    # Utilities
│   ├── supabase/          # Supabase clients
│   └── utils/             # Helper functions
└── supabase/              # Database schema
    └── schema.sql         # Complete database schema
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel

## 📝 Features

- ✅ Complete warehouse cycle count workflows
- ✅ Role-based access control
- ✅ Excel import for master data
- ✅ Transaction-aware variance review
- ✅ Guided counting workflows
- ✅ Professional, responsive UI

## 🔒 Security

- Row Level Security (RLS) enabled
- Environment variables for sensitive data
- Authentication required for all routes

## 📄 License

Private - Internal use only
