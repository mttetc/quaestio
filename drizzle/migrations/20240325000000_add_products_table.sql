CREATE TABLE IF NOT EXISTS "products" (
    "id" text PRIMARY KEY NOT NULL,
    "stripe_id" text NOT NULL,
    "name" text NOT NULL,
    "tier" text NOT NULL,
    "tokens" integer NOT NULL,
    "monthly_quota" integer NOT NULL,
    "max_email_accounts" integer NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "products_stripe_id_unique" UNIQUE("stripe_id")
);

CREATE TABLE IF NOT EXISTS "product_prices" (
    "id" text PRIMARY KEY NOT NULL,
    "product_id" text NOT NULL,
    "stripe_price_id" text NOT NULL,
    "unit_amount" integer NOT NULL,
    "currency" text NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "product_prices_stripe_price_id_unique" UNIQUE("stripe_price_id"),
    CONSTRAINT "product_prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
);