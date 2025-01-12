import { type CompletionOptions, type LLMProvider } from "@/lib/features/ai/schemas/llm";
import { chatModel } from "./config";

export const ai: LLMProvider = {
    async complete(options: CompletionOptions): Promise<string> {
        const response = await chatModel.invoke(
            options.messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }))
        );

        if (options.responseFormat === "json") {
            return JSON.parse(response.content.toString());
        }

        return response.content.toString();
    },
};
