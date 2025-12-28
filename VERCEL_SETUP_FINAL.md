# Vercel Setup - Final Configuration

## Choose ONE Project

You have two Vercel projects:
- `label-wise` 
- `label-wise-web`

**Recommendation:** Keep `label-wise` and delete `label-wise-web`

## Vercel Project Settings

### Root Directory
- Set to: `apps/web`
- ✅ Enable: "Include files outside the root directory in the Build Step"

### Build Settings
- **Build Command:** `npm run build` (or `cd apps/web && npm run build`)
- **Install Command:** `npm install` (runs at root, installs all workspaces)
- **Output Directory:** `.next` (default)

## Environment Variables (Set in Vercel Dashboard)

### For Production + Preview + Development:

1. **NEXT_PUBLIC_SUPABASE_URL**
   ```
   https://siwxtkliohdhmtzkerxq.supabase.co
   ```

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** ⚠️ Use JWT, not publishable key
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpd3h0a2xpb2hkaG10emtlcnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NTIwMjYsImV4cCI6MjA4MjQyODAyNn0.cbRozb7QAAPDagbX9EzTThHpYZS3fvIJriex5RYzUmo
   ```

3. **SUPABASE_SERVICE_ROLE_KEY**
   ```
   sb_secret_KXK8ojw6xY6qc56R6DJt5g_6P7VFxZt
   ```
   ⚠️ **Important:** Rotate this key after testing - it was exposed in chat

4. **DATABASE_URL** (URL-encoded password)
   ```
   postgresql://postgres.siwxtkliohdhmtzkerxq:9%24GW3eZWp%2Br%264NE@aws-0-us-west-2.pooler.supabase.com:5432/postgres
   ```
   Password encoding:
   - `$` → `%24`
   - `+` → `%2B`
   - `&` → `%26`

## Supabase Storage Bucket

### Bucket: `label-images`

- **Visibility:** Public ✅ (for now, easiest setup)
- **Allowed MIME types:** `image/png`, `image/jpeg`, `image/webp`
- **Max file size:** 10MB

## After Setting Env Vars

1. **Redeploy** the project
2. **Check build logs** - should complete successfully
3. **Test upload** - should work (OCR will be client-side)

## Security Note

⚠️ **Rotate your Supabase keys** after getting everything working:
- Service Role Key was exposed in chat
- Generate new keys in Supabase Dashboard → Settings → API

