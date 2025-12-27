import { pgTable, text, timestamp, uuid, jsonb, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { productLabels } from './product-labels';
import { profiles } from './profiles';

export const analyses = pgTable('analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  labelId: uuid('label_id')
    .notNull()
    .references(() => productLabels.id, { onDelete: 'cascade' }),
  profileId: uuid('profile_id').references(() => profiles.id, {
    onDelete: 'set null',
  }),
  score: integer('score').notNull(), // 0-100
  summary: text('summary').notNull(),
  flags: jsonb('flags').$type<
    Array<{
      type: 'allergen' | 'diet' | 'additive' | 'nutrition';
      severity: 'warning' | 'info' | 'caution';
      message: string;
      reason: string;
      ingredientId?: string;
      nutritionField?: string;
    }>
  >().default([]).notNull(),
  reasons: jsonb('reasons').$type<
    Array<{
      type: string;
      description: string;
      impact: number;
      confidence: 'high' | 'medium' | 'low';
    }>
  >().default([]).notNull(),
  confidence: text('confidence', { enum: ['high', 'medium', 'low'] })
    .default('medium')
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const analysesRelations = relations(analyses, ({ one }) => ({
  label: one(productLabels, {
    fields: [analyses.labelId],
    references: [productLabels.id],
  }),
  profile: one(profiles, {
    fields: [analyses.profileId],
    references: [profiles.id],
  }),
}));

