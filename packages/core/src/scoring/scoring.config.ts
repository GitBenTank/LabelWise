/**
 * Scoring configuration: thresholds and weights
 * All scoring rules reference these values
 */

export const SCORING_CONFIG = {
  // Base score
  BASE_SCORE: 100,

  // Rule impacts (negative values reduce score)
  RULE_IMPACTS: {
    ALLERGEN_MATCH: -35,
    ULTRA_PROCESSED_NOVA_4: -20,
    HIGH_SUGAR: -15,
    HIGH_SODIUM: -10,
    HIGH_SATURATED_FAT: -8,
    ADDITIVES_PRESENT: -8, // Base, can scale with count
    PROFILE_CONFLICTS: -25,
  },

  // Nutrition thresholds (per 100g unless noted)
  THRESHOLDS: {
    // Sugar (g/100g or g/100ml for drinks)
    SUGAR_HIGH: 22.5,
    SUGAR_MEDIUM: 11.25,
    SUGAR_DRINK_HIGH: 11.25, // per 100ml

    // Sodium (g/100g) or Salt (g/100g)
    SALT_HIGH: 1.5, // 1.5g salt = ~0.6g sodium
    SODIUM_HIGH: 0.6,

    // Saturated fat (g/100g)
    SAT_FAT_HIGH: 5.0,

    // NOVA groups
    NOVA_4: 4, // Ultra-processed
  },

  // Verdict thresholds
  VERDICT: {
    GOOD: 80,
    MIXED: 50,
  },

  // Confidence thresholds for OCR/parsing
  CONFIDENCE: {
    HIGH: 80,
    MEDIUM: 50,
  },
} as const;

