CREATE TABLE IF NOT EXISTS "integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"config" jsonb NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"question_hash" text NOT NULL,
	"question" text NOT NULL,
	"category" text,
	"occurrences" integer DEFAULT 1 NOT NULL,
	"first_seen" timestamp NOT NULL,
	"last_seen" timestamp NOT NULL,
	"average_confidence" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"stripe_customer_id" text,
	"stripe_price_id" text,
	"stripe_subscription_id" text,
	"status" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "qa_entries" ALTER COLUMN "email_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "qa_entries" ALTER COLUMN "confidence" SET DEFAULT 100;--> statement-breakpoint
ALTER TABLE "qa_entries" ALTER COLUMN "importance" SET DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "email_accounts" ADD COLUMN "encrypted_access_token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "email_accounts" ADD COLUMN "encryption_iv" text NOT NULL;--> statement-breakpoint
ALTER TABLE "email_accounts" ADD COLUMN "encryption_tag" text NOT NULL;--> statement-breakpoint
ALTER TABLE "qa_entries" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "qa_entries" ADD COLUMN "response_time_hours" integer;--> statement-breakpoint
ALTER TABLE "qa_entries" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_subscription_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_tier" text DEFAULT 'FREE' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_status" text DEFAULT 'INACTIVE';--> statement-breakpoint
ALTER TABLE "email_accounts" DROP COLUMN IF EXISTS "access_token";--> statement-breakpoint
ALTER TABLE "email_accounts" DROP COLUMN IF EXISTS "refresh_token";--> statement-breakpoint
ALTER TABLE "email_accounts" DROP COLUMN IF EXISTS "last_synced";--> statement-breakpoint
ALTER TABLE "qa_entries" DROP COLUMN IF EXISTS "context";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "integrations" ADD CONSTRAINT "integrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_analytics" ADD CONSTRAINT "question_analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
