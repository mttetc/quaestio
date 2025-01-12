import { z } from "zod";

export const stripePriceSchema = z.object({
    id: z.string(),
    product: z.string(),
    unit_amount: z.number(),
    currency: z.string(),
    recurring: z
        .object({
            interval: z.enum(["day", "week", "month", "year"]),
            interval_count: z.number(),
        })
        .nullable(),
});

export const stripeProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    active: z.boolean(),
    default_price: z.string().nullable(),
    prices: z.array(stripePriceSchema),
});

export type StripePrice = z.infer<typeof stripePriceSchema>;
export type StripeProduct = z.infer<typeof stripeProductSchema>;
