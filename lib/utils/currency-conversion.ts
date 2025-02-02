"use server";

import { readUser } from "@/lib/features/auth/queries/read-user";
import type { ProductPrice } from "@/lib/types/products";
import { exchangeRatesResponseSchema } from "@/lib/types/currency";

interface ExchangeRates {
    [key: string]: number;
}

let cachedRates: ExchangeRates | null = null;
let lastRatesFetch = 0;
const RATES_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

async function fetchExchangeRates(): Promise<ExchangeRates> {
    // Return cached rates if still valid
    if (cachedRates && Date.now() - lastRatesFetch < RATES_CACHE_DURATION) {
        return cachedRates;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
            signal: controller.signal,
            headers: {
                Accept: "application/json",
                "User-Agent": "Quaestio/1.0",
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();
        const result = exchangeRatesResponseSchema.safeParse(rawData);

        if (!result.success) {
            throw new Error(`Invalid API response: ${result.error.message}`);
        }

        // Update cache
        cachedRates = result.data.rates;
        lastRatesFetch = Date.now();

        return cachedRates;
    } catch (error) {
        if (cachedRates) {
            console.warn(
                "Using cached exchange rates due to fetch error:",
                error instanceof Error ? error.message : String(error)
            );
            return cachedRates;
        }
        throw error;
    }
}

export async function convertPrice(price: ProductPrice): Promise<ProductPrice> {
    const user = await readUser();
    const userCurrency = user.currency || "USD"; // Default to USD if no currency preference is set

    if (userCurrency === "USD") {
        return price;
    }

    try {
        const rates = await fetchExchangeRates();
        const exchangeRate = rates[userCurrency];

        if (!exchangeRate) {
            console.error(`Exchange rate not found for currency: ${userCurrency}`);
            return price;
        }

        return {
            ...price,
            unit_amount: Math.round(price.unit_amount * exchangeRate),
            currency: userCurrency,
        };
    } catch (error) {
        console.error("Error converting currency:", error instanceof Error ? error.message : String(error));
        return price;
    }
}
