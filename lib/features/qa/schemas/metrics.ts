import { z } from "zod";

export const qaMetricsSchema = z.object({
    responseTime: z.object({
        average: z.number(),
        minimum: z.number(),
        maximum: z.number(),
    }),
    volumeByTag: z.array(
        z.object({
            tag: z.string(),
            count: z.number(),
        })
    ),
});

export type QAMetrics = z.infer<typeof qaMetricsSchema>;
