'use client'

import { FormState } from '@/types'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { FormSubmitButton } from '../form-submit-button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useToast } from '../ui/use-toast'
import { signup } from './actions'

const initState = { status: 'INIT' } satisfies FormState

export const SignUpForm = () => {
  const [state, action] = useFormState<FormState, FormData>(signup, initState)
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
        <Label>Name</Label>
        <Input placeholder="Name" name="name" />
        {state.status === 'FORM_ERROR' && <div>{state.errors?.name}</div>}
      </div>
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
      <FormSubmitButton>Sign up</FormSubmitButton>
    </form>
  )
}
