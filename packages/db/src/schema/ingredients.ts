import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const ingredients = pgTable('ingredients', {
  id: uuid('id').primaryKey().defaultRandom(),
  canonicalName: text('canonical_name').notNull().unique(),
  description: text('description'),
  category: text('category'), // preservative, emulsifier, etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

