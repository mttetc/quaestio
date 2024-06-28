import { z } from 'zod'

export const linkEmailFormSchema = z.object({
  email: z
    .string()
    .min(1)
    .email({ message: 'Invalid email format' })
    .refine((value) => value.endsWith('@gmail.com'), {
      message: 'Only Gmail emails are allowed',
    }),
})
