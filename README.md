# LabelWise

**Calm clarity for what you eat.**

LabelWise is a nutrition and ingredient transparency app that helps people understand what's really in products, in plain language, with sources and confidence levels. The vibe is calm + powerful (not fear-mongering).

## Architecture

This is a monorepo built with:

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth
- **ORM**: Drizzle
- **Storage**: Supabase Storage
- **Validation**: Zod schemas

### Monorepo Structure

```
LabelWise/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── shared/           # Shared types and Zod schemas
│   ├── db/               # Drizzle schema and migrations
│   └── core/             # Domain services (products, labels, ingredients, scoring)
└── package.json          # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Supabase account)
- npm or yarn

### Setup

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Copy the example env file and fill in your values:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin operations)
- `DATABASE_URL` - PostgreSQL connection string

Optional:

- `OPEN_FOOD_FACTS_BASE_URL` - Defaults to public API
- `LLM_API_KEY` - For AI-powered ingredient explanations (optional)

3. **Set up the database:**

Generate and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

Or use Drizzle Studio to inspect the database:

```bash
npm run db:studio
```

4. **Run the development server:**

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Product Lookup
```bash
GET /api/products/lookup?barcode=3017620422003
```

### Label Upload
```bash
POST /api/labels/upload
Content-Type: multipart/form-data
- file: (image file)
- productId: (optional)
```

### Analysis Generation
```bash
POST /api/analyses
Content-Type: application/json
{
  "barcode": "3017620422003",  // OR "productId" OR "labelUploadId"
  "profileId": "optional-profile-id"
}
```

Returns a `LabelWiseReport` with:
- Score (0-100) and verdict (good/mixed/avoid)
- Flags with evidence
- Ingredient breakdown with concerns
- Allergen warnings
- Nutrition data
- Sources and confidence levels

## Development

### Available Scripts

- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all packages and apps
- `npm run lint` - Lint all packages
- `npm run type-check` - Type check all packages
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

### Code Structure

- **Thin routes, fat services**: API route handlers should be minimal, delegating to service classes
- **Zod validation**: All API requests/responses are validated with Zod schemas
- **Type safety**: Strict TypeScript throughout
- **Clean boundaries**: Domain logic lives in `packages/core`, not in API routes

## Project Status

### Phase A: Foundation ✅

- [x] Monorepo setup with Turborepo
- [x] Next.js app with TypeScript and Tailwind
- [x] Supabase configuration
- [x] Drizzle schema and migrations
- [x] API route skeleton with Zod validation
- [x] Shared types and schemas

### Phase B: Product + Label ✅

- [x] Barcode lookup via Open Food Facts
- [x] Product caching layer
- [x] Label upload and OCR pipeline
- [x] Ingredient parser and normalizer
- [x] Analysis and report generation
- [x] Deterministic scoring engine (0-100)
- [x] Evidence-based flags and concerns

### Phase C: Ingredient KB + Scoring ✅

- [x] Ingredient canonicalization and alias matching
- [x] Scoring engine with explainability
- [x] Unit tests for scoring and parser

### Phase D: UI

- [ ] Scan/search screen
- [ ] Product results page
- [ ] Ingredient detail drawer
- [ ] Profile settings screen
- [ ] Sources & confidence component

### Phase E: Polish

- [ ] Error handling and loading states
- [ ] API rate limiting
- [ ] Logging and audit trails
- [ ] Basic analytics events

See [ROADMAP.md](./ROADMAP.md) for future phases.

## Safety & Legal

LabelWise provides general educational information about ingredients and nutrition. It is not medical advice. Users should consult healthcare professionals for dietary or health-related decisions.

## License

[Add your license here]

