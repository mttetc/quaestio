import { z } from 'zod';

export const qaMetadataSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  date: z.date(),
  context: z.string().nullable()
});

const baseQASchema = z.object({
  emailId: z.string(),
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  tags: z.array(z.string()),
  importance: z.enum(['high', 'medium', 'low']),
  confidence: z.number().min(0).max(100),
  metadata: qaMetadataSchema
});

export const createQASchema = baseQASchema;
export const updateQASchema = baseQASchema.partial();

export type CreateQASchema = z.infer<typeof createQASchema>;
export type UpdateQASchema = z.infer<typeof updateQASchema>; 