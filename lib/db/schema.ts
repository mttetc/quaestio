import { 
  pgTable, 
  text, 
  timestamp, 
  uuid,
  integer,
  boolean,
  jsonb
} from 'drizzle-orm/pg-core';

export type QAMetadata = {
  subject: string;
  date: Date;
  context: string | null;
};

interface IntegrationConfig {
  apiKey: string;
  databaseId?: string;
  token?: string;
  boardId?: string;
  listId?: string;
}

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('free'),
  availableTokens: integer('available_tokens').notNull().default(0),
  monthlyUsage: integer('monthly_usage').notNull().default(0),
  lastUsageReset: timestamp('last_usage_reset').notNull().defaultNow(),
  hasCompletedOnboarding: boolean('has_completed_onboarding').notNull().default(false),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const emailAccounts = pgTable('email_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  email: text('email').notNull(),
  provider: text('provider').notNull(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  lastSynced: timestamp('last_synced'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export type QAEntry = typeof qaEntries.$inferSelect;

export const qaEntries = pgTable('qa_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  emailId: text('email_id').notNull(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  context: text('context').$type<string | undefined>(),
  confidence: integer('confidence').notNull(),
  importance: text('importance').$type<'high' | 'medium' | 'low'>().notNull(),
  tags: text('tags').array().notNull().default([]),
  metadata: jsonb('metadata').$type<QAMetadata>().notNull(),
  responseTimeHours: integer('response_time_hours'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const tokenTransactions = pgTable('token_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  amount: integer('amount').notNull(),
  type: text('type').notNull(),
  description: text('description').notNull(),
  stripePaymentId: text('stripe_payment_id'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const integrations = pgTable('integrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  type: text('type').notNull(),
  enabled: boolean('enabled').notNull().default(true),
  config: jsonb('config').$type<IntegrationConfig>().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const qa = pgTable("qa", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id").notNull()
});