import { db } from '../client';
import { productLabels } from '../schema/product-labels';
import type { LabelRepository } from '@labelwise/shared';

/**
 * Drizzle implementation of LabelRepository
 */
export class DrizzleLabelRepository implements LabelRepository {
  async create(label: {
    productId: string | null;
    rawText: string;
    ingredients: string[];
    nutrition: Record<string, number | null>;
    allergenStatements: string[];
    mayContain: string[];
    photoUrl: string | null;
    confidence: 'high' | 'medium' | 'low';
  }): Promise<{ id: string; confidence: 'high' | 'medium' | 'low' }> {
    const [created] = await db
      .insert(productLabels)
      .values({
        productId: label.productId,
        rawText: label.rawText,
        ingredients: label.ingredients,
        nutrition: label.nutrition,
        allergenStatements: label.allergenStatements,
        mayContain: label.mayContain,
        photoUrl: label.photoUrl,
        confidence: label.confidence,
      })
      .returning({ id: productLabels.id, confidence: productLabels.confidence });

    return { id: created.id, confidence: created.confidence as 'high' | 'medium' | 'low' };
  }
}

