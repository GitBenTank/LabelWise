import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  barcode: text('barcode').notNull().unique(),
  name: text('name').notNull(),
  brand: text('brand'),
  categories: jsonb('categories').$type<string[]>().default([]).notNull(),
  source: text('source').notNull(), // e.g., 'open-food-facts'
  sourceUrl: text('source_url'),
  sourceData: jsonb('source_data'), // Raw response from source
  cachedAt: timestamp('cached_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

