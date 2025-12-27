/**
 * Repository interface for ingredient persistence
 */
export interface IngredientRepository {
  /**
   * Find canonical ingredient ID by alias/name
   */
  findCanonicalByName(name: string): Promise<string | null>;

  /**
   * Get all aliases for an ingredient
   */
  getAliases(ingredientId: string): Promise<string[]>;
}

