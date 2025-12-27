import { z } from 'zod';

/**
 * Zod schemas for API request/response validation
 */

// User Profile Schemas
export const allergenSchema = z.enum([
  'peanut',
  'tree-nut',
  'milk',
  'egg',
  'soy',
  'wheat',
  'fish',
  'shellfish',
  'sesame',
]);

export const dietPreferenceSchema = z.enum([
  'vegan',
  'vegetarian',
  'keto',
  'halal',
  'low-sodium',
  'low-sugar',
  'paleo',
  'none',
]);

export const severityLevelSchema = z.enum(['strict', 'moderate', 'info-only']);

export const userProfileSchema = z.object({
  allergens: z.array(allergenSchema).default([]),
  dietPreferences: z.array(dietPreferenceSchema).default([]),
  avoidList: z.array(z.string()).default([]),
  severity: severityLevelSchema.default('moderate'),
});

// Product Lookup Schemas
export const barcodeLookupRequestSchema = z.object({
  barcode: z.string().min(1, 'Barcode is required'),
});

export const productResponseSchema = z.object({
  id: z.string(),
  barcode: z.string(),
  name: z.string(),
  brand: z.string().nullable(),
  categories: z.array(z.string()).default([]),
  source: z.string(),
  sourceUrl: z.string().nullable(),
  cachedAt: z.string().datetime(),
});

// Label Upload Schemas
export const labelUploadRequestSchema = z.object({
  productId: z.string().optional(),
  imageUrl: z.string().url().optional(),
  rawText: z.string().optional(),
});

export const labelParseResponseSchema = z.object({
  id: z.string(),
  productId: z.string().nullable(),
  rawText: z.string(),
  ingredients: z.array(z.string()),
  nutrition: z.record(z.number().nullable()),
  allergenStatements: z.array(z.string()).default([]),
  mayContain: z.array(z.string()).default([]),
  confidence: z.enum(['high', 'medium', 'low']),
});

// Analysis Schemas
export const analysisRequestSchema = z
  .object({
    barcode: z.string().optional(),
    productId: z.string().optional(),
    labelUploadId: z.string().optional(),
    profileId: z.string().optional(),
  })
  .refine(
    (data) => {
      const provided = [
        data.barcode,
        data.productId,
        data.labelUploadId,
      ].filter(Boolean);
      return provided.length === 1;
    },
    {
      message: 'Exactly one of barcode, productId, or labelUploadId must be provided',
    }
  );

export const evidenceSchema = z.object({
  source: z.enum(['openfoodfacts', 'label', 'curated']),
  ref: z.string().optional(),
  field: z.string().optional(),
  confidence: z.number().min(0).max(100),
  note: z.string().optional(),
});

export const concernSchema = z.object({
  type: z.string(),
  message: z.string(),
  severity: z.enum(['low', 'med', 'high']),
  evidence: z.array(evidenceSchema),
});

export const reportVerdictSchema = z.enum(['good', 'mixed', 'avoid']);

export const labelWiseReportSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.object({
    headline: z.string(),
    verdict: reportVerdictSchema,
  }),
  flags: z.array(
    z.object({
      code: z.string(),
      title: z.string(),
      severity: z.enum(['low', 'med', 'high']),
      message: z.string(),
      evidence: z.array(evidenceSchema),
    })
  ),
  ingredients: z.array(
    z.object({
      name: z.string(),
      normalized: z.string(),
      concerns: z.array(concernSchema),
      confidence: z.number().min(0).max(100),
    })
  ),
  allergens: z.array(
    z.object({
      name: z.string(),
      detectedFrom: z.enum(['label', 'off', 'both']),
    })
  ),
  nutrition: z
    .object({
      per100g: z.record(z.number().nullable()).optional(),
      serving: z.record(z.number().nullable()).optional(),
      nutriScore: z.string().optional(),
      novaGroup: z.number().optional(),
    })
    .optional(),
  sources: z.array(evidenceSchema),
  generatedAt: z.string().datetime(),
});

export const analysisFlagSchema = z.object({
  type: z.enum(['allergen', 'diet', 'additive', 'nutrition']),
  severity: z.enum(['warning', 'info', 'caution']),
  message: z.string(),
  reason: z.string(),
  ingredientId: z.string().optional(),
  nutritionField: z.string().optional(),
});

export const labelWiseScoreSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  flags: z.array(analysisFlagSchema),
  reasons: z.array(
    z.object({
      type: z.string(),
      description: z.string(),
      impact: z.number(),
      confidence: z.enum(['high', 'medium', 'low']),
    })
  ),
  confidence: z.enum(['high', 'medium', 'low']),
});

export const analysisResponseSchema = z.object({
  id: z.string(),
  labelId: z.string(),
  profileId: z.string().nullable(),
  score: labelWiseScoreSchema,
  createdAt: z.string().datetime(),
});

// Ingredient Schemas
export const ingredientDetailSchema = z.object({
  id: z.string(),
  canonicalName: z.string(),
  aliases: z.array(z.string()).default([]),
  description: z.string(),
  category: z.string(),
  dietaryFlags: z
    .object({
      vegan: z.boolean().optional(),
      vegetarian: z.boolean().optional(),
      glutenFree: z.boolean().optional(),
      dairyFree: z.boolean().optional(),
    })
    .optional(),
  sensitivityNotes: z.string().optional(),
  sources: z
    .array(
      z.object({
        url: z.string().url(),
        title: z.string(),
        confidence: z.enum(['high', 'medium', 'low']),
      })
    )
    .default([]),
});

// API Error Schema
export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  code: z.string().optional(),
});

