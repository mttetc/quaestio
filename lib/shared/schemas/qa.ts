import { z } from 'zod';

export const qaSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  importance: z.enum(['high', 'medium', 'low']),
  confidence: z.number(),
  tags: z.array(z.string()),
  emailId: z.string().optional(),
  metadata: z.object({
    date: z.date(),
    subject: z.string().optional(),
    category: z.string().optional(),
    context: z.string().nullable(),
  }).optional(),
});

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

export type QA = z.infer<typeof qaSchema>;
export type CreateQAInput = Omit<QA, 'id'>;
export type UpdateQAInput = Partial<CreateQAInput> & { id: string };

export interface QAFilter {
  search?: string;
  tags?: string[];
  importance?: 'high' | 'medium' | 'low';
  dateRange?: {
    from: Date;
    to: Date;
  };
} 