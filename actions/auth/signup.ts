'use server'

import { FormState } from '@/types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signUpFormSchema } from '../../components/signup/schemas'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { ActionCookie } from '@/components/toast-provider'

export async function signup(_state: FormState, formData: FormData) {
  const supabase = createClient()
  const formDataObj = Object.fromEntries(Array.from(formData.entries()))

  const validationResult = signUpFormSchema.safeParse(formDataObj)

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors

    return {
      status: 'FORM_ERROR',
      errors,
    } satisfies FormState
  }
  const { email, password, name } = validationResult.data
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: name,
      },
    },
  })

  if (error) {
    return {
      status: 'AUTH_ERROR',
      error: JSON.parse(JSON.stringify(error)),
    } satisfies FormState
  }

  cookies().set(
    'action',
    JSON.stringify({ title: 'signup' } satisfies ActionCookie),
    { secure: true },
  )
  revalidatePath('/', 'layout')
  redirect('/')
}
