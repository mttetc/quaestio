'use client'

import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useToast } from '../ui/use-toast'
import { FormSubmitButton } from '../form-submit-button'
import { login } from './actions'
import { FormState } from '@/types'

const initState = { status: 'INIT' } satisfies FormState

export const LoginForm = () => {
  const [state, action] = useFormState<FormState, FormData>(login, initState)
  const { toast } = useToast()

  useEffect(() => {
    if (state.status !== 'AUTH_ERROR') return
    toast({
      title: state.error.code,
      description: 'prout',
    })
  }, [state, toast])

  return (
    <form action={action}>
      <div>
        <Label>Email</Label>
        <Input placeholder="Email" name="email" />
        {state.status === 'FORM_ERROR' && <div>{state.errors?.email}</div>}
      </div>
      <div>
        <Label>Password</Label>
        <Input type="password" placeholder="Password" name="password" />
        {state.status === 'FORM_ERROR' && <div>{state.errors?.password}</div>}
      </div>
      <FormSubmitButton>Login</FormSubmitButton>
    </form>
  )
}
