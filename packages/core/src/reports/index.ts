/**
 * Report generation and summary views
 */

import type {
  LabelWiseReport,
  Evidence,
  Concern,
  Product,
} from '@labelwise/shared';
import { ScoringService, type ScoringContext } from '../scoring';
import type { IngredientService } from '../ingredients';

export interface ReportContext {
  product: Product;
  externalProduct?: {
    ingredientsText: string | null;
    ingredientsTags: string[];
    nutrition: Record<string, number | null>;
    rawData: unknown;
  };
  labelData?: {
    ingredients: string[];
    nutrition: Record<string, number | null>;
    allergenStatements: string[];
    mayContain: string[];
    confidence?: 'high' | 'medium' | 'low';
  };
  profile?: {
    allergens: string[];
    dietPreferences: string[];
    avoidList: string[];
  };
}

/**
 * Report generation service
 */
export class ReportService {
  constructor(
    private readonly scoringService: ScoringService,
    private readonly ingredientService: IngredientService
  ) {}

  async generateReport(context: ReportContext): Promise<LabelWiseReport> {
    // Normalize ingredients
    const ingredients = context.labelData?.ingredients || [];
    const normalized = await this.ingredientService.normalizeIngredients(
      context.externalProduct || {
        barcode: context.product.barcode,
        name: context.product.name,
        brand: context.product.brand,
        categories: context.product.categories,
        ingredientsText: context.externalProduct?.ingredientsText || null,
        ingredientsTags: context.externalProduct?.ingredientsTags || [],
        nutrition: context.externalProduct?.nutrition || {},
        imageUrl: null,
        source: context.product.source,
        sourceUrl: context.product.sourceUrl,
        rawData: context.externalProduct?.rawData || {},
      }
    );

    // Extract allergens
    const allergens: string[] = [];
    let allergenSource: 'label' | 'off' | 'both' = 'label';

    if (context.labelData?.allergenStatements) {
      allergens.push(...context.labelData.allergenStatements);
    }
    if (context.labelData?.mayContain) {
      allergens.push(...context.labelData.mayContain);
    }

    // Extract NOVA group and Nutri-Score from OFF raw data if available
    let novaGroup: number | undefined;
    let nutriScore: string | undefined;

    if (context.externalProduct?.rawData) {
      const raw = context.externalProduct.rawData as Record<string, unknown>;
      if (typeof raw.nova_group === 'number') {
        novaGroup = raw.nova_group;
      }
      if (typeof raw.nutriscore_grade === 'string') {
        nutriScore = raw.nutriscore_grade.toUpperCase();
      }
    }

    // Build scoring context
    const scoringContext: ScoringContext = {
      productName: context.product.name,
      categories: context.product.categories,
      nutrition: context.externalProduct?.nutrition || context.labelData?.nutrition,
      novaGroup,
      nutriScore,
      ingredients,
      normalizedIngredients: normalized.normalized,
      allergens,
      allergenSource,
      profile: context.profile,
    };

    // Compute score
    const scoreResult = this.scoringService.computeScore(scoringContext);

    // Build ingredient details with concerns
    const ingredientDetails = ingredients.map((ing, idx) => {
      const normalized = normalized.normalized[idx];
      const concerns: Concern[] = [];

      // Check if any rules flagged this ingredient
      scoreResult.ruleResults.forEach((rule) => {
        if (rule.message.toLowerCase().includes(ing.toLowerCase())) {
          concerns.push({
            type: rule.title,
            message: rule.message,
            severity: rule.severity,
            evidence: rule.evidence,
          });
        }
      });

      return {
        name: ing,
        normalized: normalized?.original || ing,
        concerns,
        confidence: 75, // Can be enhanced with OCR confidence
      };
    });

    // Build allergen list
    const allergenList = Array.from(new Set(allergens)).map((allergen) => ({
      name: allergen,
      detectedFrom: allergenSource,
    }));

    // Build flags
    const flags = scoreResult.ruleResults.map((rule, idx) => ({
      code: `RULE_${idx}`,
      title: rule.title,
      severity: rule.severity,
      message: rule.message,
      evidence: rule.evidence,
    }));

    // Collect all sources
    const sources: Evidence[] = [];
    if (context.product.source === 'open-food-facts') {
      sources.push({
        source: 'openfoodfacts',
        ref: context.product.sourceUrl || undefined,
        confidence: 85,
        note: 'Product data from Open Food Facts',
      });
    }
    if (context.labelData) {
      const labelConfidence = context.labelData.confidence === 'high' ? 85 : 
                             context.labelData.confidence === 'medium' ? 70 : 50;
      sources.push({
        source: 'label',
        confidence: labelConfidence,
        note: `Parsed from product label (${context.labelData.confidence || 'medium'} quality)`,
      });
    }
    sources.push(...scoreResult.allEvidence);

    // Build report
    const report: LabelWiseReport = {
      score: scoreResult.score,
      summary: {
        headline: scoreResult.headline,
        verdict: scoreResult.verdict,
      },
      flags,
      ingredients: ingredientDetails,
      allergens: allergenList,
      nutrition: context.externalProduct?.nutrition
        ? {
            per100g: context.externalProduct.nutrition,
          }
        : undefined,
      sources,
      generatedAt: new Date().toISOString(),
    };

    return report;
  }
}
