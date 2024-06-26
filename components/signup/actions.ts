'use server'

import { FormState } from '@/types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signUpFormSchema } from './schemas'
import { createClient } from '@/utils/supabase/server'

export async function signup(_state: FormState, formData: FormData) {
  const supabase = createClient()
  const formDataObj = Object.fromEntries(Array.from(formData.entries()))

  const validationResult = signUpFormSchema.safeParse(formDataObj)

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors

    return {
      status: 'FORM_ERROR',
      errors: JSON.parse(JSON.stringify(errors)),
    } satisfies FormState
  }

  const { error } = await supabase.auth.signUp(validationResult.data)

  if (error) {
    return {
      status: 'AUTH_ERROR',
      error: JSON.parse(JSON.stringify(error)),
    } satisfies FormState
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
