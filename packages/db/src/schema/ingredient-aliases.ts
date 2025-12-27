import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { ingredients } from './ingredients';

export const ingredientAliases = pgTable('ingredient_aliases', {
  id: uuid('id').primaryKey().defaultRandom(),
  ingredientId: uuid('ingredient_id')
    .notNull()
    .references(() => ingredients.id, { onDelete: 'cascade' }),
  alias: text('alias').notNull().unique(),
});

export const ingredientAliasesRelations = relations(
  ingredientAliases,
  ({ one }) => ({
    ingredient: one(ingredients, {
      fields: [ingredientAliases.ingredientId],
      references: [ingredients.id],
    }),
  })
);

