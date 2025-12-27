# Update DATABASE_URL in Vercel

## Your Database Password
Password: `9$GW3eZWp+r&4NE`

## Complete DATABASE_URL for Vercel

Copy this entire string and paste it as the value for `DATABASE_URL` in Vercel:

```
postgresql://postgres:9$GW3eZWp+r&4NE@db.siwxtkliohdhmtzkerxq.supabase.co:5432/postgres
```

## Steps to Update in Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Find `DATABASE_URL` in the list
3. Click the **three dots (⋯)** or **Edit** button
4. Replace the value with the connection string above
5. Make sure **Sensitive** is checked (it should be)
6. Click **Save**

## Important Notes

- The `$` and `&` characters in the password are special characters
- Make sure to copy the entire connection string exactly
- After updating, you'll need to **redeploy** for changes to take effect

## After Updating

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger auto-deployment

## Verify It Worked

After redeployment, check the build logs to ensure:
- ✅ Build completes successfully
- ✅ No database connection errors
- ✅ App deploys and is accessible

