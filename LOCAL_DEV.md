# Local Development Setup (No Supabase Required)

This guide shows you how to run LabelWise **fully locally** without requiring Supabase or external services.

## Option 1: Full Local Setup (Recommended for Testing)

### Prerequisites

- Node.js 18+
- PostgreSQL installed locally (or use Docker)

### Quick Setup

1. **Install PostgreSQL locally:**
   ```bash
   # macOS
   brew install postgresql@14
   brew services start postgresql@14
   
   # Create database
   createdb labelwise_dev
   ```

2. **Set up environment variables:**
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

   Edit `apps/web/.env.local`:
   ```env
   # Local PostgreSQL (no Supabase needed)
   DATABASE_URL=postgresql://localhost:5432/labelwise_dev
   
   # Leave Supabase vars empty or remove them
   # NEXT_PUBLIC_SUPABASE_URL=
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=
   # SUPABASE_SERVICE_ROLE_KEY=
   ```

3. **Run database migrations:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start the dev server:**
   ```bash
   npm run dev
   ```

### What Works Locally

✅ **Barcode Lookup** - Uses Open Food Facts API (no config needed)  
✅ **Product Analysis** - Full scoring and report generation  
✅ **Label Upload** - Uses local file storage (saves to `public/uploads/labels/`)  
✅ **OCR Processing** - Tesseract.js runs in browser  
✅ **Database** - All data stored in local PostgreSQL  

### Local File Storage

When Supabase is not configured, uploaded images are saved to:
- `apps/web/public/uploads/labels/`
- Served at: `http://localhost:3000/uploads/labels/[filename]`

## Option 2: Docker PostgreSQL (Easiest)

If you don't want to install PostgreSQL:

```bash
# Start PostgreSQL in Docker
docker run --name labelwise-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=labelwise_dev \
  -p 5432:5432 \
  -d postgres:14

# Use this DATABASE_URL in .env.local:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/labelwise_dev
```

## Option 3: Minimal Testing (No Database)

For UI testing only, you can run without a database:

1. **Set a dummy DATABASE_URL:**
   ```env
   DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
   ```

2. **The app will show errors on API calls**, but:
   - ✅ All UI pages work
   - ✅ Navigation works
   - ✅ Forms and components render
   - ❌ API endpoints will fail (but show helpful errors)

## Testing Endpoints

Once set up, test with:

```bash
# Product lookup (works without DB)
curl "http://localhost:3000/api/products/lookup?barcode=3017620422003"

# Analysis (needs DB)
curl -X POST http://localhost:3000/api/analyses \
  -H "Content-Type: application/json" \
  -d '{"barcode":"3017620422003"}'

# Upload label (works with local storage)
curl -X POST http://localhost:3000/api/labels/upload \
  -F "file=@path/to/label.jpg"
```

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Check database exists
psql -l | grep labelwise

# Create database if missing
createdb labelwise_dev
```

### Port Already in Use

```bash
# Find what's using port 5432
lsof -i :5432

# Or use a different port in Docker
docker run -p 5433:5432 ...
```

### Reset Database

```bash
# Drop and recreate
dropdb labelwise_dev
createdb labelwise_dev
npm run db:migrate
```

## Next Steps

Once local setup works:
1. Test all features end-to-end
2. Add test data to database
3. When ready for production, switch to Supabase

