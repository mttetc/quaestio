'use server'

import { FormState } from '@/types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { loginFormSchema } from '../../components/login/schemas'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { ActionCookie } from '@/components/toast-provider'

export async function login(_state: FormState, formData: FormData) {
  const supabase = createClient()
  const formDataObj = Object.fromEntries(Array.from(formData.entries()))
  console.log('🚀 ~ login ~ formDataObj:', formDataObj)

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

  cookies().set(
    'action',
    JSON.stringify({ title: 'login' } satisfies ActionCookie),
    { secure: true },
  )
  revalidatePath('/', 'layout')
  redirect('/')
}
