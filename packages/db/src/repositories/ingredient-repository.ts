import { eq, ilike } from 'drizzle-orm';
import { db } from '../client';
import { ingredients } from '../schema/ingredients';
import { ingredientAliases } from '../schema/ingredient-aliases';
import type { IngredientRepository } from '@labelwise/shared';

/**
 * Drizzle implementation of IngredientRepository
 */
export class DrizzleIngredientRepository implements IngredientRepository {
  async findCanonicalByName(name: string): Promise<string | null> {
    const normalized = name.toLowerCase().trim();

    // First check if it's a canonical name
    const canonical = await db
      .select()
      .from(ingredients)
      .where(ilike(ingredients.canonicalName, normalized))
      .limit(1);

    if (canonical.length > 0) {
      return canonical[0].id;
    }

    // Check aliases
    const alias = await db
      .select()
      .from(ingredientAliases)
      .where(ilike(ingredientAliases.alias, normalized))
      .limit(1);

    if (alias.length > 0) {
      return alias[0].ingredientId;
    }

    return null;
  }

  async getAliases(ingredientId: string): Promise<string[]> {
    const result = await db
      .select({ alias: ingredientAliases.alias })
      .from(ingredientAliases)
      .where(eq(ingredientAliases.ingredientId, ingredientId));

    return result.map((row) => row.alias);
  }
}

