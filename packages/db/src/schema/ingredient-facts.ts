import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { ingredients } from './ingredients';

export const ingredientFacts = pgTable('ingredient_facts', {
  id: uuid('id').primaryKey().defaultRandom(),
  ingredientId: uuid('ingredient_id')
    .notNull()
    .references(() => ingredients.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  category: text('category').notNull(),
  dietaryFlags: jsonb('dietary_flags').$type<{
    vegan?: boolean;
    vegetarian?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
  }>(),
  sensitivityNotes: text('sensitivity_notes'),
  sources: jsonb('sources').$type<
    Array<{
      url: string;
      title: string;
      confidence: 'high' | 'medium' | 'low';
    }>
  >().default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const ingredientFactsRelations = relations(
  ingredientFacts,
  ({ one }) => ({
    ingredient: one(ingredients, {
      fields: [ingredientFacts.ingredientId],
      references: [ingredients.id],
    }),
  })
);

