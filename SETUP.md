# LabelWise Setup Guide

## C0: One-Command Local Run

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Supabase account)
- npm or yarn

### Quick Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/web/.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin operations)
- `DATABASE_URL` - PostgreSQL connection string (can be from Supabase)

3. **Set up Supabase Storage:**
   - Go to Supabase Dashboard → Storage
   - Create bucket named `label-images`
   - Set to private (or public if you prefer)

4. **Set up the database:**
```bash
npm run db:generate
npm run db:migrate
```

5. **Start development server:**
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all packages and apps
- `npm run lint` - Lint all packages
- `npm run type-check` - Type check all packages
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

## C1: End-to-End Testing

### Barcode Path

1. **Look up a product:**
```bash
curl "http://localhost:3000/api/products/lookup?barcode=3017620422003"
```

2. **Generate analysis:**
```bash
curl -X POST http://localhost:3000/api/analyses \
  -H "Content-Type: application/json" \
  -d '{"barcode":"3017620422003"}'
```

### Upload → OCR → Analyze Path

1. **Upload a label image:**
   - Go to http://localhost:3000/upload
   - Upload a label image
   - Note the `id` returned in the response

2. **Generate analysis from label:**
```bash
curl -X POST http://localhost:3000/api/analyses \
  -H "Content-Type: application/json" \
  -d '{"labelUploadId":"<id-from-upload>"}'
```

3. **Verify in UI:**
   - Navigate to the product results page
   - Confirm scan quality indicator shows
   - Verify all sections display correctly

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure database migrations have run

### Storage Issues
- Verify `label-images` bucket exists in Supabase
- Check bucket permissions
- Verify service role key has storage access

### OCR Not Working
- Check browser console for errors
- Verify Tesseract.js is loading (may take a moment on first use)
- Try a clearer label image

### Type Errors
- Run `npm run type-check` to see all type errors
- Ensure all packages are built: `npm run build`

## Next Steps

After setup is complete, proceed with:
- C2: Premium UI upgrades
- C3: Trust & Safety layer
- C4: Auth + history
- C5: Ship to production

