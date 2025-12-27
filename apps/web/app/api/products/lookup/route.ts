import { NextRequest } from 'next/server';
import { barcodeLookupRequestSchema, productResponseSchema } from '@labelwise/shared';
import { validateQuery } from '@/lib/api/validation';
import { handleApiError } from '@/lib/api/errors';
import { ProductService, OpenFoodFactsClient } from '@labelwise/core';
import { DrizzleProductRepository } from '@labelwise/db';

/**
 * GET /api/products/lookup?barcode=...
 * Look up a product by barcode
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { barcode } = validateQuery(searchParams, barcodeLookupRequestSchema);

    // Initialize services
    const baseUrl = process.env.OPEN_FOOD_FACTS_BASE_URL || 'https://world.openfoodfacts.org/api/v0';
    const dataSource = new OpenFoodFactsClient(baseUrl);
    const repository = new DrizzleProductRepository();
    const productService = new ProductService(dataSource, repository);

    // Look up product
    const result = await productService.lookupByBarcode(barcode);

    // Return response
    return Response.json(
      productResponseSchema.parse({
        id: result.product.id,
        barcode: result.product.barcode,
        name: result.product.name,
        brand: result.product.brand,
        categories: result.product.categories,
        source: result.product.source,
        sourceUrl: result.product.sourceUrl,
        cachedAt: result.product.cachedAt.toISOString(),
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
