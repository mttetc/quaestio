import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().email(),
    firstname: z.string(),
    lastname: z.string(),
    password: z.string().min(8),
});
