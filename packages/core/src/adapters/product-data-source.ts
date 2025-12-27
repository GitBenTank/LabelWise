import type { ExternalProduct } from '@labelwise/shared';

/**
 * Interface for external product data sources
 */
export interface ProductDataSource {
  /**
   * Look up a product by barcode
   * @returns Product data or null if not found
   */
  lookupByBarcode(barcode: string): Promise<ExternalProduct | null>;
}

