'use client'

import { FormState } from '@/types'
import { FormSubmitButton } from '../form-submit-button'
import { logout } from '../../actions/auth/logout'
import { useFormState } from 'react-dom'
import { useToast } from '../ui/use-toast'
import { useEffect } from 'react'

const initState = { status: 'INIT' } satisfies FormState

export const LogoutButton = () => {
  const [state, action] = useFormState<FormState, FormData>(logout, initState)
  const { toast } = useToast()

  useEffect(() => {
    const hasAuthError = state.status === 'AUTH_ERROR'
    if (!hasAuthError) return
    toast({
      title: state.error.code,
    })
  }, [state, toast])

  return (
    <form action={action}>
      <FormSubmitButton>Logout</FormSubmitButton>
    </form>
  )
}
