import { eq } from 'drizzle-orm';
import { db } from '../client';
import { products } from '../schema/products';
import type { Product } from '@labelwise/shared';
import type { ProductRepository } from '@labelwise/core';

/**
 * Drizzle implementation of ProductRepository
 */
export class DrizzleProductRepository implements ProductRepository {
  async findByBarcode(barcode: string): Promise<Product | null> {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.barcode, barcode))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    return {
      id: row.id,
      barcode: row.barcode,
      name: row.name,
      brand: row.brand,
      categories: row.categories,
      source: row.source,
      sourceUrl: row.sourceUrl,
      cachedAt: row.cachedAt,
    };
  }

  async findById(id: string): Promise<Product | null> {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    return {
      id: row.id,
      barcode: row.barcode,
      name: row.name,
      brand: row.brand,
      categories: row.categories,
      source: row.source,
      sourceUrl: row.sourceUrl,
      cachedAt: row.cachedAt,
    };
  }

  async upsert(productData: {
    barcode: string;
    name: string;
    brand: string | null;
    categories: string[];
    source: string;
    sourceUrl: string | null;
    sourceData: unknown;
  }): Promise<Product> {
    const existing = await this.findByBarcode(productData.barcode);

    if (existing) {
      const [updated] = await db
        .update(products)
        .set({
          name: productData.name,
          brand: productData.brand,
          categories: productData.categories,
          source: productData.source,
          sourceUrl: productData.sourceUrl,
          sourceData: productData.sourceData as Record<string, unknown>,
          cachedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(products.barcode, productData.barcode))
        .returning();

      return {
        id: updated.id,
        barcode: updated.barcode,
        name: updated.name,
        brand: updated.brand,
        categories: updated.categories,
        source: updated.source,
        sourceUrl: updated.sourceUrl,
        cachedAt: updated.cachedAt,
      };
    }

    const [created] = await db
      .insert(products)
      .values({
        barcode: productData.barcode,
        name: productData.name,
        brand: productData.brand,
        categories: productData.categories,
        source: productData.source,
        sourceUrl: productData.sourceUrl,
        sourceData: productData.sourceData as Record<string, unknown>,
        cachedAt: new Date(),
      })
      .returning();

    return {
      id: created.id,
      barcode: created.barcode,
      name: created.name,
      brand: created.brand,
      categories: created.categories,
      source: created.source,
      sourceUrl: created.sourceUrl,
      cachedAt: created.cachedAt,
    };
  }
}

