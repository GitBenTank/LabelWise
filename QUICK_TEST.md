# Quick Test Guide (Without Database)

If you don't have PostgreSQL installed, you can still test the UI and some features:

## What Works Without Database

✅ **All UI Pages** - Homepage, Scan, Upload, Profile  
✅ **Navigation** - All links work  
✅ **Forms** - Can fill out and submit (will show errors)  
✅ **Components** - All React components render  

## What Needs Database

❌ **Product Lookup API** - Needs DB to cache products  
❌ **Analysis API** - Needs DB to store results  
❌ **Label Upload API** - Needs DB to store label data  

## Quick Test Steps

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test UI pages:**
   - http://localhost:3000 - Homepage ✅
   - http://localhost:3000/scan - Scan page ✅
   - http://localhost:3000/upload - Upload page ✅
   - http://localhost:3000/profile - Profile page ✅

3. **Test in browser:**
   - Click through all pages
   - Try uploading an image (will show error, but UI works)
   - Fill out forms (will show errors, but validation works)

## To Get Full Functionality

You need PostgreSQL. Options:

### Option 1: Install PostgreSQL
```bash
# macOS
brew install postgresql@14
brew services start postgresql@14
createdb labelwise_dev

# Then update .env.local:
DATABASE_URL=postgresql://localhost:5432/labelwise_dev
```

### Option 2: Use Docker
```bash
docker run --name labelwise-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=labelwise_dev \
  -p 5432:5432 \
  -d postgres:14

# Then update .env.local:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/labelwise_dev
```

### Option 3: Use Supabase (Cloud)
- Create free account at supabase.com
- Get connection string from Settings → Database
- Update .env.local with DATABASE_URL

## Current Status

The server is running at http://localhost:3000

You can test all UI features right now. API endpoints will show helpful error messages until you configure the database.

