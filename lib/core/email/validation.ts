import * as z from 'zod';

export const emailConnectionSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .refine(email => email.endsWith('@gmail.com'), {
      message: "Only Gmail accounts are supported"
    }),
  appPassword: z.string()
    .min(16, "App Password must be at least 16 characters")
    .max(32, "App Password must be at most 32 characters")
});