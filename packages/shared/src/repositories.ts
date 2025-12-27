import type { Product } from './types';

/**
 * Repository interfaces for data persistence
 * These live in shared to avoid circular dependencies:
 * - core depends on shared (uses interfaces)
 * - db depends on shared (implements interfaces)
 * - db does NOT depend on core
 */

/**
 * Repository interface for product persistence
 */
export interface ProductRepository {
  /**
   * Find a product by barcode
   */
  findByBarcode(barcode: string): Promise<Product | null>;

  /**
   * Find a product by ID
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Create or update a product
   */
  upsert(product: {
    barcode: string;
    name: string;
    brand: string | null;
    categories: string[];
    source: string;
    sourceUrl: string | null;
    sourceData: unknown;
  }): Promise<Product>;
}

/**
 * Repository interface for label persistence
 */
export interface LabelRepository {
  /**
   * Create a label record
   */
  create(label: {
    productId: string | null;
    rawText: string;
    ingredients: string[];
    nutrition: Record<string, number | null>;
    allergenStatements: string[];
    mayContain: string[];
    photoUrl: string | null;
    confidence: 'high' | 'medium' | 'low';
  }): Promise<{ id: string; confidence: 'high' | 'medium' | 'low' }>;
}

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

/**
 * Repository interface for analysis persistence
 */
export interface AnalysisRepository {
  /**
   * Create an analysis record
   */
  create(analysis: {
    labelId: string;
    profileId: string | null;
    score: number;
    summary: string;
    flags: unknown;
    reasons: unknown;
    confidence: 'high' | 'medium' | 'low';
    reportData: unknown; // Full report JSON
  }): Promise<{ id: string }>;
}

