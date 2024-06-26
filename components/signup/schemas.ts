import { z } from 'zod'

export const signUpFormSchema = z.object({
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string().min(8),
})
