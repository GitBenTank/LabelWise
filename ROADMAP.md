# LabelWise Roadmap

## Phase 1: MVP (Current)

### Phase A: Foundation ✅
- Monorepo setup
- Next.js + TypeScript + Tailwind
- Supabase (DB, Auth, Storage)
- Drizzle ORM with migrations
- API skeleton with Zod validation
- Shared types and schemas

### Phase B: Product + Label (In Progress)
- Barcode lookup via Open Food Facts adapter
- Product caching in database
- Label image upload to Supabase Storage
- OCR pipeline (Tesseract.js for MVP)
- Ingredient parsing and normalization
- Nutrition facts extraction

### Phase C: Ingredient KB + Scoring
- Ingredient knowledge base seed data
- Canonical ingredient matching
- Alias/synonym resolution
- LabelWise scoring algorithm
- Explainable score reasons
- Flag generation (allergens, diet, additives, nutrition)

### Phase D: UI
- Landing page with scan/upload actions
- Product results page with score
- Ingredient list with expandable details
- Profile settings (allergens, diet, preferences)
- "What this means" explanations
- "Sources & confidence" section
- Loading states and error handling

### Phase E: Polish
- Comprehensive error handling
- API rate limiting
- Audit logging
- Privacy-safe analytics
- Performance optimization
- Accessibility improvements

## Phase 2: Enhanced Features

### Mobile App
- React Native (Expo) app
- Native barcode scanning
- Camera integration for label photos
- Offline mode for cached products

### Community Features
- User-submitted corrections
- Community ingredient notes
- Product photo sharing
- Verified product data

### Advanced Analysis
- Product comparison tool
- "Swap suggestions" (healthier alternatives)
- Personalized weekly digest
- Historical tracking of product changes

### Integrations
- Store-specific pricing and availability
- Recipe integration
- Meal planning features
- Export to health tracking apps

### Browser Extension
- Nutrition label overlay on shopping sites
- Quick ingredient checks while browsing
- Price + health score comparison

## Phase 3: Scale & Intelligence

### Data Quality
- Multi-source product data aggregation
- Confidence scoring for data sources
- Automated data validation
- Expert review workflow

### AI Enhancements
- Improved OCR accuracy
- Natural language ingredient explanations
- Personalized recommendations
- Trend detection in product changes

### Enterprise
- B2B API for retailers
- White-label solutions
- Custom scoring models
- Bulk product analysis

## Technical Debt & Improvements

- [ ] Migrate from Tesseract.js to more accurate OCR service
- [ ] Add comprehensive test coverage
- [ ] Implement caching strategy (Redis)
- [ ] Add monitoring and observability
- [ ] Set up CI/CD pipeline
- [ ] Performance optimization (CDN, image optimization)
- [ ] Internationalization (i18n)
- [ ] Multi-language ingredient support

## Notes

- All phases prioritize calm, factual language
- No medical claims or fear-mongering
- Privacy-first approach
- Transparent and explainable scoring
- Open to community contributions

