/**
 * Unit tests for ingredient parsing
 * Run with: npm test packages/core/src/ingredients/parser.test.ts
 */

import { parseIngredientsList, normalizeIngredientName, extractAndNormalizeIngredients } from './parser';

describe('parseIngredientsList', () => {
  it('should parse simple comma-separated list', () => {
    const result = parseIngredientsList('water, sugar, salt');
    expect(result).toEqual(['water', 'sugar', 'salt']);
  });

  it('should handle parentheses', () => {
    const result = parseIngredientsList('water, sugar (cane), salt');
    expect(result).toEqual(['water', 'sugar (cane)', 'salt']);
  });

  it('should handle nested parentheses', () => {
    const result = parseIngredientsList('flour, baking powder (sodium bicarbonate, cream of tartar)');
    expect(result).toEqual(['flour', 'baking powder (sodium bicarbonate, cream of tartar)']);
  });

  it('should remove "Ingredients:" prefix', () => {
    const result = parseIngredientsList('Ingredients: water, sugar');
    expect(result).toEqual(['water', 'sugar']);
  });

  it('should handle empty string', () => {
    const result = parseIngredientsList('');
    expect(result).toEqual([]);
  });
});

describe('normalizeIngredientName', () => {
  it('should lowercase and trim', () => {
    expect(normalizeIngredientName('  SUGAR  ')).toBe('sugar');
  });

  it('should collapse whitespace', () => {
    expect(normalizeIngredientName('high  fructose   corn   syrup')).toBe('high fructose corn syrup');
  });

  it('should remove trailing punctuation', () => {
    expect(normalizeIngredientName('salt.')).toBe('salt');
    expect(normalizeIngredientName('sugar,')).toBe('sugar');
  });
});

describe('extractAndNormalizeIngredients', () => {
  it('should parse and normalize', () => {
    const result = extractAndNormalizeIngredients('Water, SUGAR, Salt.');
    expect(result).toEqual(['water', 'sugar', 'salt']);
  });
});

