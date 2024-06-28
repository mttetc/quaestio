'use server'

import { FormState } from '@/types'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function logout(_state: FormState, _formData: FormData) {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return {
      status: 'AUTH_ERROR',
      error,
    } satisfies FormState
  }

  revalidatePath('/', 'layout')
  redirect('/?action=logout_success')
}
