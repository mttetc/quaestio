import * as z from 'zod';

export const emailSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .refine((email) => email.endsWith('@gmail.com'), {
      message: "Please enter a valid Gmail address"
    })
});

export type EmailSchema = z.infer<typeof emailSchema>;