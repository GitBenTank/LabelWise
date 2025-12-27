import { NextRequest } from 'next/server';
import { analysisRequestSchema, labelWiseReportSchema } from '@labelwise/shared';
import { validateRequest } from '@/lib/api/validation';
import { handleApiError } from '@/lib/api/errors';
import {
  ProductService,
  OpenFoodFactsClient,
  ScoringService,
  ReportService,
  IngredientService,
} from '@labelwise/core';
import {
  DrizzleProductRepository,
  DrizzleIngredientRepository,
  db,
} from '@labelwise/db';
import { eq } from 'drizzle-orm';
import { productLabels } from '@labelwise/db/src/schema/product-labels';
import { profiles } from '@labelwise/db/src/schema/profiles';
import type { Product } from '@labelwise/shared';

/**
 * Resolve product data based on request
 */
async function resolveProductData(
  body: { barcode?: string; productId?: string; labelUploadId?: string },
  productService: ProductService,
  productRepo: DrizzleProductRepository
): Promise<{
  product: Product | null;
  externalProduct?: unknown;
  labelData?: {
    ingredients: string[];
    nutrition: Record<string, number | null>;
    allergenStatements: string[];
    mayContain: string[];
  };
}> {
  if (body.barcode) {
    const result = await productService.lookupByBarcode(body.barcode);
    return {
      product: result.product,
      externalProduct: result.externalData || undefined,
    };
  }

  if (body.productId) {
    const product = await productRepo.findById(body.productId);
    if (!product) {
      throw new Error(`Product ${body.productId} not found`);
    }
    const result = await productService.lookupByBarcode(product.barcode);
    return {
      product,
      externalProduct: result.externalData || undefined,
    };
  }

  if (body.labelUploadId) {
    const labelResult = await db
      .select()
      .from(productLabels)
      .where(eq(productLabels.id, body.labelUploadId))
      .limit(1);

    if (labelResult.length === 0) {
      throw new Error(`Label ${body.labelUploadId} not found`);
    }

    const label = labelResult[0];
    const labelData = {
      ingredients: label.ingredients,
      nutrition: label.nutrition,
      allergenStatements: label.allergenStatements,
      mayContain: label.mayContain,
      confidence: label.confidence as 'high' | 'medium' | 'low',
    };

    let product: Product | null = null;
    let externalProduct: unknown;

    if (label.productId) {
      product = await productRepo.findById(label.productId);
      if (product) {
        const result = await productService.lookupByBarcode(product.barcode);
        externalProduct = result.externalData || undefined;
      }
    }

    return { product, externalProduct, labelData };
  }

  throw new Error('Must provide barcode, productId, or labelUploadId');
}

/**
 * POST /api/analyses
 * Generate a LabelWise analysis for a product or label
 */
export async function POST(request: NextRequest) {
  try {
    const body = await validateRequest(request, analysisRequestSchema);

    // Initialize services
    const baseUrl = process.env.OPEN_FOOD_FACTS_BASE_URL || 'https://world.openfoodfacts.org/api/v0';
    const productDataSource = new OpenFoodFactsClient(baseUrl);
    const productRepo = new DrizzleProductRepository();
    const productService = new ProductService(productDataSource, productRepo);

    const ingredientRepo = new DrizzleIngredientRepository();
    const ingredientService = new IngredientService(ingredientRepo);

    const scoringService = new ScoringService();
    const reportService = new ReportService(scoringService, ingredientService);

    // Resolve product data
    let productData;
    try {
      productData = await resolveProductData(body, productService, productRepo);
    } catch (error) {
      if (error instanceof Error) {
        return Response.json(
          { error: 'Not found', message: error.message },
          { status: 404 }
        );
      }
      throw error;
    }

    if (!productData.product && !productData.labelData) {
      return Response.json(
        { error: 'No data found', message: 'Could not find product or label data' },
        { status: 404 }
      );
    }

    // Load profile if provided
    let profile;
    if (body.profileId) {
      const profileResult = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, body.profileId))
        .limit(1);

      if (profileResult.length > 0) {
        const p = profileResult[0];
        profile = {
          allergens: p.allergens,
          dietPreferences: p.dietPreferences,
          avoidList: p.avoidList,
        };
      }
    }

    // Generate report
    const report = await reportService.generateReport({
      product: productData.product || {
        id: 'temp',
        barcode: 'unknown',
        name: 'Unknown Product',
        brand: null,
        categories: [],
        source: 'label',
        sourceUrl: null,
        cachedAt: new Date(),
      },
      externalProduct: productData.externalProduct as {
        ingredientsText: string | null;
        ingredientsTags: string[];
        nutrition: Record<string, number | null>;
        rawData: unknown;
      } | undefined,
      labelData: productData.labelData,
      profile,
    });

    // Validate response
    const validatedReport = labelWiseReportSchema.parse(report);

    return Response.json(validatedReport);
  } catch (error) {
    return handleApiError(error);
  }
}
