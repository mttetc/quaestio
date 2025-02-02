import { z } from "zod";

export const geoResponseSchema = z.object({
    country_code: z.string(),
    currency: z.string(),
});

export const exchangeRatesResponseSchema = z.object({
    rates: z.record(z.number()),
});

export type GeoResponse = z.infer<typeof geoResponseSchema>;
export type ExchangeRatesResponse = z.infer<typeof exchangeRatesResponseSchema>;
