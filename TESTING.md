# Testing LabelWise Locally

Yes! You can test **full functionality locally** without Supabase. Here's how:

## Quick Start (3 Options)

### Option 1: Automated Setup (Easiest)

```bash
# Run the setup script
./scripts/setup-local.sh

# Generate and run migrations
npm run db:generate
npm run db:migrate

# Start the server
npm run dev
```

This will:
- ✅ Check if PostgreSQL is installed
- ✅ Create a local database (`labelwise_dev`)
- ✅ Configure `.env.local` with local database URL
- ✅ Set up local file storage (no Supabase needed)

### Option 2: Manual Setup

1. **Install PostgreSQL:**
   ```bash
   # macOS
   brew install postgresql@14
   brew services start postgresql@14
   
   # Create database
   createdb labelwise_dev
   ```

2. **Configure `.env.local`:**
   ```env
   DATABASE_URL=postgresql://localhost:5432/labelwise_dev
   # Leave Supabase vars empty - local storage will be used
   ```

3. **Run migrations:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

### Option 3: Docker PostgreSQL

```bash
# Start PostgreSQL
docker run --name labelwise-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=labelwise_dev \
  -p 5432:5432 \
  -d postgres:14

# Use in .env.local:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/labelwise_dev
```

## What Works Locally

### ✅ Fully Functional

- **Barcode Lookup** - Uses Open Food Facts API (public, no auth needed)
- **Product Analysis** - Complete scoring engine with all rules
- **Label Upload** - Saves to `apps/web/public/uploads/labels/`
- **OCR Processing** - Tesseract.js runs in browser
- **Database Operations** - All CRUD operations work
- **UI Components** - All pages and components functional

### 📁 Local File Storage

When Supabase is not configured:
- Images saved to: `apps/web/public/uploads/labels/`
- Served at: `http://localhost:3000/uploads/labels/[filename]`
- Automatically created on first upload

## Testing Endpoints

### 1. Product Lookup
```bash
curl "http://localhost:3000/api/products/lookup?barcode=3017620422003"
```

### 2. Generate Analysis
```bash
curl -X POST http://localhost:3000/api/analyses \
  -H "Content-Type: application/json" \
  -d '{"barcode":"3017620422003"}'
```

### 3. Upload Label
```bash
curl -X POST http://localhost:3000/api/labels/upload \
  -F "file=@path/to/label-image.jpg"
```

### 4. Full Test Suite
```bash
./scripts/test-endpoints.sh
```

## Testing in Browser

1. **Homepage**: http://localhost:3000
2. **Scan Barcode**: http://localhost:3000/scan
   - Enter barcode: `3017620422003`
   - Should show product analysis
3. **Upload Label**: http://localhost:3000/upload
   - Upload a label image
   - Should process with OCR and show analysis
4. **Profile**: http://localhost:3000/profile
   - Configure allergens and preferences

## Troubleshooting

### Database Connection

```bash
# Check PostgreSQL is running
pg_isready

# Check database exists
psql -l | grep labelwise

# Reset database
dropdb labelwise_dev
createdb labelwise_dev
npm run db:migrate
```

### Port Conflicts

```bash
# Check what's using port 5432
lsof -i :5432

# Or use different port in Docker
docker run -p 5433:5432 ...
```

### Upload Directory

The uploads directory is created automatically. If you see errors:
```bash
mkdir -p apps/web/public/uploads/labels
```

## Comparison: Local vs Supabase

| Feature | Local Development | Supabase Production |
|---------|------------------|---------------------|
| Database | Local PostgreSQL | Supabase PostgreSQL |
| Storage | Local filesystem | Supabase Storage |
| Auth | Not required | Supabase Auth |
| Setup | 5 minutes | 10 minutes |
| Cost | Free | Free tier available |

## Next Steps

Once local testing works:
1. ✅ Test all features end-to-end
2. ✅ Add test data
3. ✅ When ready for production, configure Supabase
4. ✅ Deploy to Vercel

See `LOCAL_DEV.md` for more detailed setup instructions.

