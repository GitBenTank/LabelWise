/**
 * Ingredient text parsing and normalization
 */

/**
 * Parse an ingredients list string into individual ingredients
 * Handles commas, parentheses, and common separators
 */
export function parseIngredientsList(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Remove common prefixes like "Ingredients:" or "INGREDIENTS:"
  let cleaned = text
    .replace(/^(ingredients?|contains?):\s*/i, '')
    .trim();

  // Split by commas, but be careful with parentheses
  const ingredients: string[] = [];
  let current = '';
  let depth = 0;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (char === '(' || char === '[' || char === '{') {
      depth++;
      current += char;
    } else if (char === ')' || char === ']' || char === '}') {
      depth--;
      current += char;
    } else if (char === ',' && depth === 0) {
      // Only split on commas at top level
      const trimmed = current.trim();
      if (trimmed.length > 0) {
        ingredients.push(trimmed);
      }
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last ingredient
  const trimmed = current.trim();
  if (trimmed.length > 0) {
    ingredients.push(trimmed);
  }

  return ingredients;
}

/**
 * Normalize an ingredient name for matching
 * - Lowercase
 * - Remove extra whitespace
 * - Normalize punctuation
 */
export function normalizeIngredientName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/[.,;:!?]+$/, '') // Remove trailing punctuation
    .trim();
}

/**
 * Extract ingredients from text, normalizing each one
 */
export function extractAndNormalizeIngredients(text: string): string[] {
  const parsed = parseIngredientsList(text);
  return parsed.map(normalizeIngredientName).filter((ing) => ing.length > 0);
}

