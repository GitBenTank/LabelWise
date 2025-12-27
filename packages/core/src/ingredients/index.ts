/**
 * Ingredient knowledge base and normalization service
 */

import type { ExternalProduct } from '@labelwise/shared';
import { extractAndNormalizeIngredients } from './parser';
import type { IngredientRepository } from '../repositories/ingredient-repository';

/**
 * Ingredient normalization service
 */
export class IngredientService {
  constructor(private readonly repository: IngredientRepository) {}

  /**
   * Normalize ingredients from external product data
   * Prefers structured tags from OFF, falls back to parsing text
   */
  async normalizeIngredients(
    externalProduct: ExternalProduct
  ): Promise<{
    normalized: Array<{
      original: string;
      canonical: string | null;
      canonicalId: string | null;
    }>;
  }> {
    // Prefer structured tags from OFF if available
    let ingredientNames: string[] = [];

    if (externalProduct.ingredientsTags && externalProduct.ingredientsTags.length > 0) {
      // Use OFF tags, but normalize them
      ingredientNames = externalProduct.ingredientsTags.map((tag) =>
        tag.replace(/^en:/, '').replace(/-/g, ' ')
      );
    } else if (externalProduct.ingredientsText) {
      // Parse from text
      ingredientNames = extractAndNormalizeIngredients(externalProduct.ingredientsText);
    }

    // Map to canonical names
    const normalized = await Promise.all(
      ingredientNames.map(async (original) => {
        const canonicalId = await this.repository.findCanonicalByName(original);
        return {
          original,
          canonical: canonicalId ? original : null, // TODO: fetch canonical name by ID
          canonicalId,
        };
      })
    );

    return { normalized };
  }
}
