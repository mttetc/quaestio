export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionOptions {
  messages: Message[];
  temperature?: number;
  responseFormat?: 'json' | 'text';
}

export interface LLMProvider {
  complete(options: CompletionOptions): Promise<any>;
} 