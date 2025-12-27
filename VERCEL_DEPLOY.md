# Vercel Deployment Configuration

## Project Settings in Vercel

For this monorepo, you need to configure Vercel with these settings:

### Root Directory
Set the **Root Directory** to: `apps/web`

1. Go to your Vercel project → **Settings** → **General**
2. Under **Root Directory**, click **Edit**
3. Select **Other** and enter: `apps/web`
4. Click **Save**

### Build Settings

**Build Command:** `npm run build` (or leave default)  
**Output Directory:** `.next` (default)  
**Install Command:** `npm install` (default)

### Framework Preset
**Framework Preset:** Next.js (should auto-detect)

## Why This Configuration?

This is a Turborepo monorepo with:
- Root: `/` (contains turbo.json, package.json)
- App: `/apps/web` (Next.js application)
- Packages: `/packages/*` (shared code)

Vercel needs to:
1. Install dependencies at the root (workspace dependencies)
2. Build packages first (via Turbo)
3. Build the Next.js app in `apps/web`

## Build Process

The build will:
1. Run `npm install` at root (installs all workspace deps)
2. Run `npm run build` which triggers Turbo
3. Turbo builds packages in order: `shared` → `db` → `core` → `web`
4. Next.js builds the app in `apps/web`

## Troubleshooting

If build fails:

1. **Check Root Directory is set to `apps/web`**
2. **Verify environment variables are set** (see VERCEL_ENV.md)
3. **Check build logs** for specific errors
4. **Ensure DATABASE_URL has actual password** (not `[YOUR-PASSWORD]`)

## After Deployment

1. Run database migrations:
   ```bash
   npm run db:migrate
   ```
   (Or set up a migration script in Vercel)

2. Create the `label-images` storage bucket in Supabase

3. Test the deployed app!

