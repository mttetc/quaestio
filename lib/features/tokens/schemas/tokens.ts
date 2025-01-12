import { z } from "zod";
import { tokenTransactions } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type TokenTransaction = InferSelectModel<typeof tokenTransactions>;

export const tokenBalanceSchema = z.object({
    available: z.number().int().min(0),
    used: z.number().int().min(0),
    total: z.number().int().min(0),
});

export type TokenBalance = z.infer<typeof tokenBalanceSchema>;
