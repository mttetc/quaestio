'use server'

import { FormState } from '@/types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { linkEmailFormSchema } from '../components/link-email/schemas'

export async function linkgmail(_state: FormState, formData: FormData) {
  const supabase = createClient()
  const formDataObj = Object.fromEntries(Array.from(formData.entries()))

  const validationResult = linkEmailFormSchema.safeParse(formDataObj)

  if (!validationResult.success) {
    return {
      status: 'FORM_ERROR',
      errors: validationResult.error.flatten().fieldErrors,
    } satisfies FormState
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ linked_gmail: formDataObj.email })
    .eq('id', user.id)

  if (error) {
    return {
      status: 'API_ERROR',
      error,
    } satisfies FormState
  }

  revalidatePath('/link-email', 'layout')

  return {
    status: 'SUCCESS',
  } satisfies FormState
}
