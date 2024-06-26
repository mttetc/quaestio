'use server'

import { ActionCookie } from '@/components/toast-provider'
import { FormState } from '@/types'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
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
  cookies().set(
    'action',
    JSON.stringify({ title: 'logout' } satisfies ActionCookie),
    { secure: true },
  )
  revalidatePath('/', 'layout')
  redirect('/')
}
