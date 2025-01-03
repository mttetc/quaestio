import { relations } from 'drizzle-orm';
import { 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  boolean,
  integer,
  jsonb
} from 'drizzle-orm/pg-core';

export type QAMetadata = {
  date: Date;
  subject?: string;
  category?: string;
  context: string | null;
};

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  role: text('role', { enum: ['user', 'admin'] }).notNull().default('user'),
  availableTokens: integer('available_tokens').notNull().default(0),
  monthlyUsage: integer('monthly_usage').notNull().default(0),
  lastUsageReset: timestamp('last_usage_reset').notNull().defaultNow(),
  hasCompletedOnboarding: boolean('has_completed_onboarding').notNull().default(false),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  subscriptionTier: text('subscription_tier', { enum: ['FREE', 'PRO', 'ENTERPRISE'] }).notNull().default('FREE'),
  subscriptionStatus: text('subscription_status', { enum: ['ACTIVE', 'INACTIVE', 'CANCELED'] }).default('INACTIVE'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const tokenTransactions = pgTable('token_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  amount: integer('amount').notNull(),
  type: text('type').notNull(),
  description: text('description').notNull(),
  stripePaymentId: text('stripe_payment_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const qaEntries = pgTable('qa_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  emailId: text('email_id'),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  importance: text('importance').notNull().default('medium'),
  confidence: integer('confidence').notNull().default(100),
  tags: text('tags').array(),
  category: text('category'),
  metadata: jsonb('metadata').$type<QAMetadata>(),
  responseTimeHours: integer('response_time_hours'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const emailAccounts = pgTable('email_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  email: text('email').notNull(),
  encryptedAccessToken: text('encrypted_access_token').notNull(),
  encryptionIV: text('encryption_iv').notNull(),
  provider: text('provider').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const questionAnalytics = pgTable('question_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  questionHash: text('question_hash').notNull(),
  question: text('question').notNull(),
  category: text('category'),
  occurrences: integer('occurrences').notNull().default(1),
  firstSeen: timestamp('first_seen').notNull(),
  lastSeen: timestamp('last_seen').notNull(),
  averageConfidence: integer('average_confidence').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const integrations = pgTable('integrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  type: text('type', { enum: ['notion', 'trello', 'clickup'] }).notNull(),
  name: text('name').notNull(),
  config: jsonb('config').notNull(),
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripePriceId: text('stripe_price_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  status: text('status'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  qaEntries: many(qaEntries),
  emailAccounts: many(emailAccounts),
  tokenTransactions: many(tokenTransactions),
  questionAnalytics: many(questionAnalytics),
  integrations: many(integrations),
}));

export const qaEntriesRelations = relations(qaEntries, ({ one }) => ({
  user: one(users, {
    fields: [qaEntries.userId],
    references: [users.id],
  }),
}));

export const emailAccountsRelations = relations(emailAccounts, ({ one }) => ({
  user: one(users, {
    fields: [emailAccounts.userId],
    references: [users.id],
  }),
}));

export const tokenTransactionsRelations = relations(tokenTransactions, ({ one }) => ({
  user: one(users, {
    fields: [tokenTransactions.userId],
    references: [users.id],
  }),
}));

export const questionAnalyticsRelations = relations(questionAnalytics, ({ one }) => ({
  user: one(users, {
    fields: [questionAnalytics.userId],
    references: [users.id],
  }),
}));

export const integrationsRelations = relations(integrations, ({ one }) => ({
  user: one(users, {
    fields: [integrations.userId],
    references: [users.id],
  }),
}));