/**
 * Unit tests for scoring engine
 */

import { ScoringService, type ScoringContext } from './index';
import { SCORING_CONFIG } from './scoring.config';

describe('ScoringService', () => {
  const scoringService = new ScoringService();

  it('should clamp score to 0-100', () => {
    const context: ScoringContext = {
      ingredients: [],
      normalizedIngredients: [],
      allergens: [],
      allergenSource: 'label',
      nutrition: {
        sugars_100g: 50, // Very high sugar
        salt_100g: 3, // Very high salt
        'saturated-fat_100g': 10, // Very high sat fat
      },
    };

    const result = scoringService.computeScore(context);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('should map verdict correctly', () => {
    const goodContext: ScoringContext = {
      ingredients: ['water', 'salt'],
      normalizedIngredients: [],
      allergens: [],
      allergenSource: 'label',
      nutrition: {
        sugars_100g: 5,
        salt_100g: 0.5,
      },
    };

    const goodResult = scoringService.computeScore(goodContext);
    expect(['good', 'mixed', 'avoid']).toContain(goodResult.verdict);

    // Score should determine verdict
    if (goodResult.score >= SCORING_CONFIG.VERDICT.GOOD) {
      expect(goodResult.verdict).toBe('good');
    } else if (goodResult.score >= SCORING_CONFIG.VERDICT.MIXED) {
      expect(goodResult.verdict).toBe('mixed');
    } else {
      expect(goodResult.verdict).toBe('avoid');
    }
  });

  it('should detect high sugar', () => {
    const context: ScoringContext = {
      ingredients: ['sugar', 'water'],
      normalizedIngredients: [],
      allergens: [],
      allergenSource: 'label',
      nutrition: {
        sugars_100g: 25, // Above threshold
      },
    };

    const result = scoringService.computeScore(context);
    const highSugarRule = result.ruleResults.find((r) => r.title.includes('sugar'));
    expect(highSugarRule?.triggered).toBe(true);
  });

  it('should detect high sodium', () => {
    const context: ScoringContext = {
      ingredients: ['salt'],
      normalizedIngredients: [],
      allergens: [],
      allergenSource: 'label',
      nutrition: {
        salt_100g: 2.0, // Above threshold
      },
    };

    const result = scoringService.computeScore(context);
    const highSaltRule = result.ruleResults.find((r) => r.title.includes('salt'));
    expect(highSaltRule?.triggered).toBe(true);
  });
});

