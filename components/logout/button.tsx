'use client'

import { FormState } from '@/types'
import { FormSubmitButton } from '../form-submit-button'
import { logout } from './actions'
import { useFormState } from 'react-dom'
import { useToast } from '../ui/use-toast'
import { useEffect } from 'react'

export const LogoutButton = () => {
  const [state, action] = useFormState<FormState, FormData>(logout, {
    status: 'INIT',
  })
  const { toast } = useToast()

  useEffect(() => {
    const { status } = state
    console.log(state)
    if (status === 'INIT') return undefined
    if (state.status === 'AUTH_ERROR') {
      toast({
        title: state.error.code,
      })
    } else {
      toast({
        title: 'Success !',
      })
    }
  }, [state, toast])

  return (
    <form action={action}>
      <FormSubmitButton>Logout</FormSubmitButton>
    </form>
  )
}
