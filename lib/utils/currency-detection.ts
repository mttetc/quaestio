"use server";

import { geoResponseSchema, type GeoResponse } from "@/lib/types/currency";

let cachedCurrency: string | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function detectUserCurrency(): Promise<string> {
    // Return cached currency if it's still valid
    if (cachedCurrency && Date.now() - lastFetchTime < CACHE_DURATION) {
        return cachedCurrency;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch("https://ipapi.co/json/", {
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
        const result = geoResponseSchema.safeParse(rawData);

        if (!result.success) {
            throw new Error(`Invalid API response: ${result.error.message}`);
        }

        // Update cache
        cachedCurrency = result.data.currency || "USD";
        lastFetchTime = Date.now();

        return cachedCurrency;
    } catch (error) {
        console.error("Error detecting user currency:", error instanceof Error ? error.message : String(error));

        // Return cached currency if available, otherwise default to USD
        return cachedCurrency || "USD";
    }
}
