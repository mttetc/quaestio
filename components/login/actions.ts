'use server'

import { FormState } from '@/types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { loginFormSchema } from './schemas'
import { createClient } from '@/utils/supabase/server'

export async function login(_state: FormState, formData: FormData) {
  const supabase = createClient()
  const formDataObj = Object.fromEntries(Array.from(formData.entries()))

  const validationResult = loginFormSchema.safeParse(formDataObj)

  if (!validationResult.success) {
    return {
      status: 'FORM_ERROR',
      errors: validationResult.error.flatten().fieldErrors,
    } satisfies FormState
  }

  const { error } = await supabase.auth.signInWithPassword(
    validationResult.data,
  )

  if (error) {
    return {
      status: 'AUTH_ERROR',
      error,
    } satisfies FormState
  }

  revalidatePath('/', 'layout')
  redirect('/?action=login_success')
}
