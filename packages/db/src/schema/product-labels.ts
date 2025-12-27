import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';

export const productLabels = pgTable('product_labels', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, {
    onDelete: 'set null',
  }),
  rawText: text('raw_text').notNull(),
  ingredients: jsonb('ingredients').$type<string[]>().notNull(),
  nutrition: jsonb('nutrition').$type<Record<string, number | null>>().notNull(),
  allergenStatements: jsonb('allergen_statements')
    .$type<string[]>()
    .default([])
    .notNull(),
  mayContain: jsonb('may_contain').$type<string[]>().default([]).notNull(),
  photoUrl: text('photo_url'),
  confidence: text('confidence', { enum: ['high', 'medium', 'low'] })
    .default('medium')
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productLabelsRelations = relations(productLabels, ({ one }) => ({
  product: one(products, {
    fields: [productLabels.productId],
    references: [products.id],
  }),
}));

