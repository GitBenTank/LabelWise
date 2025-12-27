# Supabase Configuration Guide

Based on your Supabase project, here's what you need to configure:

## Connection String

From your Supabase dashboard:
```
postgresql://postgres:[YOUR-PASSWORD]@db.siwxtkliohdhmtzkerxq.supabase.co:5432/postgres
```

## Required Environment Variables

Add these to `apps/web/.env.local`:

```env
# Database Connection
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.siwxtkliohdhmtzkerxq.supabase.co:5432/postgres

# Supabase Configuration
# Get these from: Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://siwxtkliohdhmtzkerxq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Steps to Configure

1. **Get your database password:**
   - If you don't know it, reset it in: Database Settings → Reset database password
   - Replace `[YOUR-PASSWORD]` in DATABASE_URL with your actual password

2. **Get API keys:**
   - Go to: Settings → API
   - Copy:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

3. **Create Storage Bucket:**
   - Go to: Storage → Create bucket
   - Name: `label-images`
   - Set to: Public (or Private, your choice)

4. **Run migrations:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

## IPv4 Compatibility Note

Your connection string shows "Not IPv4 compatible". If you encounter connection issues:

- **Option 1:** Use Session Pooler (recommended for serverless)
  - Change connection string to use port `6543` instead of `5432`
  - Format: `postgresql://postgres:[PASSWORD]@db.siwxtkliohdhmtzkerxq.supabase.co:6543/postgres?pgbouncer=true`

- **Option 2:** Purchase IPv4 add-on (if needed)

## Quick Setup Script

After updating `.env.local`, test the connection:

```bash
# Test database connection
npm run db:studio

# Or test via API
curl http://localhost:3000/api/products/lookup?barcode=3017620422003
```

