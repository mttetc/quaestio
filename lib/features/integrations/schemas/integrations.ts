import { z } from "zod";
import { integrations } from "@/lib/core/db/schema";
import { createInsertSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";

export const integrationType = z.enum(["notion", "trello", "clickup"]);
export type IntegrationType = z.infer<typeof integrationType>;

export const integrationConfigSchema = z.object({
    apiKey: z.string(),
    workspaceId: z.string().optional(),
    boardId: z.string().optional(),
    databaseId: z.string().optional(),
    listId: z.string().optional(),
});

export type IntegrationConfig = z.infer<typeof integrationConfigSchema>;
export type Integration = InferSelectModel<typeof integrations>;

export const syncOptionsSchema = z.object({
    qaIds: z.array(z.string()),
    integration: z.custom<Integration>(),
});

export type SyncOptions = z.infer<typeof syncOptionsSchema>;
