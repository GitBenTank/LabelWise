import type { ExternalProduct, Product } from '@labelwise/shared';
import type { ProductDataSource } from '../adapters/product-data-source';
import type { ProductRepository } from '@labelwise/shared';

/**
 * Product lookup and caching service
 */
export class ProductService {
  constructor(
    private readonly dataSource: ProductDataSource,
    private readonly repository: ProductRepository
  ) {}

  /**
   * Look up a product by barcode
   * Checks cache first, then fetches from external source if needed
   */
  async lookupByBarcode(barcode: string): Promise<{
    product: Product;
    externalData: ExternalProduct | null;
    fromCache: boolean;
  }> {
    // Check cache first
    const cached = await this.repository.findByBarcode(barcode);
    
    // If cached and recent (within 7 days), return cached
    if (cached) {
      const cacheAge = Date.now() - cached.cachedAt.getTime();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      
      if (cacheAge < sevenDays) {
        return {
          product: cached,
          externalData: null,
          fromCache: true,
        };
      }
    }

    // Fetch from external source
    const externalData = await this.dataSource.lookupByBarcode(barcode);
    
    if (!externalData) {
      if (cached) {
        // Return stale cache if external lookup fails
        return {
          product: cached,
          externalData: null,
          fromCache: true,
        };
      }
      throw new Error(`Product not found for barcode: ${barcode}`);
    }

    // Upsert to cache
    const product = await this.repository.upsert({
      barcode: externalData.barcode,
      name: externalData.name,
      brand: externalData.brand,
      categories: externalData.categories,
      source: externalData.source,
      sourceUrl: externalData.sourceUrl,
      sourceData: externalData.rawData,
    });

    return {
      product,
      externalData,
      fromCache: false,
    };
  }
}
