# Vercel Environment Variables

Copy these exact variable names and values into your Vercel project settings.

## Required Environment Variables

### Supabase Configuration

**Variable Name:** `NEXT_PUBLIC_SUPABASE_URL`  
**Value:** `https://siwxtkliohdhmtzkerxq.supabase.co`  
**Type:** Plain text

**Variable Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpd3h0a2xpb2hkaG10emtlcnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NTIwMjYsImV4cCI6MjA4MjQyODAyNn0.cbRozb7QAAPDagbX9EzTThHpYZS3fvIJriex5RYzUmo`  
**Type:** Plain text

**Variable Name:** `SUPABASE_SERVICE_ROLE_KEY`  
**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpd3h0a2xpb2hkaG10emtlcnhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njg1MjAyNiwiZXhwIjoyMDgyNDI4MDI2fQ.L4kjxZxIkdaNKQOt6sH8fSUPuNylzzru1YHHYjp0FRc`  
**Type:** Secret (mark as sensitive)

### Database Connection

**Variable Name:** `DATABASE_URL`  
**Value:** `postgresql://postgres:[YOUR-PASSWORD]@db.siwxtkliohdhmtzkerxq.supabase.co:5432/postgres`  
**Note:** Replace `[YOUR-PASSWORD]` with your actual database password  
**Type:** Secret (mark as sensitive)

### Optional: Open Food Facts

**Variable Name:** `OPEN_FOOD_FACTS_BASE_URL`  
**Value:** `https://world.openfoodfacts.org/api/v0`  
**Type:** Plain text  
**Note:** This is optional - defaults to this value if not set

## How to Add in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. For each variable:
   - Click **Add New**
   - Paste the **Variable Name** exactly as shown
   - Paste the **Value**
   - Select **Environment**: Production, Preview, and Development (or just Production)
   - For secrets (SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL), make sure they're marked as sensitive
   - Click **Save**

## Quick Copy-Paste List

```
NEXT_PUBLIC_SUPABASE_URL=https://siwxtkliohdhmtzkerxq.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpd3h0a2xpb2hkaG10emtlcnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NTIwMjYsImV4cCI6MjA4MjQyODAyNn0.cbRozb7QAAPDagbX9EzTThHpYZS3fvIJriex5RYzUmo

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpd3h0a2xpb2hkaG10emtlcnhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njg1MjAyNiwiZXhwIjoyMDgyNDI4MDI2fQ.L4kjxZxIkdaNKQOt6sH8fSUPuNylzzru1YHHYjp0FRc

DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.siwxtkliohdhmtzkerxq.supabase.co:5432/postgres
```

**Important:** Replace `[YOUR-PASSWORD]` in DATABASE_URL with your actual Supabase database password.

## After Adding Variables

1. **Redeploy** your application (Vercel will automatically redeploy if you trigger a new deployment)
2. **Verify** the variables are loaded by checking the build logs
3. **Test** your API endpoints to ensure they're working

## Security Notes

- ✅ `NEXT_PUBLIC_*` variables are safe to expose (they're public)
- 🔒 `SUPABASE_SERVICE_ROLE_KEY` should be kept secret
- 🔒 `DATABASE_URL` contains your password - keep it secret
- Never commit these values to git (they're in `.env.local` which is gitignored)

