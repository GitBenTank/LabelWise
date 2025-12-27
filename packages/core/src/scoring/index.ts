/**
 * LabelWise scoring engine with explainability
 */

import type { ReportVerdict, Evidence } from '@labelwise/shared';
import { SCORING_CONFIG } from './scoring.config';
import { evaluateRules, type RuleResult } from './rules';

export interface ScoringContext {
  productName?: string;
  categories?: string[];
  nutrition?: Record<string, number | null>;
  novaGroup?: number;
  nutriScore?: string;
  ingredients: string[];
  normalizedIngredients: Array<{
    original: string;
    canonicalId: string | null;
  }>;
  allergens: string[];
  allergenSource: 'label' | 'off' | 'both';
  profile?: {
    allergens: string[];
    dietPreferences: string[];
    avoidList: string[];
  };
}

/**
 * Generate headline based on score and verdict
 */
function generateHeadline(_score: number, verdict: ReportVerdict): string {
  if (verdict === 'good') {
    return 'Mostly fine, with a few things to be aware of';
  } else if (verdict === 'mixed') {
    return 'Some concerns, but generally okay';
  } else {
    return 'Several things to consider before choosing this product';
  }
}

/**
 * Compute LabelWise score and generate report
 */
export class ScoringService {
  computeScore(context: ScoringContext): {
    score: number;
    verdict: ReportVerdict;
    headline: string;
    ruleResults: RuleResult[];
    allEvidence: Evidence[];
  } {
    // Evaluate all rules
    const ruleResults = evaluateRules(context);

    // Calculate score
    let score = SCORING_CONFIG.BASE_SCORE;
    ruleResults.forEach((result) => {
      score += result.scoreImpact;
    });

    // Clamp to 0-100
    const finalScore = Math.max(0, Math.min(100, score)) as number;

    // Determine verdict
    let verdict: ReportVerdict;
    if (score >= SCORING_CONFIG.VERDICT.GOOD) {
      verdict = 'good';
    } else if (score >= SCORING_CONFIG.VERDICT.MIXED) {
      verdict = 'mixed';
    } else {
      verdict = 'avoid';
    }

    // Generate headline
    const headline = generateHeadline(score, verdict);

    // Collect all evidence
    const allEvidence: Evidence[] = [];
    ruleResults.forEach((result) => {
      allEvidence.push(...result.evidence);
    });

    return {
      score: finalScore,
      verdict,
      headline,
      ruleResults,
      allEvidence,
    };
  }
}
