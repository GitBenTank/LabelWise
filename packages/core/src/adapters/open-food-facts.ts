import type { ProductDataSource } from './product-data-source';
import type { ExternalProduct } from '@labelwise/shared';

interface OFFProductResponse {
  status: number;
  product?: {
    code: string;
    product_name?: string;
    brands?: string;
    categories?: string;
    categories_tags?: string[];
    ingredients_text?: string;
    ingredients_tags?: string[];
    nutriments?: Record<string, number | null>;
    image_url?: string;
    url?: string;
  };
}

/**
 * Open Food Facts API client
 */
export class OpenFoodFactsClient implements ProductDataSource {
  private baseUrl: string;

  constructor(baseUrl = 'https://world.openfoodfacts.org/api/v0') {
    this.baseUrl = baseUrl;
  }

  async lookupByBarcode(barcode: string): Promise<ExternalProduct | null> {
    const url = `${this.baseUrl}/product/${barcode}.json`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'LabelWise/1.0 (https://labelwise.app)',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Open Food Facts API error: ${response.status}`);
      }

      const data = await response.json() as OFFProductResponse;

      if (data.status !== 1 || !data.product) {
        return null;
      }

      const product = data.product;

      // Extract nutrition values
      const nutrition: Record<string, number | null> = {};
      if (product.nutriments && typeof product.nutriments === 'object') {
        // Map common nutrition fields
        const nutritionFields = [
          'energy-kcal_100g',
          'proteins_100g',
          'carbohydrates_100g',
          'fat_100g',
          'sodium_100g',
          'sugars_100g',
          'fiber_100g',
        ];

        nutritionFields.forEach((field) => {
          const value = (product.nutriments as Record<string, unknown>)[field];
          if (value !== undefined) {
            const key = field.replace('_100g', '').replace('-', '_');
            nutrition[key] = typeof value === 'number' ? value : null;
          }
        });

        // Also include raw nutriments for flexibility
        Object.entries(product.nutriments).forEach(([key, value]) => {
          if (!nutritionFields.includes(key)) {
            nutrition[key] = typeof value === 'number' ? value : null;
          }
        });
      }

      // Normalize categories
      const categories = product.categories_tags
        ? product.categories_tags
            .map((tag) => tag.replace(/^en:/, '').replace(/-/g, ' '))
            .filter((cat) => cat.length > 0)
        : product.categories
        ? [product.categories]
        : [];

      return {
        barcode: product.code || barcode,
        name: product.product_name || 'Unknown Product',
        brand: product.brands || null,
        categories,
        ingredientsText: product.ingredients_text || null,
        ingredientsTags: product.ingredients_tags || [],
        nutrition,
        imageUrl: product.image_url || null,
        source: 'open-food-facts',
        sourceUrl: product.url || `https://world.openfoodfacts.org/product/${barcode}`,
        rawData: data,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch product from Open Food Facts: ${error.message}`);
      }
      throw error;
    }
  }
}

