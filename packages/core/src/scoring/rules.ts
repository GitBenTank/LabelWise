/**
 * Scoring rules: deterministic logic for flagging issues
 */

import type { Evidence, FlagSeverity } from '@labelwise/shared';
import { SCORING_CONFIG } from './scoring.config';

export type RuleId =
  | 'ALLERGEN_MATCH'
  | 'ULTRA_PROCESSED_NOVA_4'
  | 'HIGH_SUGAR'
  | 'HIGH_SODIUM'
  | 'HIGH_SATURATED_FAT'
  | 'ADDITIVES_PRESENT'
  | 'PROFILE_CONFLICTS';

export interface RuleResult {
  triggered: boolean;
  severity: FlagSeverity;
  scoreImpact: number;
  title: string;
  message: string;
  evidence: Evidence[];
}

export interface RuleContext {
  // Product data
  productName?: string;
  categories?: string[];
  nutrition?: Record<string, number | null>;
  novaGroup?: number;
  nutriScore?: string;

  // Ingredients
  ingredients: string[];
  normalizedIngredients: Array<{
    original: string;
    canonicalId: string | null;
  }>;

  // Allergens
  allergens: string[];
  allergenSource: 'label' | 'off' | 'both';

  // User profile
  profile?: {
    allergens: string[];
    dietPreferences: string[];
    avoidList: string[];
  };
}

/**
 * Check if allergens match user profile or common allergens
 */
export function ruleAllergenMatch(context: RuleContext): RuleResult {
  const { allergens, profile } = context;

  if (allergens.length === 0) {
    return {
      triggered: false,
      severity: 'low',
      scoreImpact: 0,
      title: '',
      message: '',
      evidence: [],
    };
  }

  // Check against user profile if provided
  if (profile && profile.allergens.length > 0) {
    const matches = allergens.filter((a) => profile.allergens.includes(a));
    if (matches.length > 0) {
      return {
        triggered: true,
        severity: 'high',
        scoreImpact: SCORING_CONFIG.RULE_IMPACTS.ALLERGEN_MATCH,
        title: 'Contains allergens based on your profile',
        message: `This product contains: ${matches.join(', ')}. Please check the label carefully.`,
        evidence: [
          {
            source: context.allergenSource === 'off' ? 'openfoodfacts' : 'label',
            field: 'allergens',
            confidence: 90,
            note: `Detected from ${context.allergenSource}`,
          },
        ],
      };
    }
  }

  // General allergen warning (lower severity)
  return {
    triggered: true,
    severity: 'med',
    scoreImpact: -15, // Less impact if not matching user profile
    title: 'Contains common allergens',
    message: `This product may contain: ${allergens.join(', ')}.`,
    evidence: [
      {
        source: context.allergenSource === 'off' ? 'openfoodfacts' : 'label',
        field: 'allergens',
        confidence: 85,
      },
    ],
  };
}

/**
 * Check for ultra-processed (NOVA 4)
 */
export function ruleUltraProcessed(context: RuleContext): RuleResult {
  if (context.novaGroup !== SCORING_CONFIG.THRESHOLDS.NOVA_4) {
    return {
      triggered: false,
      severity: 'low',
      scoreImpact: 0,
      title: '',
      message: '',
      evidence: [],
    };
  }

  return {
    triggered: true,
    severity: 'med',
    scoreImpact: SCORING_CONFIG.RULE_IMPACTS.ULTRA_PROCESSED_NOVA_4,
    title: 'Ultra-processed food',
    message:
      'This product is classified as ultra-processed. These foods often contain many additives and are typically high in salt, sugar, or fat.',
    evidence: [
      {
        source: 'openfoodfacts',
        field: 'nova_group',
        confidence: 85,
        note: 'NOVA classification system',
      },
    ],
  };
}

/**
 * Check for high sugar content
 */
export function ruleHighSugar(context: RuleContext): RuleResult {
  const nutrition = context.nutrition || {};
  const isDrink = context.categories?.some((cat) =>
    cat.toLowerCase().includes('drink') || cat.toLowerCase().includes('beverage')
  );

  let sugarValue: number | null = null;
  let field = '';

  // Try different field names
  if (nutrition.sugars_100g !== null && nutrition.sugars_100g !== undefined) {
    sugarValue = nutrition.sugars_100g;
    field = 'sugars_100g';
  } else if (nutrition.sugar !== null && nutrition.sugar !== undefined) {
    sugarValue = nutrition.sugar;
    field = 'sugar';
  }

  if (sugarValue === null) {
    return {
      triggered: false,
      severity: 'low',
      scoreImpact: 0,
      title: '',
      message: '',
      evidence: [],
    };
  }

  const threshold = isDrink
    ? SCORING_CONFIG.THRESHOLDS.SUGAR_DRINK_HIGH
    : SCORING_CONFIG.THRESHOLDS.SUGAR_HIGH;

  if (sugarValue >= threshold) {
    return {
      triggered: true,
      severity: 'med',
      scoreImpact: SCORING_CONFIG.RULE_IMPACTS.HIGH_SUGAR,
      title: 'High sugar content',
      message: `This product contains ${sugarValue.toFixed(1)}g of sugar per 100g, which is considered high.`,
      evidence: [
        {
          source: 'openfoodfacts',
          field,
          confidence: 90,
          ref: `sugar: ${sugarValue}g/100g`,
        },
      ],
    };
  }

  return {
    triggered: false,
    severity: 'low',
    scoreImpact: 0,
    title: '',
    message: '',
    evidence: [],
  };
}

/**
 * Check for high sodium/salt content
 */
export function ruleHighSodium(context: RuleContext): RuleResult {
  const nutrition = context.nutrition || {};

  let saltValue: number | null = null;
  let field = '';

  // Try salt first, then sodium
  if (nutrition.salt_100g !== null && nutrition.salt_100g !== undefined) {
    saltValue = nutrition.salt_100g;
    field = 'salt_100g';
  } else if (nutrition.sodium_100g !== null && nutrition.sodium_100g !== undefined) {
    // Convert sodium to salt (salt = sodium * 2.5)
    saltValue = nutrition.sodium_100g * 2.5;
    field = 'sodium_100g';
  }

  if (saltValue === null) {
    return {
      triggered: false,
      severity: 'low',
      scoreImpact: 0,
      title: '',
      message: '',
      evidence: [],
    };
  }

  if (saltValue >= SCORING_CONFIG.THRESHOLDS.SALT_HIGH) {
    return {
      triggered: true,
      severity: 'med',
      scoreImpact: SCORING_CONFIG.RULE_IMPACTS.HIGH_SODIUM,
      title: 'High salt content',
      message: `This product contains ${saltValue.toFixed(1)}g of salt per 100g, which is considered high.`,
      evidence: [
        {
          source: 'openfoodfacts',
          field,
          confidence: 90,
          ref: `salt: ${saltValue.toFixed(1)}g/100g`,
        },
      ],
    };
  }

  return {
    triggered: false,
    severity: 'low',
    scoreImpact: 0,
    title: '',
    message: '',
    evidence: [],
  };
}

/**
 * Check for high saturated fat
 */
export function ruleHighSaturatedFat(context: RuleContext): RuleResult {
  const nutrition = context.nutrition || {};
  const satFat = nutrition['saturated-fat_100g'] ?? nutrition.saturated_fat ?? null;

  if (satFat === null || satFat < SCORING_CONFIG.THRESHOLDS.SAT_FAT_HIGH) {
    return {
      triggered: false,
      severity: 'low',
      scoreImpact: 0,
      title: '',
      message: '',
      evidence: [],
    };
  }

  return {
    triggered: true,
    severity: 'med',
    scoreImpact: SCORING_CONFIG.RULE_IMPACTS.HIGH_SATURATED_FAT,
    title: 'High saturated fat',
    message: `This product contains ${satFat.toFixed(1)}g of saturated fat per 100g, which is considered high.`,
    evidence: [
      {
        source: 'openfoodfacts',
        field: 'saturated-fat_100g',
        confidence: 90,
        ref: `saturated fat: ${satFat.toFixed(1)}g/100g`,
      },
    ],
  };
}

/**
 * Check for additives (simplified - can be enhanced with curated ingredient facts)
 */
export function ruleAdditivesPresent(context: RuleContext): RuleResult {
  // Simple heuristic: check for E-numbers or common additive names
  const additivePatterns = [
    /\be\d{3,4}\b/gi, // E-numbers
    /artificial (color|flavor|sweetener|preservative)/gi,
    /sodium (benzoate|nitrite|sulfite)/gi,
    /bht|bha|tbhq/gi, // Common preservatives
  ];

  const ingredientsText = context.ingredients.join(' ').toLowerCase();
  const matches: string[] = [];

  additivePatterns.forEach((pattern) => {
    const found = ingredientsText.match(pattern);
    if (found) {
      matches.push(...found);
    }
  });

  if (matches.length === 0) {
    return {
      triggered: false,
      severity: 'low',
      scoreImpact: 0,
      title: '',
      message: '',
      evidence: [],
    };
  }

  const impact = Math.min(
    SCORING_CONFIG.RULE_IMPACTS.ADDITIVES_PRESENT * (1 + matches.length * 0.2),
    -20
  );

  return {
    triggered: true,
    severity: matches.length > 3 ? 'med' : 'low',
    scoreImpact: impact,
    title: 'Contains additives',
    message: `This product contains ${matches.length} additive${matches.length > 1 ? 's' : ''}. Some people prefer to limit processed additives.`,
    evidence: [
      {
        source: 'label',
        field: 'ingredients',
        confidence: 75,
        note: `Detected: ${matches.slice(0, 3).join(', ')}${matches.length > 3 ? '...' : ''}`,
      },
    ],
  };
}

/**
 * Check for profile conflicts (dietary preferences)
 */
export function ruleProfileConflicts(context: RuleContext): RuleResult {
  if (!context.profile || context.profile.dietPreferences.length === 0) {
    return {
      triggered: false,
      severity: 'low',
      scoreImpact: 0,
      title: '',
      message: '',
      evidence: [],
    };
  }

  const { dietPreferences, avoidList } = context.profile;
  const conflicts: string[] = [];

  // Simple checks (can be enhanced with ingredient facts)
  const ingredientsLower = context.ingredients.map((i) => i.toLowerCase());

  if (dietPreferences.includes('vegan')) {
    const nonVegan = ['milk', 'egg', 'cheese', 'butter', 'gelatin', 'honey'];
    if (nonVegan.some((item) => ingredientsLower.some((ing) => ing.includes(item)))) {
      conflicts.push('vegan');
    }
  }

  if (dietPreferences.includes('vegetarian')) {
    const nonVegetarian = ['gelatin', 'rennet', 'carmine'];
    if (nonVegetarian.some((item) => ingredientsLower.some((ing) => ing.includes(item)))) {
      conflicts.push('vegetarian');
    }
  }

  // Check avoid list
  avoidList.forEach((avoid) => {
    if (ingredientsLower.some((ing) => ing.includes(avoid.toLowerCase()))) {
      conflicts.push(`avoid: ${avoid}`);
    }
  });

  if (conflicts.length === 0) {
    return {
      triggered: false,
      severity: 'low',
      scoreImpact: 0,
      title: '',
      message: '',
      evidence: [],
    };
  }

  return {
    triggered: true,
    severity: 'high',
    scoreImpact: SCORING_CONFIG.RULE_IMPACTS.PROFILE_CONFLICTS,
    title: 'Conflicts with your preferences',
    message: `This product may not align with your dietary preferences: ${conflicts.join(', ')}.`,
    evidence: [
      {
        source: 'label',
        field: 'ingredients',
        confidence: 70,
        note: 'Based on ingredient analysis and your profile',
      },
    ],
  };
}

/**
 * Run all rules and return results
 */
export function evaluateRules(context: RuleContext): RuleResult[] {
  return [
    ruleAllergenMatch(context),
    ruleUltraProcessed(context),
    ruleHighSugar(context),
    ruleHighSodium(context),
    ruleHighSaturatedFat(context),
    ruleAdditivesPresent(context),
    ruleProfileConflicts(context),
  ].filter((result) => result.triggered);
}

