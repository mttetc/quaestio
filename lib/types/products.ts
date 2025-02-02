import { products, productPrices } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Product = InferSelectModel<typeof products>;
export type ProductPrice = InferSelectModel<typeof productPrices> & {
    unit_amount: number;
    currency: string;
};

export interface ProductWithPrice extends Product {
    price?: ProductPrice;
}
