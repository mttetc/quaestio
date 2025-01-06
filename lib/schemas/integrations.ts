import { z } from 'zod';

export const integrationType = z.enum(['notion', 'trello', 'clickup']);

export const integrationConfigSchema = z.object({
  apiKey: z.string(),
  workspaceId: z.string().optional(),
  boardId: z.string().optional(),
  databaseId: z.string().optional(),
  listId: z.string().optional(),
});

export const integrationSchema = z.object({
  id: z.string(),
  type: integrationType,
  name: z.string(),
  config: integrationConfigSchema,
  enabled: z.boolean(),
});

export type IntegrationType = z.infer<typeof integrationType>;
export type IntegrationConfig = z.infer<typeof integrationConfigSchema>;
export type Integration = z.infer<typeof integrationSchema>;

export interface SyncOptions {
  qaIds: string[];
  integration: Integration;
} 