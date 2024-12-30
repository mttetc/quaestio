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

export type QA = z.infer<typeof qaSchema>;

export interface QAFilter {
  search?: string;
  tags?: string[];
  importance?: 'high' | 'medium' | 'low';
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export type CreateQAInput = Omit<QA, 'id'>;
export type UpdateQAInput = Partial<CreateQAInput> & { id: string };