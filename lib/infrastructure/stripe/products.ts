import { stripe } from "./client";
import { SUBSCRIPTION_TIERS } from "@/lib/config/pricing";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/core/db";
import { products } from "@/lib/core/db/schema";

interface ProductMetadata {
    [key: string]: string;
    tier: string;
    tokens: string;
    monthlyQuota: string;
    maxEmailAccounts: string;
}

interface PriceMetadata {
    [key: string]: string;
    tierId: string;
}

export async function syncProducts() {
    for (const [tierId, tier] of Object.entries(SUBSCRIPTION_TIERS)) {
        if (tier.price === 0) continue; // Skip free tier

        // Create or update product
        const productMetadata: ProductMetadata = {
            tier: tierId,
            tokens: tier.tokens.toString(),
            monthlyQuota: tier.monthlyQuota.toString(),
            maxEmailAccounts: tier.maxEmailAccounts.toString(),
        };

        const product = await createOrUpdateProduct(tier.name, productMetadata);

        // Create or update price
        const priceMetadata: PriceMetadata = {
            tierId,
        };

        await createOrUpdatePrice(product.id, tier.price, priceMetadata);
    }
}

async function createOrUpdateProduct(name: string, metadata: ProductMetadata) {
    // Search in local database first
    const existingProducts = await db
        .select()
        .from(products)
        .where(and(eq(products.tier, metadata.tier), eq(products.active, true)));

    const existingProduct = existingProducts[0];

    if (existingProduct) {
        return await stripe.products.update(existingProduct.stripe_id, {
            name,
            metadata,
        });
    }

    // If not found in local DB, search in Stripe as fallback
    const stripeProducts = await stripe.products.search({
        query: `active:'true' AND metadata['tier']:'${metadata.tier}'`,
    });

    if (stripeProducts.data.length > 0) {
        const product = stripeProducts.data[0];
        return await stripe.products.update(product.id, {
            name,
            metadata,
        });
    }

    return await stripe.products.create({
        name,
        metadata,
    });
}

async function createOrUpdatePrice(productId: string, unitAmount: number, metadata: PriceMetadata) {
    const existingPrices = await stripe.prices.list({
        product: productId,
        active: true,
    });

    // If price with same amount exists, skip creation
    const existingPrice = existingPrices.data.find((price) => price.unit_amount === unitAmount * 100);

    if (existingPrice) return existingPrice;

    // Deactivate old prices
    for (const price of existingPrices.data) {
        await stripe.prices.update(price.id, { active: false });
    }

    // Create new price
    return await stripe.prices.create({
        product: productId,
        unit_amount: unitAmount * 100,
        currency: "usd",
        metadata,
    });
}
