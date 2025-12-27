import type { Product } from '@labelwise/shared';

/**
 * Repository interface for product persistence
 * This keeps core services decoupled from database implementation
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

