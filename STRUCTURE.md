# LabelWise Repository Structure

```
LabelWise/
├── apps/
│   └── web/                          # Next.js 16 application
│       ├── app/
│       │   ├── api/                  # API routes
│       │   │   ├── products/
│       │   │   │   └── lookup/       # GET /api/products/lookup
│       │   │   ├── labels/
│       │   │   │   └── upload/       # POST /api/labels/upload
│       │   │   ├── analyses/         # POST /api/analyses
│       │   │   └── profiles/          # GET/PUT /api/profiles
│       │   ├── layout.tsx
│       │   ├── page.tsx              # Landing page
│       │   └── globals.css
│       ├── lib/
│       │   ├── supabase/
│       │   │   ├── client.ts         # Client-side Supabase
│       │   │   └── server.ts          # Server-side Supabase
│       │   └── api/
│       │       ├── errors.ts         # API error handling
│       │       └── validation.ts     # Request validation helpers
│       ├── .env.example
│       └── package.json
│
├── packages/
│   ├── shared/                       # Shared types and schemas
│   │   ├── src/
│   │   │   ├── types.ts              # TypeScript types
│   │   │   ├── schemas.ts            # Zod validation schemas
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── db/                           # Database layer
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   ├── users.ts
│   │   │   │   ├── profiles.ts
│   │   │   │   ├── products.ts
│   │   │   │   ├── product-labels.ts
│   │   │   │   ├── ingredients.ts
│   │   │   │   ├── ingredient-aliases.ts
│   │   │   │   ├── ingredient-facts.ts
│   │   │   │   ├── analyses.ts
│   │   │   │   ├── audit-logs.ts
│   │   │   │   └── index.ts
│   │   │   ├── client.ts             # Drizzle client
│   │   │   └── index.ts
│   │   ├── migrations/               # Generated migrations
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   │
│   └── core/                         # Domain services
│       ├── src/
│       │   ├── products/             # ProductService (Phase B)
│       │   ├── labels/               # LabelService (Phase B)
│       │   ├── ingredients/          # IngredientService (Phase C)
│       │   ├── profiles/             # ProfileService (Phase C)
│       │   ├── scoring/              # ScoringService (Phase C)
│       │   ├── reports/              # ReportService (Phase D)
│       │   └── index.ts
│       └── package.json
│
├── package.json                      # Root workspace config
├── turbo.json                        # Turborepo config
├── tsconfig.json                     # Root TypeScript config
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── README.md
├── ROADMAP.md
└── STRUCTURE.md                      # This file
```

## Key Design Decisions

### Monorepo with Workspaces
- Single repository for all packages
- Shared dependencies and tooling
- Easy cross-package imports
- Turborepo for build orchestration

### Clean Architecture Boundaries
- **apps/web**: Presentation layer (Next.js routes, UI)
- **packages/shared**: Contracts (types, schemas)
- **packages/db**: Data access layer (Drizzle schema)
- **packages/core**: Business logic (domain services)

### API Design
- Thin route handlers (delegate to services)
- Zod validation on all inputs/outputs
- Consistent error handling
- Type-safe end-to-end

### Database Schema
- UUID primary keys
- JSONB for flexible fields (allergens, nutrition, etc.)
- Timestamps on all tables
- Foreign key relationships with proper cascades
- Audit logging table for debugging

## Next Steps (Phase B)

1. Implement `ProductService` with Open Food Facts integration
2. Implement `LabelService` with OCR pipeline
3. Add ingredient parsing logic
4. Wire up API routes to services
5. Add unit tests for parsing and normalization

