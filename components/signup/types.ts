import { z } from "zod";
import { loginFormSchema } from "./schemas";

export type TLoginForm = z.infer<typeof loginFormSchema>