import { z } from 'zod';

export const createQASchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  importance: z.enum(['high', 'medium', 'low']).default('medium'),
  confidence: z.number().min(0).max(100).default(100),
  tags: z.array(z.string()).default([]),
  emailId: z.string().optional(),
  metadata: z.object({
    subject: z.string().optional(),
    date: z.date().default(() => new Date()),
    context: z.string().nullable().optional(),
  }).optional(),
});

export const updateQASchema = createQASchema.partial(); 