import { db } from "@/lib/core/db";
import { productPrices, products } from "@/lib/core/db/schema";
import type { Product, ProductPrice } from "@/lib/types/products";
import { eq } from "drizzle-orm";
import { convertPrice } from "@/lib/utils/currency-conversion";
import { priceSchema } from "../schemas/products";

export interface ProductWithConvertedPrice extends Product {
    price?: ProductPrice;
}

export async function getActiveProducts(): Promise<ProductWithConvertedPrice[]> {
    const allProducts = await db.select().from(products).where(eq(products.active, true));
    const activePrices = await db.select().from(productPrices).where(eq(productPrices.active, true));

    const productsWithPrices = await Promise.all(
        allProducts.map(async (product) => {
            const price = activePrices.find((price) => price.product_id === product.id);
            if (!price) return { ...product, price: undefined };

            const validatedPrice = priceSchema.parse(price);
            const convertedPrice = await convertPrice(validatedPrice);

            return {
                ...product,
                price: convertedPrice,
            };
        })
    );

    return productsWithPrices;
}
