import { z } from "zod";

export const messageSchema = z.object({
    role: z.enum(["system", "user", "assistant"]),
    content: z.string(),
});

export const completionOptionsSchema = z.object({
    messages: z.array(messageSchema),
    temperature: z.number().min(0).max(2).optional(),
    responseFormat: z.enum(["json", "text"]).optional(),
});

export type Message = z.infer<typeof messageSchema>;
export type CompletionOptions = z.infer<typeof completionOptionsSchema>;

export const llmResponseSchema = z.string();
export type LLMResponse = z.infer<typeof llmResponseSchema>;

export interface LLMProvider {
    complete(options: CompletionOptions): Promise<LLMResponse>;
}
