# LabelWise Quick Start Guide

## Setup (5 minutes)

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment:**
```bash
cp apps/web/.env.example apps/web/.env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- `DATABASE_URL` - PostgreSQL connection string

3. **Set up database:**
```bash
npm run db:generate
npm run db:migrate
```

4. **Create Supabase Storage bucket:**
- Go to Supabase Dashboard → Storage
- Create bucket named `label-images`
- Set to private (or public if you prefer)

5. **Start dev server:**
```bash
npm run dev
```

## Test the API

### 1. Look up a product by barcode
```bash
curl "http://localhost:3000/api/products/lookup?barcode=3017620422003"
```

### 2. Generate an analysis
```bash
curl -X POST http://localhost:3000/api/analyses \
  -H "Content-Type: application/json" \
  -d '{"barcode": "3017620422003"}'
```

### 3. Upload a label image
```bash
curl -X POST http://localhost:3000/api/labels/upload \
  -F "file=@path/to/label-image.jpg"
```

## Example Analysis Response

```json
{
  "score": 75,
  "summary": {
    "headline": "Some concerns, but generally okay",
    "verdict": "mixed"
  },
  "flags": [
    {
      "code": "RULE_0",
      "title": "High sugar content",
      "severity": "med",
      "message": "This product contains 25.0g of sugar per 100g, which is considered high.",
      "evidence": [
        {
          "source": "openfoodfacts",
          "field": "sugars_100g",
          "confidence": 90,
          "ref": "sugar: 25.0g/100g"
        }
      ]
    }
  ],
  "ingredients": [
    {
      "name": "sugar",
      "normalized": "sugar",
      "concerns": [],
      "confidence": 75
    }
  ],
  "allergens": [],
  "nutrition": {
    "per100g": {
      "sugars_100g": 25.0,
      "salt_100g": 0.5
    }
  },
  "sources": [
    {
      "source": "openfoodfacts",
      "ref": "https://world.openfoodfacts.org/product/...",
      "confidence": 85,
      "note": "Product data from Open Food Facts"
    }
  ],
  "generatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Scoring Rules

The LabelWise score (0-100) is computed using these rules:

- **Base score:** 100
- **Allergen match:** -35 (if matches user profile)
- **Ultra-processed (NOVA 4):** -20
- **High sugar:** -15 (≥22.5g/100g or ≥11.25g/100ml for drinks)
- **High sodium:** -10 (≥1.5g salt/100g)
- **High saturated fat:** -8 (≥5g/100g)
- **Additives present:** -8 (scales with count)
- **Profile conflicts:** -25 (dietary preference violations)

**Verdict mapping:**
- ≥80: "good"
- 50-79: "mixed"
- <50: "avoid"

## Next Steps

- Add ingredient facts to database (seed script)
- Build UI (Phase B5)
- Add more sophisticated ingredient matching
- Enhance OCR accuracy

