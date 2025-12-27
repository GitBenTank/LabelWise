/**
 * Core domain types for LabelWise
 */

export type DietPreference =
  | 'vegan'
  | 'vegetarian'
  | 'keto'
  | 'halal'
  | 'low-sodium'
  | 'low-sugar'
  | 'paleo'
  | 'none';

export type Allergen =
  | 'peanut'
  | 'tree-nut'
  | 'milk'
  | 'egg'
  | 'soy'
  | 'wheat'
  | 'fish'
  | 'shellfish'
  | 'sesame';

export type SeverityLevel = 'strict' | 'moderate' | 'info-only';

export type IngredientCategory =
  | 'preservative'
  | 'emulsifier'
  | 'sweetener'
  | 'color'
  | 'flavor'
  | 'thickener'
  | 'stabilizer'
  | 'antioxidant'
  | 'acid'
  | 'base'
  | 'other';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface UserProfile {
  allergens: Allergen[];
  dietPreferences: DietPreference[];
  avoidList: string[]; // Custom ingredient names or patterns
  severity: SeverityLevel;
}

export interface IngredientFact {
  ingredientId: string;
  description: string;
  category: IngredientCategory;
  dietaryFlags: {
    vegan?: boolean;
    vegetarian?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
  };
  sensitivityNotes?: string;
  sources: Array<{
    url: string;
    title: string;
    confidence: ConfidenceLevel;
  }>;
}

export interface AnalysisFlag {
  type: 'allergen' | 'diet' | 'additive' | 'nutrition';
  severity: 'warning' | 'info' | 'caution';
  message: string;
  reason: string;
  ingredientId?: string;
  nutritionField?: string;
}

export interface LabelWiseScore {
  score: number; // 0-100
  summary: string;
  flags: AnalysisFlag[];
  reasons: Array<{
    type: string;
    description: string;
    impact: number; // How much this affects the score
    confidence: ConfidenceLevel;
  }>;
  confidence: ConfidenceLevel;
}

export interface ProductLabel {
  rawText: string;
  ingredients: string[];
  nutrition: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    sodium?: number;
    sugar?: number;
    fiber?: number;
    [key: string]: number | undefined;
  };
  allergenStatements?: string[];
  mayContain?: string[];
}

/**
 * Product domain types
 */
export interface ExternalProduct {
  barcode: string;
  name: string;
  brand: string | null;
  categories: string[];
  ingredientsText: string | null;
  ingredientsTags: string[]; // Normalized ingredient tags from OFF
  nutrition: Record<string, number | null>;
  imageUrl: string | null;
  source: string;
  sourceUrl: string | null;
  rawData: unknown; // Full API response for audit
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string | null;
  categories: string[];
  source: string;
  sourceUrl: string | null;
  cachedAt: Date;
}

/**
 * Analysis and Report types
 */
export type ReportVerdict = 'good' | 'mixed' | 'avoid';

export type FlagSeverity = 'low' | 'med' | 'high';

export interface Evidence {
  source: 'openfoodfacts' | 'label' | 'curated';
  ref?: string;
  field?: string;
  confidence: number; // 0-100
  note?: string;
}

export interface Concern {
  type: string;
  message: string;
  severity: FlagSeverity;
  evidence: Evidence[];
}

export interface LabelWiseReport {
  score: number; // 0-100
  summary: {
    headline: string;
    verdict: ReportVerdict;
  };
  flags: Array<{
    code: string;
    title: string;
    severity: FlagSeverity;
    message: string;
    evidence: Evidence[];
  }>;
  ingredients: Array<{
    name: string;
    normalized: string;
    concerns: Concern[];
    confidence: number;
  }>;
  allergens: Array<{
    name: string;
    detectedFrom: 'label' | 'off' | 'both';
  }>;
  nutrition?: {
    per100g?: Record<string, number | null>;
    serving?: Record<string, number | null>;
    nutriScore?: string;
    novaGroup?: number;
  };
  sources: Evidence[];
  generatedAt: string;
}
