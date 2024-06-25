"use server"

import { supabaseServerClient } from "@/utils/supabase/server";
import { AuthError } from "@supabase/supabase-js";
import { revalidatePath } from 'next/cache';
import { redirect } from "next/navigation";
import { loginFormSchema } from "./schemas";

export type State ={ status:  "INIT" } | {status: "FORM_ERROR", errors?: Record<string, string[]>} | {status: "AUTH_ERROR", error: AuthError}

export async function login(_state: State, formData: FormData) {


  const formDataObj = Object.fromEntries(Array.from(formData.entries()));
 
  const validationResult = loginFormSchema.safeParse(formDataObj)

  if (!validationResult.success) {
    return {status:"FORM_ERROR", errors: validationResult.error.flatten().fieldErrors} satisfies State
}

  const { error } = await supabaseServerClient.auth.signInWithPassword(validationResult.data)

  if (error) {
    return {
      status: "AUTH_ERROR",
      error
    }satisfies State;
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(_state: State, formData: FormData) {


  const formDataObj = Object.fromEntries(Array.from(formData.entries()));
 
  const validationResult = loginFormSchema.safeParse(formDataObj)

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;

    return {status:"FORM_ERROR", errors: JSON.parse(JSON.stringify(errors))}satisfies State
}

  const { error } = await supabaseServerClient.auth.signUp(validationResult.data)

  if (error) {
    return {
      status: "AUTH_ERROR",
      error: JSON.parse(JSON.stringify(error))
    } satisfies State;
  }

  revalidatePath('/', 'layout')
  redirect('/')
}