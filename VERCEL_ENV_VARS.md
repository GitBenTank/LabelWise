# Vercel Environment Variables

## Required Environment Variables

Set these in **Vercel → Project → Settings → Environment Variables**:

### For Production + Preview + Development:

1. **NEXT_PUBLIC_SUPABASE_URL**
   ```
   https://siwxtkliohdhmtzkerxq.supabase.co
   ```

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   ```
   sb_publishable_WrdrRZh3e_6b_nAQs487kw_ZQKaKw5e
   ```

3. **SUPABASE_SERVICE_ROLE_KEY**
   ```
   sb_secret_KXK8ojw6xY6qc56R6DJt5g_6P7VFxZt
   ```
   ⚠️ **Important:** Do NOT prefix this with `NEXT_PUBLIC_` - it must stay server-only.

4. **DATABASE_URL**
   ```
   postgresql://postgres.siwxtkliohdhmtzkerxq:9%24GW3eZWp%2Br%264NE@aws-0-us-west-2.pooler.supabase.com:5432/postgres
   ```
   ⚠️ **Important:** The password is URL-encoded. Special characters:
   - `$` → `%24`
   - `+` → `%2B`
   - `&` → `%26`

## Supabase Storage Bucket

### Recommended Settings for `label-images` bucket:

- **Visibility:** Private ✅
- **Bucket name:** `label-images`
- **Allowed MIME types:** `image/jpeg`, `image/png`, `image/webp`
- **Max file size:** 10MB

**Why Private?** Label photos can contain personal information (store locations, timestamps, background details). Private buckets prevent accidental public exposure while still allowing server-side access via the service role key.

## Build Cache

Enable build cache **after** the first successful deployment. It speeds up builds but won't fix TypeScript or environment variable issues.

