import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventType: text('event_type').notNull(), // 'product_lookup', 'label_upload', 'analysis', etc.
  userId: uuid('user_id'),
  metadata: jsonb('metadata'), // Flexible JSON for event-specific data
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

