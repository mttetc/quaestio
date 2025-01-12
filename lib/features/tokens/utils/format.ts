import { z } from "zod";

const tokenAmountSchema = z.number().min(0, "Token amount must be non-negative");
const COST_PER_TOKEN = 0.001;

export function formatTokenAmount(amount: number): string {
    const result = tokenAmountSchema.safeParse(amount);
    if (!result.success) {
        return "0";
    }

    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}k`;
    }
    return amount.toString();
}

export function calculateTokenCost(tokens: number): number {
    const result = tokenAmountSchema.safeParse(tokens);
    if (!result.success) {
        return 0;
    }

    return tokens * COST_PER_TOKEN;
}
