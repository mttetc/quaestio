export type IntegrationType = 'notion' | 'trello' | 'clickup';

export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  config: IntegrationConfig;
  enabled: boolean;
}

export interface IntegrationConfig {
  apiKey: string;
  workspaceId?: string;
  boardId?: string;
  databaseId?: string;
  listId?: string;
}

export interface SyncOptions {
  qaIds: string[];
  integration: Integration;
}