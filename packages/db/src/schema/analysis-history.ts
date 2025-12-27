import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';
import { productLabels } from './product-labels';
import { profiles } from './profiles';
import { users } from './users';

/**
 * Analysis history - stores user's saved analyses
 * Can be from barcode lookup, label upload, or product ID
 */
export const analysisHistory = pgTable('analysis_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  // Anonymous users can save to localStorage, authenticated users save to DB
  sessionId: text('session_id'), // For anonymous users
  
  // One of these will be set
  barcode: text('barcode'),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
  labelId: uuid('label_id').references(() => productLabels.id, { onDelete: 'set null' }),
  
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'set null' }),
  
  // Store the full report for quick retrieval
  report: jsonb('report').$type<{
    score: number;
    summary: { headline: string; verdict: 'good' | 'mixed' | 'avoid' };
    flags: Array<{
      code: string;
      title: string;
      severity: 'low' | 'med' | 'high';
      message: string;
      evidence: Array<{
        source: 'openfoodfacts' | 'label' | 'curated';
        ref?: string;
        field?: string;
        confidence: number;
        note?: string;
      }>;
    }>;
    ingredients: Array<{
      name: string;
      normalized: string;
      concerns: Array<{
        type: string;
        message: string;
        severity: 'low' | 'med' | 'high';
        evidence: Array<unknown>;
      }>;
      confidence: number;
    }>;
    allergens: Array<{ name: string; detectedFrom: 'label' | 'off' | 'both' }>;
    nutrition?: {
      per100g?: Record<string, number | null>;
      serving?: Record<string, number | null>;
      nutriScore?: string;
      novaGroup?: number;
    };
    sources: Array<{
      source: 'openfoodfacts' | 'label' | 'curated';
      ref?: string;
      field?: string;
      confidence: number;
      note?: string;
    }>;
    generatedAt: string;
  }>().notNull(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const analysisHistoryRelations = relations(analysisHistory, ({ one }) => ({
  user: one(users, {
    fields: [analysisHistory.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [analysisHistory.productId],
    references: [products.id],
  }),
  label: one(productLabels, {
    fields: [analysisHistory.labelId],
    references: [productLabels.id],
  }),
  profile: one(profiles, {
    fields: [analysisHistory.profileId],
    references: [profiles.id],
  }),
}));

