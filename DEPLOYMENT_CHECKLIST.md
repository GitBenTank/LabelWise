# Vercel Deployment Checklist

## ✅ Completed

- [x] Environment variables added to Vercel
  - [x] NEXT_PUBLIC_SUPABASE_URL
  - [x] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [x] SUPABASE_SERVICE_ROLE_KEY (marked as Secret)
  - [x] DATABASE_URL (marked as Secret)

## 🔴 Critical: Root Directory

**MUST DO THIS FIRST:**

1. Go to: **Project Settings** → **General**
2. Scroll to **Root Directory**
3. Click **Edit**
4. Select **Other**
5. Enter: `apps/web`
6. Click **Save**

**Why?** Vercel needs to know your Next.js app is in `apps/web`, not at the root.

## ⚠️ Verify DATABASE_URL

Make sure `DATABASE_URL` has your **actual password**, not the placeholder:

**Wrong:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.siwxtkliohdhmtzkerxq.supabase.co:5432/postgres
```

**Correct:**
```
postgresql://postgres:your-actual-password-here@db.siwxtkliohdhmtzkerxq.supabase.co:5432/postgres
```

To check/update:
1. Go to **Environment Variables** in Vercel
2. Find `DATABASE_URL`
3. Click the eye icon to view (if you have permission)
4. If it still has `[YOUR-PASSWORD]`, update it with your real password

## 📋 After Root Directory is Set

1. **Trigger a new deployment:**
   - Vercel will auto-deploy when you push to `main`
   - Or manually trigger: **Deployments** → **Redeploy**

2. **Watch the build logs:**
   - Should see: `npm install` → `npm run build`
   - Turbo will build packages in order
   - Next.js will build the app

3. **If build succeeds:**
   - Your app will be live!
   - Test the deployed URL

4. **If build fails:**
   - Check build logs for specific errors
   - Common issues:
     - Missing environment variables
     - DATABASE_URL format incorrect
     - TypeScript errors
     - Missing dependencies

## 🗄️ Database Setup

After deployment succeeds:

1. **Run migrations:**
   ```bash
   npm run db:migrate
   ```
   Or set up a migration script in Vercel

2. **Create storage bucket:**
   - Go to Supabase Dashboard → Storage
   - Create bucket: `label-images`
   - Set to Public (or Private)

## 🧪 Test Deployment

Once deployed, test:
- Homepage loads
- API endpoints work
- Database connection works
- Storage uploads work

## 📝 Current Status

- ✅ Code pushed to GitHub
- ✅ Environment variables configured
- ✅ Vercel config files added
- ⏳ **Waiting for: Root Directory setting**
- ⏳ **Waiting for: DATABASE_URL password verification**

