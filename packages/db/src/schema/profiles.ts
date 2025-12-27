import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  allergens: jsonb('allergens').$type<string[]>().default([]).notNull(),
  dietPreferences: jsonb('diet_preferences')
    .$type<string[]>()
    .default([])
    .notNull(),
  avoidList: jsonb('avoid_list').$type<string[]>().default([]).notNull(),
  severity: text('severity', { enum: ['strict', 'moderate', 'info-only'] })
    .default('moderate')
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

