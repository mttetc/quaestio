import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, integer, jsonb, boolean } from "drizzle-orm/pg-core";

export type QAMetadata = {
    date: Date;
    subject?: string;
    category?: string;
    context: string | null;
};

// Profile table that extends Supabase auth.users with business data
export const profiles = pgTable("profiles", {
    id: uuid("id").primaryKey(), // references auth.users(id)
    availableTokens: integer("available_tokens").notNull().default(0),
    monthlyUsage: integer("monthly_usage").notNull().default(0),
    lastUsageReset: timestamp("last_usage_reset").notNull().defaultNow(),
    stripeCustomerId: text("stripe_customer_id"),
    subscriptionTier: text("subscription_tier", { enum: ["FREE", "PRO", "ENTERPRISE"] })
        .notNull()
        .default("FREE"),
    role: text("role", { enum: ["user", "admin"] })
        .notNull()
        .default("user"),
    hasCompletedOnboarding: boolean("has_completed_onboarding").notNull().default(false),
});

export const tokenTransactions = pgTable("token_transactions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => profiles.id),
    amount: integer("amount").notNull(),
    type: text("type").notNull(),
    description: text("description").notNull(),
    stripePaymentId: text("stripe_payment_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const qaEntries = pgTable("qa_entries", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => profiles.id),
    emailId: text("email_id"),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    importance: text("importance", { enum: ["low", "medium", "high"] })
        .notNull()
        .default("medium"),
    confidence: integer("confidence").notNull().default(100),
    tags: text("tags").array(),
    category: text("category"),
    metadata: jsonb("metadata").$type<QAMetadata>(),
    responseTimeHours: integer("response_time_hours"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const emailAccounts = pgTable("email_accounts", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => profiles.id),
    email: text("email").notNull(),
    encryptedAccessToken: text("encrypted_access_token").notNull(),
    encryptionIV: text("encryption_iv").notNull(),
    encryptionTag: text("encryption_tag").notNull(),
    provider: text("provider", { enum: ["gmail"] }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const emailSubscriptions = pgTable("email_subscriptions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => profiles.id),
    sender: text("sender").notNull(),
    domain: text("domain").notNull(),
    type: text("type", { enum: ["newsletter", "marketing", "transactional", "social", "other"] }).notNull(),
    frequency: text("frequency", { enum: ["daily", "weekly", "monthly", "irregular"] })
        .notNull()
        .default("irregular"),
    unsubscribeLink: text("unsubscribe_link"),
    unsubscribeEmail: text("unsubscribe_email"),
    status: text("status", { enum: ["active", "unsubscribed"] })
        .notNull()
        .default("active"),
    lastEmailAt: timestamp("last_email_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const questionAnalytics = pgTable("question_analytics", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => profiles.id),
    questionHash: text("question_hash").notNull(),
    question: text("question").notNull(),
    category: text("category"),
    occurrences: integer("occurrences").notNull().default(1),
    firstSeen: timestamp("first_seen").notNull(),
    lastSeen: timestamp("last_seen").notNull(),
    averageConfidence: integer("average_confidence").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const integrations = pgTable("integrations", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => profiles.id),
    type: text("type", { enum: ["notion", "trello", "clickup"] }).notNull(),
    name: text("name").notNull(),
    config: jsonb("config").notNull(),
    enabled: boolean("enabled").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    stripePriceId: text("stripe_price_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    status: text("status"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const profilesRelations = relations(profiles, ({ many }) => ({
    qaEntries: many(qaEntries),
    emailAccounts: many(emailAccounts),
    emailSubscriptions: many(emailSubscriptions),
    tokenTransactions: many(tokenTransactions),
    questionAnalytics: many(questionAnalytics),
    integrations: many(integrations),
}));

export const qaEntriesRelations = relations(qaEntries, ({ one }) => ({
    user: one(profiles, {
        fields: [qaEntries.userId],
        references: [profiles.id],
    }),
}));

export const emailAccountsRelations = relations(emailAccounts, ({ one }) => ({
    user: one(profiles, {
        fields: [emailAccounts.userId],
        references: [profiles.id],
    }),
}));

export const emailSubscriptionsRelations = relations(emailSubscriptions, ({ one }) => ({
    user: one(profiles, {
        fields: [emailSubscriptions.userId],
        references: [profiles.id],
    }),
}));

export const tokenTransactionsRelations = relations(tokenTransactions, ({ one }) => ({
    user: one(profiles, {
        fields: [tokenTransactions.userId],
        references: [profiles.id],
    }),
}));

export const questionAnalyticsRelations = relations(questionAnalytics, ({ one }) => ({
    user: one(profiles, {
        fields: [questionAnalytics.userId],
        references: [profiles.id],
    }),
}));

export const integrationsRelations = relations(integrations, ({ one }) => ({
    user: one(profiles, {
        fields: [integrations.userId],
        references: [profiles.id],
    }),
}));
